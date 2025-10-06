"use client";

import { useParams } from "react-router-dom";
import { getPost } from "@/lib/graphql";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Clock, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";

interface Article {
  id: string;
  markdown: string;
  author: string;
  createdAt: number;
  likes: number;
  comments: number;
  readTime: string;
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPosts = await getPost();
        const foundPost = fetchedPosts.find((p: any) => p.id === id);
        if (foundPost) {
          const author =
            foundPost.tags
              .find((t: any) => t.name === "author")
              ?.value.slice(0, 6) +
              "..." +
              foundPost.tags
                .find((t: any) => t.name === "author")
                ?.value.slice(-4) || "Anonymous";
          setPost({
            id: foundPost.id,
            markdown: foundPost.markdown,
            author,
            createdAt: foundPost.timestamp,
            likes: 0,
            comments: 0,
            readTime: `${Math.ceil(
              foundPost.markdown.split(" ").length / 200
            )} min read`,
          });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-white text-center py-12">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-white text-center py-12">Post not found</div>;
  }

  return (
    <section className="px-6 py-12 text-white font-oswald min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-teal-400 hover:text-teal-300"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
        </Button>
        <article className="bg-gray-800/90 rounded-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm bg-teal-400">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-9">
              <div className="text-gray-400 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                {post.readTime}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1"
                title="Bookmark"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {DOMPurify.sanitize(post.markdown)}
            </ReactMarkdown>
          </div>
          <div className="flex items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comments}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
