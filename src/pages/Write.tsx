
import Navbar from "@/components/Navbar";

const Write = () => {
  return (
    <>
      <Navbar />
      <section className="main">
        <h1>Create a new post</h1>
        <form action="">
          <label htmlFor="title">
            <p>Label</p>
            <input type="text" name="title" id="title" />
          </label>
        </form>
      </section>
    </>
  );
};

export default Write;
