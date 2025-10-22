import { getIrysUploader } from "../irys";
import { useBookmarkStore } from "../store";
import { debounce } from "lodash";

// Checks the latest state via /mutable/:txId and appends to the chain.
export const handleBookmark = async (address: string, postId: any) => {
  if (!address) {
    alert("Please connect your wallet to bookmark articles.");
    return;
  }

  // Check if post is already bookmarked using mutable endpoint
  const { isBookmarked, rootTxId } = await checkBookmarkStatus(postId, address);
  // console.log("Bookmark Status", { isBookmarked, rootTxId });

  if (isBookmarked) {
    alert("Article already bookmarked");
    return;
  }

  const dataToUpload = postId;
  const tags = [
    {
      name: "application-id",
      value: `${import.meta.env.VITE_APPLICATION_ID}`,
    },
    { name: "type", value: `${import.meta.env.VITE_BOOKMARK_TYPE}` },
    { name: "author", value: address.toLowerCase() },
    { name: "Content-Type", value: "text/plain" },
    { name: "post-id", value: postId },
    ...(rootTxId ? [{ name: "Root-TX", value: rootTxId }] : []), // Add Root-TX if updating chain
  ];

  try {
    const irys = await getIrysUploader();
    const receipt = await irys.upload(dataToUpload, { tags });
    console.log(
      `Bookmark Uploaded: https://gateway.irys.xyz/mutable/${receipt.id}`,
      { tags }
    );
    alert("Article bookmarked successfully!");
  } catch (error) {
    console.error("Error uploading bookmark:", error);
    alert("Failed to add bookmark. Please try again.");
  }
};

export const toggleBookmark = debounce(
  async (address: string, postId: string) => {

    if (!address) {
      console.warn("No wallet address provided for bookmark toggle");
      alert("Please connect your wallet to bookmark articles.");
      return;
    }

    const { isBookmarked, rootTxId } = await checkBookmarkStatus(
      postId,
      address
    );

    if (isBookmarked) {
      // Bookmark exists, remove it
      await removeBookmark(postId, address);
      useBookmarkStore.getState().removeBookmark(postId); // Update store optimistically
      setTimeout(() => {
        alert("Bookmark removed successfully!");
      }, 6000);
    } else {
      // Bookmark doesn't exist, add it
      const dataToUpload = postId;
      const tags = [
        {
          name: "application-id",
          value: `${import.meta.env.VITE_APPLICATION_ID}`,
        },
        { name: "type", value: `${import.meta.env.VITE_BOOKMARK_TYPE}` },
        { name: "author", value: address.toLowerCase() },
        { name: "Content-Type", value: "text/plain" },
        { name: "post-id", value: postId },
        ...(rootTxId ? [{ name: "Root-TX", value: rootTxId }] : []), // Add Root-TX if updating chain
      ];

      try {
        const irys = await getIrysUploader();
        const receipt = await irys.upload(dataToUpload, { tags });
        console.log(
          `Bookmark Added: https://gateway.irys.xyz/mutable/${receipt.id}`,
          { tags }
        );
        useBookmarkStore.getState().addBookmark(postId); // Update store optimistically
        alert("Article bookmarked successfully!");
      } catch (error) {
        console.error("Error adding bookmark:", error);
        alert("Failed to add bookmark. Please try again.");
      }
    }
  },
  1000
);

// New: Helper to check bookmark status using mutable endpoint and Root-TX
const checkBookmarkStatus = async (postId: string, address: string) => {

  const query = `
    query checkBookmark {
      transactions(
        tags: [
          { name: "application-id", values: "${
            import.meta.env.VITE_APPLICATION_ID
          }" },
          { name: "type", values: "${import.meta.env.VITE_BOOKMARK_TYPE}" },
          { name: "author", values: "${address.toLowerCase()}" },
          { name: "post-id", values: "${postId}" }
        ],
        first: 1,
        order: DESC
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://devnet.irys.xyz/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const jsonResponse = await response.json();
    const data = jsonResponse.data;

    if (!data?.transactions?.edges?.length) {
      console.log("No bookmark transaction found for postId", postId);
      return { isBookmarked: false, rootTxId: null };
    }

    const txId = data.transactions.edges[0].node.id;
    let latestData = "";
    try {
      const bookMarkResponse = await fetch(
        `https://gateway.irys.xyz/mutable/${txId}`
      );
      latestData = await bookMarkResponse.text();
      console.log("Mutable Data Fetched", { txId, latestData });
    } catch (error) {
      console.error("Error fetching mutable data for txId:", txId, error);
      return { isBookmarked: false, rootTxId: txId };
    }

    return {
      isBookmarked: latestData !== "" && latestData === postId,
      rootTxId: txId,
    };
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return { isBookmarked: false, rootTxId: null };
  }
};

