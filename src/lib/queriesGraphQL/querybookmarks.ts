const query = `
query getByTags {
	transactions(
        tags: [
            { name: "application-id", values: "test-blog2" },
            { name: "type", values: "test1-bookmarks" },
            { name: "author", values: "0xdB7a558465eD6aC84076fCdEde5aa5d2fE0F6d0E" },
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

export const getBooksmarks = async () => {
  const response = await fetch("https://devnet.irys.xyz/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const JsonResponse = await response.json();
  const data = JsonResponse.data;
  console.log("Raw Data", data);

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

  console.log("Bookmarks Array", bookmarks);
  return bookmarks;
};

export const isBookmarked = async (postId: string) => {
  const query = `
    query checkBookmark {
      transactions(
        tags: [
          { name: "application-id", values: "test-blog2" },
          { name: "type", values: "test11-bookmarks" },
          { name: "author", values: "0xdB7a558465eD6aC84076fCdEde5aa5d2fE0F6d0E" },
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
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({query})
  })

  const JsonResponse = await response.json()
  const data = await JsonResponse.data
  return data?.transactions?.edges?.length > 0
};

// export default {getBooksmarks, isBookmarked};
