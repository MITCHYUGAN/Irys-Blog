import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { Loader2, Upload } from "lucide-react";
import { getIrysUploader } from "@/lib/irys";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

const ReactQuillEditor = () => {
  const [value, setValue] = useState("");
  const { address } = useAccount();
  const navigate = useNavigate();

  const UploadContentToIrys = async (e) => {
    e.preventDefault();
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
      navigate("/");
    } catch (error) {
      console.log(`Error while uploading: ${error}`);
    }
  };

  return (
    <>
      <form
        className="w-full max-w-[85%] flex flex-col items-center gap-10"
        action=""
        onSubmit={UploadContentToIrys}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="bg-white w-full"
        />
        <Button
          type="submit"
          // disabled={isUploading}
          className="bg-main hover:bg-main/90 btn-store_on_irys text-black font-semibold px-12 py-7 text-xl rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-display-inter"
        >
          {/* {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : ( */}
          <>
            <Upload className="w-5 h-5 mr-2" />
            Publish to Irys
          </>
          {/* )} */}
        </Button>
      </form>
    </>
  );
};

export default ReactQuillEditor;
