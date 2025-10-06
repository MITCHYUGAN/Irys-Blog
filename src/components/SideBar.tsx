import type React from "react"
import { Code, Link, Brain, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  isActive?: boolean
}

interface Tag {
  id: string
  name: string
  count?: number
}

const categories: Category[] = [
  {
    id: "development",
    name: "Development",
    icon: <Code className="w-4 h-4" />,
  },
  {
    id: "blockchain",
    name: "Blockchain",
    icon: <Link className="w-4 h-4" />,
  },
  {
    id: "ai-ml",
    name: "AI & ML",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    id: "business",
    name: "Business",
    icon: <TrendingUp className="w-4 h-4" />,
  },
]

const trendingTags: Tag[] = [
  { id: "irys", name: "#irys" },
  { id: "web3", name: "#web3" },
  { id: "datachain", name: "#datachain" },
  { id: "react", name: "#react" },
  { id: "tutorial", name: "#tutorial" },
]

export function Sidebar() {
  return (
    <aside className="w-full md:w-90 md:p-6 space-y-6 font-oswald">
      {/* Categories Section */}
      <div className="bg-gray-800/50 rounded-lg p-5">
        <h3 className="text-1xl md:text-xl font-bold text-white mb-3">Categories</h3>
        <div className="flex flex-wrap md:flex-col items-center md:items-start gap-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={` justify-start gap-1 h-auto px-2 py-1 md:py-3 md:px-3 text-left font-medium ${
                category.isActive
                  ? "text-white bg-transparent hover:bg-transparent"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              {category.icon && <span className="text-gray-400">{category.icon}</span>}
              <span
                className={category.isActive ? "font-medium" : ""}
                style={category.isActive ? { color: "rgb(81, 255, 214)" } : {}}
              >
                {category.name}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Trending Tags Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-1xl md:text-xl font-bold text-white mb-3">Trending Tags</h3>
        <div className="flex flex-wrap gap-3">
          {trendingTags.map((tag) => (
            <Button
              key={tag.id}
              variant="ghost"
              size="sm"
              className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-full px-3 py-1 md:px-4 md:py-2 h-auto font-medium"
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}
