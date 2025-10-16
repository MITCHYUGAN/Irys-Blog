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

export async function getUserPost(address?: string) {
const userAddress = address;  // Default or from param
  const fromTimestamp = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days ago
  const toTimestamp = Date.now(); // Now
  const query = `
    query {
      transactions(
        owners: ["${userAddress}"]
        tags: [
          { name: "application-id", values: ["${import.meta.env.VITE_APPLICATION_ID}"] }
          { name: "type", values: ["${import.meta.env.VITE_TYPE}"] }
        ],
        timestamp: { from: ${fromTimestamp}, to: ${toTimestamp} },
        order: DESC,
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
      const contentResponse = await axios.get(`${GATEWAY_URL}/${id}`, {
        responseType: "text",
      });
      return {
        id,
        content: contentResponse.data,
        timestamp: edge.node.timestamp,
        tags: edge.node.tags,
      };
    })
  ).then((posts) => posts.filter((post) => post !== null)); // Filter out failed fetches

  // Deduplicate posts based on title and body
  const uniquePosts = Array.from(
    new Map(posts.map((post) => [post.content.slice(0, 500), post])).values()
  );

  return uniquePosts;
}


export async function getProfileByUsername(username: string) {
  const query = `
    query {
      transactions(
        tags: [
          { name: "application-id", values: ["${import.meta.env.VITE_APPLICATION_ID}"] }
          { name: "type", values: ["profile"] }
          { name: "username", values: ["${username.replace(/^@/, "")}"] }
        ],
        order: DESC,
        limit: 1
      ) {
        edges {
          node {
            id
            tags { name value }
          }
        }
      }
    }
  `;
  const { edges } = await queryGraphQL(query);
  if (edges.length === 0) {
    return null;
  }
  const profileData = await (await fetch(`https://devnet.irys.xyz/${edges[0].node.id}`)).json();
  return profileData;
}