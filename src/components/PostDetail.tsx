"use client";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import Navbar from "./Navbar";
import { getProfile } from "@/lib/irys";
// import getArticles from "@/lib/queryallarticles";
import { getPostById } from "@/lib/queriesGraphQL/graphql";

// Define the raw post type returned by getArticles()
// interface RawPost {
//   id: string;
//   content: string;
//   tags: { name: string; value: string }[];
//   timestamp: number;
//   [key: string]: any; // Allow additional fields for flexibility
// }

interface Article {
  id: string;
  content: string;
  author: string;
  createdAt: number;
  likes: number;
  comments: number;
  readTime: string;
  username?: string;
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    // Modified: Retry mechanism for fetching post
  const fetchPostWithRetry = async (postId: string, retries = 3, delay = 2000): Promise<Article | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const foundPost = await getPostById(postId);
        if (!foundPost) {
          console.warn(`Attempt ${attempt}: No post found for postId: ${postId}`);
          if (attempt === retries) return null;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        const author =
          foundPost.tags.find((t: any) => t.name === "author")?.value || "Anonymous";
        const profile = await getProfile(author);
        return {
          id: foundPost.id,
          content: foundPost.content,
          author,
          createdAt: foundPost.timestamp,
          likes: 0,
          comments: 0,
          readTime: `${Math.ceil(foundPost.content.split(" ").length / 200)} min read`,
          username: profile?.username,
        };
      } catch (error) {
        console.error(`Attempt ${attempt}: Error fetching post ${postId}:`, error);
        if (attempt === retries) return null;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return null;
  };

    useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        console.warn("No post ID provided");
        setLoading(false);
        return;
      }

      try {
        const fetchedPost = await fetchPostWithRetry(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent mb-4"></div>
            <p className="text-gray-400 font-display-inter">Loading post...</p>
          </div>
        </div>
      ) : !post ? (
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-display">
              Post not found
            </h2>
            <Button
              variant="ghost"
              className="text-main hover:text-main/80 font-display-inter"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>
        </div>
      ) : (
        <section className="px-6 py-12 mt-20 text-white font-display-inter min-h-screen">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              className="mb-8 text-main hover:text-main/80 hover:bg-main/10 transition-all font-display-inter"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
            </Button>

            <article className="bg-gradient-to-br from-gray-800/90 to-gray-800/70 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl ql-editor">
              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700/50">
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() =>
                      navigate(`/profile/@${post.username || post.author}`)
                    }
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-lg bg-main">
                      {post.username?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-white">
                        {post.username}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 text-sm flex items-center gap-2 bg-gray-700/30 px-3 py-2 rounded-lg">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-main hover:bg-main/10 p-2 transition-colors"
                      title="Bookmark"
                    >
                      <Bookmark className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-main hover:bg-main/10 p-2 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div
                  className="markdown-content max-w-none ql-editor"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content),
                  }}
                />

                <div className="flex items-center gap-8 text-gray-400 mt-10 pt-6 border-t border-gray-700/50">
                  <button className="flex items-center gap-2 hover:text-main transition-colors group">
                    <Heart className="w-5 h-5 group-hover:fill-main group-hover:text-main transition-all" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-main transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}
    </>
  );
}
