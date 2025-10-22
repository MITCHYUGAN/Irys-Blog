import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getPostById } from "@/lib/queriesGraphQL/graphql";
import {
  ArrowRight,
  Bookmark,
  Clock,
  FileText,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import DOMPurify from "dompurify";
import {
  getBookmarks,
  removeBookmark,
} from "@/lib/queriesGraphQL/querybookmarks";
import Footer from "@/components/Footer";
import { getProfile } from "@/lib/irys";
import { useBookmarkStore } from "@/lib/store";

interface Article {
  id: string;
  content: string;
  username: string;
  author: string;
  createdAt: number;
  likes: number;
  comments: number;
  readTime: string;
}

const BookMarks = () => {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  // const [hasFetched, setHasFetched] = useState(false); // New: Track if bookmarks have been fetched
  const navigate = useNavigate();
  const bookmarkIds = useBookmarkStore((state) => state.bookmarks); // New: Get bookmark IDs from store
  const [profileUsername, setProfileUsername] = useState<string | null>(null); // New: State for dynamic username

  // Fetch profile username for header
  useEffect(() => {
    const fetchProfile = async () => {
      if (address) {
        try {
          const profile = await getProfile(address);
          setProfileUsername(
            profile?.username || address.slice(0, 6) + "..." + address.slice(-4)
          );
          console.log("Fetched Profile Username", profile?.username);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfileUsername(address.slice(0, 6) + "..." + address.slice(-4));
        }
      }
    };
    fetchProfile();
  }, [address]);


  // Modified: Fetch bookmarks whenever bookmarkIds or address changes
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!address) {
        console.warn("No wallet connected, skipping bookmark fetch");
        setBookmarks([]); // Clear bookmarks if no address
        setLoading(false);
        return;
      }

      try {
        // Always fetch articles for current bookmarkIds
        const bookmarkPost: Article[] = await Promise.all(
          bookmarkIds.map(async (postId: string) => {
            try {
              const post = await getPostById(postId);
              if (!post) {
                console.warn(`Skipping invalid postId: ${postId}`);
                return null;
              }
              const authorTag =
                post.tags.find((t: any) => t.name === "author")?.value ||
                "Anonymous";
              const profile = await getProfile(authorTag);
              const plainText = post.content;
              return {
                id: post.id,
                content: post.content,
                author: authorTag.slice(0, 6) + "..." + authorTag.slice(-4),
                createdAt: post.timestamp,
                likes: 0,
                comments: 0,
                readTime: `${Math.ceil(plainText.split(" ").length / 200)} min read`,
                username: profile?.username || authorTag,
              };
            } catch (error) {
              console.error(`Failed to fetch post ${postId}:`, error);
              return null;
            }
          })
        );

        setBookmarks(bookmarkPost.filter((post): post is Article => post !== null));
        console.log("Bookmarks Rendered", bookmarkPost);
      } catch (error) {
        console.error("Error while fetching bookmarks:", error);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [address, bookmarkIds]); // Modified: Removed hasFetched to ensure updates on bookmarkIds change

  // Modified: Handle remove bookmark with optimistic UI update
  const handleRemoveBookmark = async (postId: string) => {
    if (!address) {
      alert("Please connect your wallet to remove bookmarks.");
      return;
    }

    // Optimistically update local state
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== postId));
    console.log("Optimistic Bookmark Removal", { postId });

    try {
      await removeBookmark(postId, address);
      console.log("Bookmark Removed Successfully", { postId });
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      // Revert optimistic update on failure
      alert("Failed to remove bookmark. Please try again.");
      // Optionally refetch bookmarks to restore state
      const updatedIds = await getBookmarks(address);
      const bookmarkPost: Article[] = await Promise.all(
        updatedIds.map(async (id: string) => {
          try {
            const post = await getPostById(id);
            if (!post) return null;
            const authorTag =
              post.tags.find((t: any) => t.name === "author")?.value ||
              "Anonymous";
            const profile = await getProfile(authorTag);
            return {
              id: post.id,
              content: post.content,
              author: authorTag.slice(0, 6) + "..." + authorTag.slice(-4),
              createdAt: post.timestamp,
              likes: 0,
              comments: 0,
              readTime: `${Math.ceil(post.content.split(" ").length / 200)} min read`,
              username: profile?.username || authorTag,
            };
          } catch (error) {
            console.error(`Failed to fetch post ${id}:`, error);
            return null;
          }
        })
      );
      setBookmarks(bookmarkPost.filter((post): post is Article => post !== null));
    }
  };

  // New: Render wallet connection prompt if no address
  if (!address) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen flex flex-col items-center justify-center text-white font-oswald">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 font-display">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 mb-6 font-display-inter max-w-md">
              Please connect your wallet to view your bookmarked articles.
            </p>
            <Button
              onClick={() => navigate("/")} // Redirect to home for wallet connection
              className="bg-main hover:bg-main/90 text-black font-semibold px-6 py-3 rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105"
            >
              Go to Home
            </Button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="text-white font-oswald flex flex-col items-center mb-20">
        <header className="w-full mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-main/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-main/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-xl bg-main">
              {profileUsername
                ? profileUsername.slice(0, 2).toUpperCase()
                : "BM"}{" "}
              {/* Modified: Use dynamic username */}
            </div>
            <h1 className="text-4xl mt-3 md:text-5xl font-bold font-display">
              @{profileUsername || "Bookmarks"}{" "}
              {/* Modified: Use dynamic username */}
            </h1>
            <p className="text-gray-400 text-lg mt-5 font-display-inter mb-6">
              You have {bookmarks.length} Articles Bookmarked
            </p>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-700/30 border border-gray-600/50">
              <FileText className="w-4 h-4 text-main" />
              <span className="text-sm font-medium font-display-inter text-gray-300">
                All your content stored permanently on Irys
              </span>
            </div>
          </div>
        </header>
        {loading ? (
          <div className="mt-30 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent mb-4"></div>
              <p className="text-gray-400 font-display-inter">
                Loading Bookmarks...
              </p>
            </div>
          </div>
        ) : !bookmarks || bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 font-display">
              No Bookmarks yet
            </h3>
            <p className="text-gray-400 mb-6 font-display-inter">
              This user hasn't bookmark any articles yet
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-main hover:bg-main/90 text-black font-semibold px-6 py-3 rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105"
            >
              Explore Articles to bookmark
            </Button>
          </div>
        ) : (
          <div className="max-w-5xl w-full flex flex-col gap-10 ">
            {bookmarks.map((article) => (
              <article
                key={article.id}
                className="w-full bg-gradient-to-br from-gray-800/90 to-gray-800/70 rounded-xl overflow-hidden transition-all duration-300 border border-gray-700/50 hover:border-main/30 hover:shadow-lg hover:shadow-main/10 group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => navigate(`/profile/@${article.username}`)}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg"
                        style={{ backgroundColor: "rgb(81, 255, 214)" }}
                      >
                        {article.username?.slice(0, 2).toUpperCase() ||
                          article.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold font-display-inter text-white">
                          {article.username
                            ? `@${article.username}`
                            : article.author}
                        </p>
                        <p className="text-gray-400 text-sm font-display-inter">
                          {new Date(article.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-main/10 text-main border border-main/20">
                        Blog
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-main hover:text-main/80 hover:bg-main/10 p-2 transition-colors"
                        onClick={() => handleRemoveBookmark(article.id)}
                      >
                        <Bookmark className="w-4 h-4 fill-main" />{" "}
                        {/* Kept: Filled to indicate bookmarked */}
                      </Button>
                    </div>
                  </div>

                  <div
                    className="markdown-content mb-5 text-gray-300 prose prose-invert max-w-none ql-editor"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(article.content.slice(0, 500)),
                    }}
                  />

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-6 text-gray-400 font-display-inter">
                      <div className="flex items-center gap-2 hover:text-main transition-colors cursor-pointer">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{article.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-main transition-colors cursor-pointer">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{article.comments}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{article.readTime}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-main hover:text-main/80 hover:bg-main/10 p-0 h-auto font-medium cursor-pointer font-display-inter group-hover:translate-x-1 transition-transform"
                      onClick={() => navigate(`/post/${article.id}`)}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default BookMarks;
