import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { Loader2, Upload } from "lucide-react";
import { getIrysUploader } from "@/lib/irys";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { ethers, AddressLike } from "ethers";

const ReactQuillEditor = () => {
  const [value, setValue] = useState("");
  const { address } = useAccount();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [buttonText, setButtonText] = useState("Publish to Irys");
  const quillRef = useRef(null);

  const UploadContentToIrys = async (e: any) => {
    e.preventDefault();
    setUploading(true);
    setButtonText("Publishing...");
    console.log("Value", value);

    const irys = await getIrysUploader();

    const tags = [
      {
        name: "application-id",
        value: `${import.meta.env.VITE_APPLICATION_ID}`,
      },
      { name: "type", value: `${import.meta.env.VITE_TYPE}` },
      { name: "Content-Type", value: "text/html" },
      { name: "author", value: `${address}` },
    ];

    try {
      const receipt = await irys.upload(value, { tags });
      console.log(
        `Uploaded Successfully: https://gateway.irys.xyz/${receipt.id}`
      );
      setValue("");
      alert(`Upload successful. View here: https://gateway.irys.xyz/${receipt.id}`)
      setUploading(false)
      navigate("/");
    } catch (error: any) {
      console.log(`Error while uploading: ${error}`);

      // Check if error is payment-related (e.g., 402 or balance insufficient)
      if (
        error.message.includes("402") ||
        error.message.includes("Not enough balance") ||
        error.message.includes("Payment Required")
      ) {
        setButtonText("Checking Funding...");
        const balanceAtomic = await irys.getBalance();
        const balance = irys.utils.fromAtomic(balanceAtomic);

        // Calculate upload cost based on content size
        const contentSize = new Blob([value]).size; // Size in bytes
        const priceAtomic = await irys.getPrice(contentSize);
        const price = irys.utils.fromAtomic(priceAtomic);
        console.log(`Insufficient Balance ${balance}. You need: ${price} ETH`);

        // Check wallet balance
        const provider = new ethers.BrowserProvider(window.ethereum);
        const walletBalance = await provider.getBalance(address as AddressLike);
        const walletBalanceEth = ethers.formatEther(walletBalance);

        if (parseFloat(walletBalanceEth) < parseFloat(price)) {
          setButtonText("Funding Failed");
          alert(
            `Funding failed. Fund your wallet with at least ${price} SEPOLIA ETH. Get it here: https://sepolia-faucet.pk910.de/`
          );
          setUploading(false);
          return;
        }

        // Attempt to fund Irys
        setButtonText("Funding...");
        try {
          const fundAmount = priceAtomic; // Fund exact amount needed
          const fundTx = await irys.fund(fundAmount);
          console.log(
            `Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${
              irys.token
            }`
          );
          setButtonText("Funding Successful, Retrying Upload...");

          // Wait for balance to update (e.g., 10 seconds)
          setButtonText("Waiting for Balance Update...");
          await new Promise((resolve) => setTimeout(resolve, 100000)); // 1mins delay

          // Retry upload after funding
          const retryReceipt = await irys.upload(value, { tags });
          console.log(
            `Uploaded Successfully after funding: https://gateway.irys.xyz/${retryReceipt.id}`
          );
          setValue("");
          setUploading(false)
          // navigate("/");
        } catch (fundError) {
          setButtonText("Funding Failed");
          console.log(`Error funding Irys: ${fundError}`);
          alert(
            `Funding failed. Fund your wallet with at least ${price} SEPOLIA ETH. Get it here: https://sepolia-faucet.pk910.de/`
          );
          setUploading(false);
          return;
        }
      } else {
        // Non-payment-related error
        setButtonText("Publish to Irys");
        alert("Upload failed due to a network or server error. Check console.");
        setUploading(false);
      }
    } finally {
      if (!uploading) {
        setButtonText("Publish to Irys");
      }
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
    // imageResize: {
    //   parchment: Quill.import("parchment"),
    //   modules: ["Resize", "DisplaySize"],
    // },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <>
      <form
        className="w-full max-w-[85%] flex flex-col items-center gap-10 form"
        action=""
        onSubmit={UploadContentToIrys}
      >

        <ReactQuill
          // placeholder={this.props.placeholder}
          ref={quillRef}
          modules={modules}
          formats={formats}
          bounds={"#root"}
          theme="snow"
          value={value}
          onChange={setValue}
          className="bg-white w-full min-h-[50vh]"
        />
        <Button
          type="submit"
          disabled={uploading}
          className="bg-main hover:bg-main/90 btn-store_on_irys text-black font-semibold px-12 py-7 text-xl rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-display-inter"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {buttonText}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      </form>
    </>
  );
};


export default ReactQuillEditor;
