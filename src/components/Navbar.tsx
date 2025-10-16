"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PenTool } from "lucide-react"
import { Link } from "react-router-dom"
import SideNav from "./SideNav"
import { useState } from "react"


interface NavbarProps {
  onProfileCreated?: () => void;
}

export default function Navbar({ onProfileCreated }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  console.log("isSidebarOpen", isSidebarOpen)

  return (
    <div
      className={`w-full bg-background/95 backdrop-blur-md top-0 fixed border-b border-gray-800/50 text-white grid place-items-center shadow-lg shadow-black/10 ${isSidebarOpen ? "z-50" : "z-10"}`}
    >
      <header className="flex w-full md:w-[90%] items-center justify-between px-6 py-4">
        <Link to={"/"}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-main rounded-lg flex items-center justify-center shadow-lg shadow-main/20 group-hover:shadow-xl group-hover:shadow-main/30 transition-all duration-300">
              <span className="text-black font-bold text-xl">I</span>
            </div>
            <span className="md:text-xl font-semibold font-display-inter group-hover:text-main transition-colors">
              IrysBlogerr
            </span>
          </div>
        </Link>

        <div className="relative flex-1 max-w-md mx-3 lg:flex hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 bg-gray-800/50 border-gray-700 hover:border-main/50 focus:border-main text-white placeholder-gray-400 rounded-lg transition-colors font-display-inter"
          />
        </div>

        <div className="md:flex items-center gap-3">
          <Link to={"/write"}>
            <Button
              variant="ghost"
              className="text-white cursor-pointer hover:bg-gray-800/50 hover:text-main transition-all font-display-inter"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Write
            </Button>
          </Link>
          <SideNav onToggle={setIsSidebarOpen} onProfileCreated={onProfileCreated} />
        </div>
      </header>
    </div>
  )
}
