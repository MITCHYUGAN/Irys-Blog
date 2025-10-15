"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  MessageCircle,
  Clock,
  ArrowRight,
  Bookmark,
} from "lucide-react";
import { Sidebar } from "./SideBar";
import { getPost } from "@/lib/graphql";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { getAllPosts } from "@/lib/allarticlesgraphql";

// Function to truncate HTML safely
const truncateHtml = (html: string, maxLength: number): string => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  let textLength = 0;
  let truncatedHtml = "";

  const traverseNodes = (node: Node) => {
    if (textLength >= maxLength) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (textLength + text.length <= maxLength) {
        truncatedHtml += text;
        textLength += text.length;
      } else {
        truncatedHtml += text.slice(0, maxLength - textLength) + "...";
        textLength = maxLength;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (element.tagName.toLowerCase() === "img") {
        truncatedHtml += element.outerHTML;
        textLength += element.textContent?.length || 0; // Approximate length
        if (textLength >= maxLength) return;
      }
      Array.from(element.childNodes).forEach(traverseNodes);
    }
  };

  traverseNodes(tempDiv);
  return truncatedHtml || html.slice(0, maxLength) + "...";
};

interface Article {
  id: string;
  content: string;
  author: string;
  createdAt: number;
  likes: number;
  comments: number;
  readTime: string;
}

export function ArticlesSection() {
  const [posts, setPosts] = useState<Article[]>([]);
  const [allPosts, setAllPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const allFetchedPosts = await getAllPosts();
        setAllPosts(allFetchedPosts);
      } catch (error) {
        console.log("Error fetching All posts", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPost();
        const formattedPosts: Article[] = fetchedPosts.map((post: any) => {
          const author =
            post.tags.find((t: any) => t.name === "author")?.value.slice(0, 6) +
              "..." +
              post.tags
                .find((t: any) => t.name === "author")
                ?.value.slice(-4) || "Anonymous";
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = post.content;
          const plainText = tempDiv.textContent || post.content;
          const previewHtml = truncateHtml(post.content, 500);
          return {
            id: post.id,
            content: post.content,
            author,
            createdAt: post.timestamp,
            likes: 0,
            comments: 0,
            readTime: `${Math.ceil(
              plainText.split(" ").length / 200
            )} min read`,
            previewHtml,
          };
        });
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-white">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent mb-4"></div>
        <p className="text-gray-400 font-display-inter">Loading articles...</p>
      </div>
    );
  }

  return (
    <section className="px-6 flex flex-col items-center py-12 text-white font-oswald">
      <div className="w-[90%] flex md:flex-row flex-col gap-8">
        <Sidebar />
        <div className="md:max-w-5xl w-full mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4 items-center">
              <h2 className="md:text-4xl text-3xl font-bold font-display">
                Latest Articles
              </h2>
              <p className="text-gray-400 mt-1 hidden md:block font-display-inter text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                {posts.length} articles
              </p>
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="md:w-44 w-36 bg-gray-800/50 border-gray-700 hover:border-main/50 text-white transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                {/* <SelectItem value="trending">Trending</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6 w-full flex flex-col items-center ">
            {posts.map((article) => (
              <article
                key={article.id}
                className="w-full bg-gradient-to-br from-gray-800/90 to-gray-800/70 rounded-xl overflow-hidden transition-all duration-300 border border-gray-700/50 hover:border-main/30 hover:shadow-lg hover:shadow-main/10 group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg"
                        style={{ backgroundColor: "rgb(81, 255, 214)" }}
                      >
                        {article.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold font-display-inter text-white">
                          {article.author}
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
                    className="markdown-content mb-5 text-gray-300 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        article.content.slice(0, 3000)
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

            {allPosts.length > 9 && (
              <Button
                className="bg-main hover:bg-main/90 btn-store_on_irys text-black font-semibold px-12 py-7 text-xl rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-display-inter"
                onClick={() => navigate("/all/articles")}
              >
                View All {allPosts.length}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
