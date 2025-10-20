// src/pages/Profile.tsx (new file)
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  FileText,
  Heart,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getProfileByUsername, getUserPost } from "@/lib/userarticlegraphql";
import { useAccount } from "wagmi";
import { getProfile } from "@/lib/irys";

interface Article {
  id: string;
  content: string;
  author: string;
  createdAt: number;
  likes: number;
  comments: number;
  readTime: string;
}

interface ProfileData {
  username: string;
  bio: string;
  author: string;
}

export function Profile() {
  const { address } = useAccount();
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<Article[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const cleanedUsername = username?.replace(/^@/, "") || "";

        let isOwnProfile = false;
        if (address) {
          const currentProfile = await getProfile(address);
          
          if (currentProfile && currentProfile.username !== cleanedUsername) {
            isOwnProfile = true;
            // navigate(`/profile/@${currentProfile.username}`);
            // return;
          }
          
          // if (!currentProfile && cleanedUsername) {
          //   navigate("/");
          //   return;
          // }
        }

        const profileData = await getProfileByUsername(cleanedUsername);
        if (!profileData) {
          setLoading(false);
          return;
        }
        setProfile(profileData);

        // Fetch posts by author (wallet address from profile)
        const fetchedPosts = await getUserPost(profileData.author);
        const formattedPosts: Article[] = fetchedPosts.map((post: any) => {
          const plainText = post.content;
          return {
            id: post.id,
            content: post.content,
            author:
              post.tags.find((t: any) => t.name === "author")?.value ||
              "Anonymous",
            createdAt: post.timestamp,
            likes: 0,
            comments: 0,
            readTime: `${Math.ceil(
              plainText.split(" ").length / 200
            )} min read`,
          };
        });
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching profile/posts:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("username", username);

    if (username) fetchProfileAndPosts();
  }, [username, address, navigate]);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent mb-4"></div>
            <p className="text-gray-400 font-display-inter">
              Loading Profile...
            </p>
          </div>
        </div>
      ) : !profile ? (
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-display">
              Profile not found
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
        <section className="flex flex-col items-center text-white font-oswald">
          <header className="w-full mt-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-main/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-main/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-xl bg-main">
                {profile.username.slice(0, 2).toUpperCase()}
              </div>
              <h1 className="text-4xl mt-3 md:text-5xl font-bold font-display">
                @{profile.username}
              </h1>
              <p className="text-gray-400 mt-10 text-base font-display-inter mb-6 max-w-md">
                {profile.bio}
              </p>
              <p className="text-gray-400 text-lg mt-5 font-display-inter mb-6">
                {posts.length} {posts.length === 1 ? "article" : "articles"}{" "}
                published
              </p>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-700/30 border border-gray-600/50">
                <FileText className="w-4 h-4 text-main" />
                <span className="text-sm font-medium font-display-inter text-gray-300">
                  All your content stored permanently on Irys
                </span>
              </div>
            </div>
          </header>

          <div className="w-full max-w-5xl px-6 py-12">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 font-display">
                  No articles yet
                </h3>
                <p className="text-gray-400 mb-6 font-display-inter">
                  This user hasn't written any articles yet
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-main hover:bg-main/90 text-black font-semibold px-6 py-3 rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105"
                >
                  Explore Articles
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((article) => (
                  <article
                    key={article.id}
                    className="bg-gradient-to-br from-gray-800/90 to-gray-800/70 rounded-xl overflow-hidden transition-all duration-300 border border-gray-700/50 hover:border-main/30 hover:shadow-lg hover:shadow-main/10 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg bg-main">
                            {profile.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold font-display-inter text-white">
                              @{profile.username}
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
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-main/10 text-main border border-main/20 font-display-inter">
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
                          __html: DOMPurify.sanitize(
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
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
