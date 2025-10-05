import axios from "axios";

const GRAPHQL_ENDPOINT = "https://devnet.irys.xyz/graphql";
const GATEWAY_URL = "https://devnet.irys.xyz";

export async function queryGraphQL(query: string) {
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  console.log("GraphQL Response:", response.data); // For debugging

  if (response.data.errors) {
    console.error("GraphQL Errors:", response.data.errors);
    throw new Error("GraphQL query failed");
  }
  return response.data.data.transactions;
}

// Fetch all posts (latest 10)
export async function getPost() {
const fromTimestamp = Date.now() - (30 * 24 * 60 * 60 * 1000);  // 30 days ago
  const toTimestamp = Date.now();  // Now
  const query = `
    query {
      transactions(
        tags: [
          { name: "application-id", values: ["test-blog1"] }
          { name: "type", values: ["post"] }
        ],
        timestamp: { from: ${fromTimestamp}, to: ${toTimestamp} },
        order: DESC,
        limit: 10
      ) {
        edges {
          node {
            id
            timestamp
            tags {
              name
              value
            }
          }
        }
      }
    }
    `;

  const { edges } = await queryGraphQL(query);
  const posts = await Promise.all(
    edges.map(async (edge: any) => {
      const { id } = edge.node;
      const contentResponse = await axios.get(`${GATEWAY_URL}/${id}`);
      return {
        id,
        markdown: contentResponse.data,
        timestamp: edge.node.timestamp,
        tags: edge.node.tags,
      };
    })
  ).then(posts => posts.filter(post => post !== null)); // Filter out failed fetches

  // Deduplicate posts based on title and body
  const uniquePosts = Array.from(
    new Map(posts.map(post => [post.markdown.slice(0, 500), post])).values()
  );

  return uniquePosts;
}
