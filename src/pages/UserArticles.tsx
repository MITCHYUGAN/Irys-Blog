import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getUserPost } from "@/lib/userarticlegraphql";
import {
  ArrowRight,
  Bookmark,
  Clock,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

interface Article {
  id: string;
  markdown: string;
  author: string;
  createdAt: number;
  likes: number;
  comments: number;
  readTime: string;
}

const UserArticles = () => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const fetchedPosts = await getUserPost();
        const formattedPosts: Article[] = fetchedPosts.map((post: any) => {
          const author =
            post.tags.find((t: any) => t.name === "author")?.value.slice(0, 6) +
              "..." +
              post.tags
                .find((t: any) => t.name === "author")
                ?.value.slice(-4) || "Anonymous";
          return {
            id: post.id,
            markdown: post.markdown,
            author,
            createdAt: post.timestamp,
            likes: 0,
            comments: 0,
            readTime: `${Math.ceil(
              post.markdown.split(" ").length / 200
            )} min read`,
          };
        });
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-white">
        Loading user articles...
      </div>
    );
  }

  return (
    <section className="mt-18 w-full text-white flex flex-col items-center">
      <Navbar />
      <header className="w-full h-[30vh] bg-gray-800/50 flex flex-col items-center justify-center">
        <h1>Your Articles (0xabFa...25C9)</h1>
      </header>

      {/* Article */}
      <div className="space-y-6 max-w-4xl mx-auto mt-10">
        {posts.map((article) => {
          return (
            <article
              key={article.id}
              className="bg-gray-800/90 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-colors"
            >
              <div className="p-6">
                {/* Author Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm"
                      style={{ backgroundColor: "rgb(81, 255, 214)" }}
                    >
                      {article.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{article.author}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium">
                      Blog
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="markdown-content mb-4">
                  <ReactMarkdown>
                    {article.markdown.slice(0, 300) + "..."}
                  </ReactMarkdown>
                </div>

                {/* Article Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{article.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
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
                    className="text-teal-400 hover:text-teal-300 p-0 h-auto font-medium cursor-pointer"
                    style={{ color: "rgb(81, 255, 214)" }}
                    onClick={() => navigate(`/post/${article.id}`)}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default UserArticles;
