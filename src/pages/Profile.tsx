// src/pages/Profile.tsx (new file)
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { getProfile } from "@/lib/irys"; // Updated import
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getProfileByUsername, getUserPost } from "@/lib/userarticlegraphql";

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
  name: string;
  username: string;
  bio: string;
  author: string;
}

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<Article[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const profileData = await getProfileByUsername(username || "");
        if (!profileData) {
          setLoading(false);
          return;
        }
        setProfile(profileData);

        // Fetch posts by author (wallet address from profile)
        const fetchedPosts = await getUserPost(profileData.author);
        const formattedPosts: Article[] = fetchedPosts.map((post: any) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = post.content;
          const plainText = tempDiv.textContent || post.content;
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
  }, [username]);

  //   if (loading) {
  //     return <div>Loading profile...</div>;
  //   }

  //   if (!profile) {
  //     return <div>Profile not found</div>;
  //   }

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent mb-4"></div>
            <p className="text-gray-400 font-display-inter">Loading Profile...</p>
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
        <section className="px-6 py-12 mt-20 text-white font-oswald">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6 text-teal-400 hover:text-teal-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="bg-gray-800/90 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-400 text-black font-bold flex items-center justify-center">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-gray-400">@{profile.username}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{profile.bio}</p>
              <p className="text-gray-500 text-sm">
                {profile.author.slice(0, 6)}...{profile.author.slice(-4)}
              </p>
            </div>
            <h3 className="text-2xl font-bold mb-6">Posts</h3>
            <div className="space-y-6">
              {posts.map((article) => (
                <article
                  key={article.id}
                  className="bg-gray-800 rounded-lg p-4"
                >
                  <div
                    className="text-gray-300 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        article.content.slice(0, 3000) + "..."
                      ),
                    }}
                  />
                  <Button onClick={() => navigate(`/post/${article.id}`)}>
                    Read More
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
