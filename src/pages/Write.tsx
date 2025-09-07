import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAccount } from "wagmi";
import { getIrysUploader } from "@/lib/irys";
import { useNavigate } from "react-router-dom";

const Write = () => {
  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const { address } = useAccount();
  const navigate = useNavigate()

  const uploadDataToIrys = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!titleInput || !bodyInput) {
      alert("Please enter a title and body.");
      return;
    }

    try {
      const irys = await getIrysUploader();

      const dataToUpload = {
        title: titleInput,
        body: bodyInput,
        createdAt: Date.now(),
        author: address,
      };

      const tags = [
        { name: "application-id", value: "irys-blog" },
        { name: "type", value: "post" },
        { name: "Content-Type", value: "application/json" },
        { name: "author", value: address },
      ];

      const receipt = await irys.upload(JSON.stringify(dataToUpload), {tags: tags});
      console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
      alert(`Post uploaded successfully! View at https://gateway.irys.xyz/${receipt.id}`);

      // Clear inputs after successful upload
      setTitleInput("");
      setBodyInput("");
      navigate("/")

    } catch (error) {
      console.error("Error uploading data ", error);
      alert("Error uploading post. Check console for details.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="w-full main mt-34 gap-20 bg-pink-300 flex flex-col items-center pb-9">
        <h1 className="text-center text-6xl">Create a new post</h1>
        <form action="" className="w-[80%] flex flex-col gap-20 items-center" onSubmit={(e) => {e.preventDefault(); uploadDataToIrys();}}>
          <label htmlFor="title" className="w-full">
            <p className="text-main mb-2 text-2xl">Title:</p>
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full h-20 p-5 text-4xl border-2 rounded-2xl border-[#2d2d2d]"
              placeholder="E.g. Why Programmable Data"
              type="text"
              name="title"
              id="title"
              required
            />
          </label>
          <label htmlFor="body" className="w-full">
            <p className="text-main mb-2 text-2xl">Body:</p>
            <textarea
              value={bodyInput}
              onChange={(e) => setBodyInput(e.target.value)}
              name="body"
              className="w-full h-100 p-5 text-2xl border-2 rounded-2xl border-[#2d2d2d]"
              id="body"
              placeholder="Tell your story..."
              required
            ></textarea>
          </label>
          <Button
            type="submit"
            className="bg-main cursor-pointer hover:bg-main text-black font-medium px-8 py-5 text-lg"
          >
            Store on Irys
          </Button>
        </form>
      </section>
    </>
  );
};

export default Write;
