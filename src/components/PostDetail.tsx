import { useParams } from "react-router-dom";
import { getPost } from "@/lib/graphql";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: number;
  likes: number;
  comments: number;
  readTime: string;
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>(); // Get post ID from URL
  const [post, setPost] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPosts = await getPost();
        const foundPost = fetchedPosts.find((p: any) => p.id === id);
        if (foundPost) {
          const formattedPost: Article = {
            id: foundPost.id,
            title: foundPost.title,
            body: foundPost.body,
            author: foundPost.author.slice(0, 6) + "..." + foundPost.author.slice(-4),
            createdAt: foundPost.createdAt,
            likes: 0,
            comments: 0,
            readTime: `${Math.ceil(foundPost.body.split(" ").length / 200)} min read`,
          };
          setPost(formattedPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <section className="px-6 py-12 text-white font-oswald">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-teal-400 hover:text-teal-300"
          onClick={() => window.history.back()} // Go back to previous page
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <article className="bg-gray-800/90 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm"
                style={{ backgroundColor: "rgb(81, 255, 214)" }}
              >
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-300 mb-4 leading-relaxed">{post.body}</p>
          <div className="flex items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{post.readTime}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}