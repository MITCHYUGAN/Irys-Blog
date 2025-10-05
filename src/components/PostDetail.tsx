import { useParams } from "react-router-dom";
import { getPost } from "@/lib/graphql";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from 'dompurify';

// interface Article {
//   id: string;
//   title: string;
//   body: string;
//   author: string;
//   createdAt: number;
//   likes: number;
//   comments: number;
//   readTime: string;
// }

interface Article {
  id: string;
  markdown: string;
  author: string;
  createdAt: number;
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
          const author = foundPost.tags.find((t: any) => t.name === 'author')?.value.slice(0, 6) + "..." + foundPost.tags.find((t: any) => t.name === 'author')?.value.slice(-4) || 'Anonymous';
          setPost({
            id: foundPost.id,
            markdown: foundPost.markdown,
            author,
            createdAt: foundPost.timestamp,
            readTime: `${Math.ceil(foundPost.markdown.split(' ').length / 200)} min read`,
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
          className="mb-6 text-teal-400 hover:text-teal-300 cursor-pointer"
          onClick={() => window.history.back()} // Go back to previous page
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
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
                <p className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              {post.readTime}
            </div>
          </div>

          {/* Full Markdown Render */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              components={{
                a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline" />,
                code: ({ ...props }) => <code {...props} className="bg-gray-700 px-2 py-1 rounded text-sm" />,
                pre: ({ ...props }) => <pre {...props} className="bg-gray-900 p-4 rounded overflow-x-auto" />,
                blockquote: ({ ...props }) => <blockquote {...props} className="border-l-4 border-teal-500 pl-4 italic text-gray-300 my-4" />,
              }}
            >
              {DOMPurify.sanitize(post.markdown)}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </section>
  );
}