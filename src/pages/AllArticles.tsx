import Navbar from "@/components/Navbar";
import { getAllPosts } from "@/lib/allarticlesgraphql";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Clock,
  ArrowRight,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "@/lib/irys";

interface Article {
  id: string;
  content: string;
  author: string;
  createdAt: number;
  likes: number;
  comments: number;
  readTime: string;
  username: string;
}

const AllArticles = () => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
          try {
            const fetchedPosts = await getAllPosts();
            const formattedPosts: Article[] = await Promise.all(
              fetchedPosts.map(async (post: any) => {
                const author =
                  post.tags.find((t: any) => t.name === "author")?.value ||
                  "Anonymous";
                const profile = await getProfile(author);
                const plainText = post.content;
                return {
                  id: post.id,
                  content: post.content,
                  author: author.slice(0, 6) + "..." + author.slice(-4),
                  createdAt: post.timestamp,
                  likes: 0,
                  comments: 0,
                  readTime: `${Math.ceil(
                    plainText.split(" ").length / 200
                  )} min read`,
                  username: profile?.username,
                };
              })
            );
            setPosts(formattedPosts);
          } catch (error) {
            console.error("Error fetching posts:", error);
          } finally {
            setLoading(false);
          }
        };

    fetchPosts();
  }, []);
  return (
    <section className="mt-25 flex flex-col items-center">
      <Navbar />

      {loading ? (
        <div className="text-center py-20 text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent mb-4"></div>
          <p className="text-gray-400 font-display-inter">
            Loading articles...
          </p>
        </div>
      ) : (
        <div className="max-w-5xl w-full space-y-6 text-amber-50">
          <Button
            variant="ghost"
            className="self-start mb-8 text-main hover:text-main/80 hover:bg-main/10 transition-all font-display-inter"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          {posts.map((article) => (
            <article
              key={article.id}
              className="w-full bg-gradient-to-br from-gray-800/90 to-gray-800/70 rounded-xl overflow-hidden transition-all duration-300 border border-gray-700/50 hover:border-main/30 hover:shadow-lg hover:shadow-main/10 group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => {
                          console.log("Username1", article.username);
                          navigate(
                            `/profile/@${article.username}`
                          );
                          console.log("Username", article.username);
                        }}
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
                      className="text-gray-400 hover:text-main hover:bg-main/10 p-2 transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
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
  );
};

export default AllArticles;
