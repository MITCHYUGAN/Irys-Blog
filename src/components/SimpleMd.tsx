import { Button } from "@/components/ui/button";
import { useState } from "react";
import SimpleMdeReact from "react-simplemde-editor";
import { useAccount } from "wagmi";
import "easymde/dist/easymde.min.css";
import { getIrysUploader } from "@/lib/irys";
import { useNavigate } from "react-router-dom";

const SimpleMd = () => {
  const [bodyInput, setBodyInput] = useState("");
  const { address } = useAccount();
  const navigate = useNavigate();

  const uploadDataToIrys = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!bodyInput) {
      alert("Please enter content.");
      return;
    }

    console.log("BodyInput", bodyInput);

    try {
      const irys = await getIrysUploader();

// Step 1: Generate Markdown with YAML frontmatter for metadata
      const frontmatter = `---\nauthor: ${address}\ncreatedAt: ${Date.now()}\n---\n\n${bodyInput}`;
      const mdContent = frontmatter;

      // Step 2: Create File from string
      const mdBlob = new Blob([mdContent], { type: "text/markdown" });
      const mdFile = new File([mdBlob], `post-${Date.now()}.md`, { type: "text/markdown", lastModified: Date.now() });

      // Step 3: Upload with tags
      const tags = [
        { name: "application-id", value: "test-blog1" },
        { name: "type", value: "post" },
        { name: "Content-Type", value: "text/markdown" },
        { name: "author", value: address },
      ];

      const receipt = await irys.uploadFile(mdFile, { tags });
      console.log(`Markdown uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
      alert(`Post uploaded! View at https://gateway.irys.xyz/${receipt.id}`);

      // Clear inputs and redirect
      setBodyInput("");
      navigate("/");
    } catch (error) {
      console.error("Error uploading data ", error);
      alert("Error uploading post. Check console for details.");
    }
  };

  return (
    <section
      style={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form
        action=""
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "80px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          uploadDataToIrys();
        }}
      >
        <SimpleMdeReact
          value={bodyInput}
          onChange={setBodyInput}
          style={{ color: "black", backgroundColor: "white", width: "100%" }}
        />
        <Button
          type="submit"
          className="bg-main text-black font-medium px-10 py-8 text-2xl"
          style={{
            cursor: "pointer",
            color: "black",
            border: "none",
            padding: "30px 35px",
            fontSize: "24px",
          }}
        >
          Store on Irys
        </Button>
      </form>
    </section>
  );
};

export default SimpleMd;
