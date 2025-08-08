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

interface Article {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    initials: string;
    avatar?: string;
  };
  date: string;
  category: string;
  categoryColor: string;
  likes: number;
  comments: number;
  readTime: string;
  image?: string;
}

const articles: Article[] = [
  {
    id: "1",
    title: "Getting Started with Irys: The Future of Programmable Data Storage",
    description:
      "Discover how Irys is revolutionizing blockchain data storage with programmable, permanent, and cost-effective solutions for the decentralized web.",
    author: {
      name: "Irys Team",
      initials: "IT",
    },
    date: "06/08/2025",
    category: "Blockchain",
    categoryColor: "bg-teal-500/20 text-teal-400",
    likes: 42,
    comments: 8,
    readTime: "5 min read",
    image: "https://media.istockphoto.com/id/1832968382/photo/close-up-of-man-hand-using-writing-pen-memo-on-notebook-paper-or-letter-diary-on-table-desk.jpg?s=612x612&w=0&k=20&c=AQ5y_7-Ss2Xo8t-ryDnKYwf1CwoYIl0d7cTTqacGoAM=",
  },
  {
    id: "2",
    title: "Building Decentralized Social Media with React and Irys",
    description:
      "Learn how to build a censorship-resistant social media platform using React, Irys datachain, and Ethereum for true user data ownership.",
    author: {
      name: "Alice Dev",
      initials: "AD",
    },
    date: "06/08/2025",
    category: "Development",
    categoryColor: "bg-blue-500/20 text-blue-400",
    likes: 127,
    comments: 23,
    readTime: "8 min read",
  },
  {
    id: "3",
    title: "AI Agents and Programmable Data: A Perfect Match",
    description:
      "Explore how AI agents can leverage programmable data on Irys to create autonomous, self-owning systems that operate independently in the digital economy.",
    author: {
      name: "Dr. Sarah Chen",
      initials: "DS",
    },
    date: "06/08/2025",
    category: "AI & ML",
    categoryColor: "bg-green-500/20 text-green-400",
    likes: 89,
    comments: 15,
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "The Economics of Permanent Data Storage",
    description:
      "An in-depth analysis of the economic models behind permanent data storage solutions and their impact on the future of digital preservation.",
    author: {
      name: "Marcus Thompson",
      initials: "MT",
    },
    date: "06/08/2025",
    category: "Business",
    categoryColor: "bg-purple-500/20 text-purple-400",
    likes: 156,
    comments: 31,
    readTime: "12 min read",
  },
];

export function ArticlesSection() {
  return (
    <section className="px-6 flex flex-col items-center py-12 text-white font-oswald">
      <div className="w-[90%] flex">
        <Sidebar />
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mt-12 mb-6">
            <div className="flex gap-3.5 items-center">
              <h2 className="text-3xl font-bold">Latest Articles</h2>
              <p className="text-gray-400 mt-1">
                {articles.length} articles found
              </p>
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Articles Grid */}
          <div className="space-y-6">
            {articles.map((article, index) => (
              <article
                key={article.id}
                className="bg-gray-800/90 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-colors"
              >
                {/* Featured Image - Only for first article */}
                {index === 0 && article.image && (
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Author Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm"
                        style={{ backgroundColor: "rgb(81, 255, 214)" }}
                      >
                        {article.author.initials}
                      </div>
                      <div>
                        <p className="font-semibold">{article.author.name}</p>
                        <p className="text-gray-400 text-sm">{article.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${article.categoryColor}`}
                      >
                        {article.category}
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

                  {/* Article Content */}
                  <h3 className="text-xl font-bold mb-3 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {article.description}
                  </p>

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
                      className="text-teal-400 hover:text-teal-300 p-0 h-auto font-medium"
                      style={{ color: "rgb(81, 255, 214)" }}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
