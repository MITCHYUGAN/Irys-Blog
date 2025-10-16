import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";
import axios from "axios";

const GRAPHQL_ENDPOINT = "https://devnet.irys.xyz/graphql";
const GATEWAY_URL = "https://devnet.irys.xyz";

export const getIrysUploader = async () => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error("No Ethereum provider found. Please install and Eth wallet like (MetaMask).");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    // const rpcUrl = "https://1rpc.io/sepolia";
    const rpcUrl = "https://testnet-rpc.irys.xyz/v1/execution-rpc";
    const uploader = await WebUploader(WebEthereum)
        .withAdapter(EthersV6Adapter(provider))
        .withRpc(rpcUrl)
        .devnet();

    return uploader
}

// Upload user profile
export const uploadProfile = async (username: string, bio: string, author: string) => {
  const irys = await getIrysUploader();
  const dataToUpload = { username, bio, author, createdAt: Date.now() };
  const tags = [
    { name: "application-id", value: `${import.meta.env.VITE_APPLICATION_ID}` },
    { name: "type", value: "profile" },
    { name: "Content-Type", value: "application/json" },
    { name: "author", value: author },
    {name: "username", value: username},
  ];
  const receipt = await irys.upload(JSON.stringify(dataToUpload), { tags });
  console.log(`Profile created success fully: https://gateway.irys.xyz/${receipt.id}`)
  return receipt.id;
};

// Query profile by author wallet
export async function getProfile(author: string) {
  const query = `
    query {
      transactions(
        tags: [
          { name: "application-id", values: ["${import.meta.env.VITE_APPLICATION_ID}"] }
          { name: "type", values: ["profile"] }
          { name: "author", values: ["${author}"] }
        ],
        order: DESC,
        limit: 1
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  const edges = response.data.data.transactions.edges;
  if (edges.length > 0) {
    const id = edges[0].node.id;
    const contentResponse = await axios.get(`${GATEWAY_URL}/${id}`);
    return contentResponse.data;
  }
  return null;
};

export async function checkUsername(username: string) {
  const query = `
    query {
      transactions(
        tags: [
          { name: "application-id", values: ["${import.meta.env.VITE_APPLICATION_ID}"] }
          { name: "type", values: ["profile"] }
          { name: "username", values: ["${username}"] }
        ],
        limit: 1
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  return response.data.data.transactions.edges.length > 0;
};