const fromTimestamp = 1760768587663 // 30 days ago
const toTimestamp = Date.now();

const query = `
  query getByIds {
	  transactions(
      tags: [
        {name: "application-id", values: "${import.meta.env.VITE_APPLICATION_ID}" }
        {name: "type", values: "${import.meta.env.VITE_TYPE}"}
      ],
      timestamp: { from: ${fromTimestamp}, to: ${toTimestamp} },
      order: DESC,
    ) {
		edges {
			node {
				id
        tags {
              name
              value
        }
        timestamp
			}
		}
	}
}
`;

const getArticles = async () => {
  const response = await fetch("https://devnet.irys.xyz/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const { data } = await response.json();
  console.log("Raw data:", data);

  if (!data?.transactions?.edges || data.transactions.edges.length === 0) {
    throw new Error("No articles found");
  }

  const articles: { id: string; content: string; tags: object; timestamp: number }[] = [];
  // Loop through data and fetch the actual content
  for (const edge of data.transactions.edges) {
    const id = edge.node.id;
    const tags = edge.node.tags;
    const timestamp = edge.node.timestamp;
    const postData = await fetch(`https://gateway.irys.xyz/${id}`);
    const content = await postData.text();
    // console.log("Post", content);
    articles.push({ id, content, tags, timestamp});
  }

  console.log("Artic", articles);
  return articles;
};

export default getArticles;
