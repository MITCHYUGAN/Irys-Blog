import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

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