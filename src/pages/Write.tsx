
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const Write = () => {
  return (
    <>
      <Navbar />
      <section className="w-full main mt-34 gap-20 bg-pink-300 flex flex-col items-center pb-9">
        <h1 className="text-center text-6xl">Create a new post</h1>
        <form action="" className="w-[80%] flex flex-col gap-20 items-center">
          <label htmlFor="title" className="w-full">
            <p className="text-main mb-2 text-2xl">Title:</p>
            <input className="w-full h-20 p-5 text-4xl border-2 rounded-2xl border-[#2d2d2d]" placeholder="E.g. Why Programmable Data" type="text" name="title" id="title" />
          </label>
          <label htmlFor="body" className="w-full">
            <p className="text-main mb-2 text-2xl">Body:</p>
            <textarea name="body" className="w-full h-100 p-5 text-2xl border-2 rounded-2xl border-[#2d2d2d]" id="body" placeholder="Tell your story..."></textarea>
          </label>
          <Button className="bg-main cursor-pointer hover:bg-main text-black font-medium px-8 py-5 text-lg">Store on Irys</Button>
        </form>
      </section>
    </>
  );
};

export default Write;
