
import { getIrysUploader } from "../irys";

export const handleBookmark = async (address: string, postId: any) => {

  console.log("Bookmark Clicked");
  console.log("postID", postId);

  if (!address) {
    alert("Please connect your wallet to bookmark articles.");
    return;
  }

  // check if post is already bookmarked
  const alreadyBookmarked = await isBookmarked(postId, address);
  if (alreadyBookmarked) {
    alert("Article already bookmarked");
    console.log("Arthor", address)
    return;
  }

  const dataToUpload = postId;

  const tags = [
    {
      name: "application-id",
      value: `${import.meta.env.VITE_APPLICATION_ID}`,
    },
    { name: "type", value: `${import.meta.env.VITE_BOOKMARK_TYPE}` },
    { name: "author", value: `${address}` },
    { name: "Content-Type", value: "text/plain" },
    { name: "post-id", value: `${postId}` },
  ];

  try {
    const irys = await getIrysUploader();
    const receipt = await irys.upload(dataToUpload, { tags });
    console.log(`Upload Successfully. https://gateway.irys.xyz/${receipt.id}`);
    alert("Article Bookmarked successfully")
  } catch (error) {
    console.log("error while uploading", error);
  }
};



export const getBookmarks = async (address: string) => {
  const query = `
    query getByTags {
        transactions(
            tags: [
                { name: "application-id", values: "${import.meta.env.VITE_APPLICATION_ID}" },
                { name: "type", values: "${import.meta.env.VITE_BOOKMARK_TYPE}" },
                { name: "author", values: "${address}" },
            ]
        ) {
            edges {
                node {
                    id
                    address
                }
            }
        }
    }
`;

  const response = await fetch("https://devnet.irys.xyz/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const JsonResponse = await response.json();
  const data = JsonResponse.data;
  //   console.log("Raw Data", data);

  if (!data?.transactions?.edges || data.transactions.edges.length === 0) {
    return [];
  }

  const bookmarks = [];
  for (const edge of data.transactions.edges) {
    const id = edge.node.id;
    const bookMarkResponse = await fetch(`https://gateway.irys.xyz/${id}`);
    const getEachBookMarks = await bookMarkResponse.text();
    bookmarks.push(getEachBookMarks);
  }
  console.log("Bookmarks", bookmarks)
  return bookmarks;
};

export const isBookmarked = async (postId: string, address: string) => {
  const query = `
    query checkBookmark {
      transactions(
        tags: [
          { name: "application-id", values: "${import.meta.env.VITE_APPLICATION_ID}" },
          { name: "type", values: "${import.meta.env.VITE_BOOKMARK_TYPE}" },
          { name: "author", values: "${address}" },
          { name: "post-id", values: "${postId}" }
        ],
        first: 1
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  const response = await fetch("https://devnet.irys.xyz/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const JsonResponse = await response.json();
  const data = await JsonResponse.data;
  return data?.transactions?.edges?.length > 0;
};
