// src/components/Froala.tsx
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

import FroalaEditorComponent from "react-froala-wysiwyg";
import { getIrysUploader } from "@/lib/irys";
import { useAccount } from "wagmi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Loader2, Upload } from "lucide-react";

const Froala = () => {
  const [model, setModel] = useState(""); // Initial markdown content
  const [isUploading, setIsUploading] = useState(false);
  const { address } = useAccount();
  const navigate = useNavigate();

  // Custom image upload handler for Froala
  const handleImageUpload = async (
    files: File[],
    callback: (url: string, error?: string) => void
  ) => {
    if (!address) {
      callback("", "Please connect your wallet first to upload images");
      alert("Please connect your wallet to upload images");
      return;
    }

    try {
      const irys = await getIrysUploader();
      const file = files[0]; // Handle first file; Froala sends one at a time

      const tags = [
        { name: "Content-Type", value: file.type },
        {
          name: "application-id",
          value: import.meta.env.VITE_APPLICATION_ID || "test-blog2",
        },
        { name: "type", value: "image" },
        { name: "author", value: address },
      ];

      const receipt = await irys.uploadFile(file, { tags });
      const imageUrl = `https://gateway.irys.xyz/${receipt.id}`;

      callback(imageUrl); // Insert URL into editor
    } catch (error) {
      console.error("Error uploading image:", error);
      callback("", "Failed to upload image. Please try again.");
      alert("Failed to upload image. Check console for details.");
    }
  };

  const uploadDataToIrys = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!model) {
      alert("Please enter content.");
      return;
    }

    setIsUploading(true);

    try {
      const irys = await getIrysUploader();

      const dataToUpload = model; // Model is the full content (now HTML)

      const tags = [
        { name: "application-id", value: "test-blog2" },
        { name: "type", value: "post" },
        { name: "Content-Type", value: "text/html" }, // Changed to HTML
        { name: "author", value: address },
      ];

      const receipt = await irys.upload(dataToUpload, { tags });
      console.log(`Content uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
      alert(`Post uploaded! View at https://gateway.irys.xyz/${receipt.id}`);

      setModel("");
      navigate("/");
    } catch (error) {
      console.error("Error uploading data ", error);
      alert("Error uploading post. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  // Froala config with custom image upload, now preserving HTML
  const config = {
    placeholderText: "Write your article here... You can paste images directly!",
    charCounterCount: false,
    events: {
      "image.beforeUpload": function (files: File[]) {
        handleImageUpload(files, (url: string, error?: string) => {
          if (error) {
            this.image.showMsg(error, "error");
          } else {
            this.image.insert(url, null, null, this.image.get());
          }
        });
        return false; // Prevent default upload
      },
    },
    htmlAllowedTags: ["p", "h1", "h2", "h3", "ul", "li", "strong", "em", "blockquote", "figure", "img", "source"], // Allow necessary HTML tags
    htmlAllowedAttrs: ["style", "class", "src", "alt", "width", "height", "srcset", "sizes", "type", "data-*"], // Allow necessary attributes
  };

  return (
    <section className="w-full max-w-[85%] px-6 flex flex-col items-center pb-20">
      <form
        className="w-full flex flex-col items-center gap-8"
        onSubmit={(e) => {
          e.preventDefault();
          uploadDataToIrys();
        }}
      >
        <div className="editor-wrapper w-full bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 shadow-xl">
          <FroalaEditorComponent
            model={model}
            onModelChange={setModel}
            tag="textarea"
            config={config}
          />
        </div>

        <Button
          type="submit"
          disabled={isUploading}
          className="bg-main hover:bg-main/90 btn-store_on_irys text-black font-semibold px-12 py-7 text-xl rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-display-inter"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Publish to Irys
            </>
          )}
        </Button>
      </form>
    </section>
  );
};

export default Froala;