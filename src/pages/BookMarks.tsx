import Navbar from "@/components/Navbar";
import { getBooksmarks } from "@/lib/queriesGraphQL/querybookmarks";
import { useEffect, useState } from "react";

const BookMarks = () => {
  const username = "test3";

  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const fetchedBookmarks = await getBooksmarks();
        console.log("fetched Bookmarks", fetchedBookmarks);
        setBookmarks(fetchedBookmarks);
      } catch (error) {
        console.log("Error while fetching bookmarks", error);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <>
      <Navbar />
      <section className="">
        <header className="w-full mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-main/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-main/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-xl bg-main">
              {/* {profile.username.slice(0, 2).toUpperCase()} */}
              {username.slice(0, 2).toUpperCase()}
            </div>
            <h1 className="text-4xl mt-3 md:text-5xl font-bold font-display">
              {/* @{profile.username} */}@{username}
            </h1>
            <p className="text-gray-400 text-lg mt-5 font-display-inter mb-6">
              {/* {posts.length} {posts.length === 1 ? "article" : "articles"}{" "} */}
              You have 5 Articles Bookmarked published
            </p>
          </div>
        </header>
        <div>
            {bookmarks.map((bookmark) => (
                <div>
                    {bookmark}
                </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default BookMarks;
