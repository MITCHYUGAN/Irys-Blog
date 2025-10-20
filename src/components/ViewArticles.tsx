import getArticles from "@/lib/queryallarticles";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Bookmark,
  Clock,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "@/lib/irys";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Sidebar } from "./SideBar";

interface Articles {
  content: string;
  id: string;
  username: string | undefined;
  createdAt: number;
  author: string; // Remove soon
  likes: number;
  comments: number;
  readTime: string;
}

const ViewArticles = () => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await getArticles();
        const formattedPosts: Articles[] = await Promise.all(
          fetchedPosts.map(async (post: any) => {
            const author =
              post.tags.find((t: any) => t.name === "author")?.value ||
              "Anonymous";
            const profile = await getProfile(author);
            const plainText = post.content;
            return {
              id: post.id,
              content: post.content,
              author,
              username: profile?.username,
              likes: 0,
              comments: 0,
              readTime: `${Math.ceil(
                plainText.split(" ").length / 200
              )} min read`,
              createdAt: post.timestamp
            };
          })
        );

        setArticles(formattedPosts);
      } catch (error) {
        console.log("error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
    // const interval = setInterval(fetchArticles, 30000); // Poll every 30 seconds

    // return () => clearInterval(interval);

    console.log("Articles", articles);
  }, []);

    return (
      <section className="px-6 flex flex-col items-center py-12 text-white font-oswald">
        <div className="w-[90%] flex md:flex-row flex-col gap-8">
          <Sidebar />
          {loading ? (
            <div className="text-center py-20 text-white w-[inherit] self-center justify-self-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent mb-4"></div>
              <p className="text-gray-400 font-display-inter">
                Loading articles...
              </p>
            </div>
          ) : (
            <div className="md:max-w-5xl w-full mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-4 items-center">
                  <h2 className="md:text-4xl text-3xl font-bold font-display">
                    Latest Articles
                  </h2>
                  <p className="text-gray-400 mt-1 hidden md:block font-display-inter text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                    {articles.length} articles
                  </p>
                </div>
                <Select defaultValue="recent">
                  <SelectTrigger className="md:w-44 w-36 bg-gray-800/50 border-gray-700 hover:border-main/50 text-white transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-6 w-full flex flex-col items-center">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="w-full ql-editor bg-gradient-to-br from-gray-800/90 to-gray-800/70 rounded-xl overflow-hidden transition-all duration-300 border border-gray-700/50 hover:border-main/30 hover:shadow-lg hover:shadow-main/10 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => {
                            console.log("Username1", article.username);
                            navigate(`/profile/@${article.username}`);
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
                        className="w-full markdown-content mb-5 text-gray-300 max-w-none ql-editor"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            // article.content
                            article.content.slice(0, 500)
                          ),
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
                {/* {allPosts.length > 9 && (
                  <Button
                    className="bg-main hover:bg-main/90 btn-store_on_irys text-black font-semibold px-12 py-7 text-xl rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-display-inter"
                    onClick={() => navigate("/all/articles")}
                  >
                    View All {allPosts.length}
                  </Button>
                )} */}
              </div>
            </div>
          )}
        </div>
      </section>
    );

  
};

export default ViewArticles;