export const getBookmarks = async (address: string) => {

  if (!address) {
    console.warn("No address provided for getBookmarks");
    return [];
  }

  const query = `
    query getByTags {
        transactions(
            tags: [
                { name: "application-id", values: "${
                  import.meta.env.VITE_APPLICATION_ID
                }" },
                { name: "type", values: "${
                  import.meta.env.VITE_BOOKMARK_TYPE
                }" },
                { name: "author", values: "${address.toLowerCase()}" },
            ],
            order: DESC,
        ) {
            edges {
                node {
                    id
                    tags {
                        name
                        value
                    }
                }
            }
        }
    }
`;

try {
    const response = await fetch("https://devnet.irys.xyz/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const jsonResponse = await response.json();
    const data = jsonResponse.data;

    if (!data?.transactions?.edges || data.transactions.edges.length === 0) {
      console.log("No bookmark transactions found");
      useBookmarkStore.getState().setBookmarks([]);
      return [];
    }

    const bookmarks = new Set<string>();
    for (const edge of data.transactions.edges) {
      const txId = edge.node.id;
      const postIdTag = edge.node.tags.find((tag: any) => tag.name === "post-id")?.value;
      if (!postIdTag) {
        console.warn("No post-id tag found for txId", txId);
        continue;
      }
      try {
        const bookMarkResponse = await fetch(`https://gateway.irys.xyz/mutable/${txId}`);
        const latestData = await bookMarkResponse.text();
        console.log("Mutable Data for txId", { txId, latestData });
        if (latestData && latestData !== "") {
          bookmarks.add(latestData);
        }
      } catch (error) {
        console.error("Error fetching mutable data for txId:", txId, error);
      }
    }

    const validBookmarks = Array.from(bookmarks);
    console.log("Valid Bookmarks", validBookmarks);
    useBookmarkStore.getState().setBookmarks(validBookmarks); // Update store
    return validBookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    useBookmarkStore.getState().setBookmarks([]);
    return [];
  }
};

// Modified: Updated isBookmarked to check the latest transaction in the Root-TX chain.
export const isBookmarked = async (postId: string, address: string) => {
  //   const query = `
  //     query checkBookmark {
  //       transactions(
  //         tags: [
  //           { name: "application-id", values: "${
  //             import.meta.env.VITE_APPLICATION_ID
  //           }" },
  //           { name: "type", values: "${import.meta.env.VITE_BOOKMARK_TYPE}" },
  //           { name: "author", values: "${address}" },
  //           { name: "post-id", values: "${postId}" }
  //         ],
  //         first: 1
  //       ) {
  //         edges {
  //           node {
  //             id
  //           }
  //         }
  //       }
  //     }
  //   `;

  //   const response = await fetch("https://devnet.irys.xyz/graphql", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ query }),
  //   });

  //   const JsonResponse = await response.json();
  //   const data = await JsonResponse.data;
  //   return data?.transactions?.edges?.length > 0;
   if (!address || !postId) {
    console.warn("Invalid parameters for isBookmarked", { postId, address });
    return false;
  }
  const { isBookmarked } = await checkBookmarkStatus(postId, address);
  console.log("Is Bookmarked?", { postId, isBookmarked });
  return isBookmarked;
};

// Modified: Updated removeBookmark to use debouncing and update store
export const removeBookmark = debounce(async (postId: string, address: string) => {

  const { rootTxId } = await checkBookmarkStatus(postId, address);
  if (!rootTxId) {
    console.error("No bookmark found to remove for postId:", postId);
    throw new Error("No bookmark found to remove");
  }

  const dataToUpload = "";
  const tags = [
    { name: "application-id", value: `${import.meta.env.VITE_APPLICATION_ID}` },
    { name: "type", value: `${import.meta.env.VITE_BOOKMARK_TYPE}` },
    { name: "author", value: address.toLowerCase() },
    { name: "post-id", value: postId },
    { name: "Content-Type", value: "text/plain" },
    { name: "Root-TX", value: rootTxId },
  ];

  try {
    const irys = await getIrysUploader();
    const receipt = await irys.upload(dataToUpload, { tags });
    console.log(`Remove Bookmark Uploaded: https://gateway.irys.xyz/mutable/${rootTxId}`);
    useBookmarkStore.getState().removeBookmark(postId); // Update store optimistically
    return receipt.id;
  } catch (error) {
    console.error("Error uploading remove bookmark", error);
    throw error;
  }
}, 1000);
