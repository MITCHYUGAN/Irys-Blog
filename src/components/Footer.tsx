"use client"

import { useEffect } from "react"
import { Heart, Github, Twitter } from "lucide-react"

const Footer = () => {
  useEffect(() => {
    // Ensure footer stays at the bottom
    const setFooterPosition = () => {
      const footer = document.querySelector("footer")
      if (footer) {
        footer.style.position = "relative"
        // footer.style.position = window.innerHeight > document.body.offsetHeight ? "fixed" : "relative"
        footer.style.width = "100%"
        footer.style.bottom = "0"
      }
    }

    setFooterPosition()
    window.addEventListener("resize", setFooterPosition)
    return () => window.removeEventListener("resize", setFooterPosition)
  }, [])

  return (
    <footer className="bg-gray-900/50 backdrop-blur-md border-t border-gray-800/50 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright */}
          <div className="flex items-center gap-2 text-gray-400 font-display-inter">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-main fill-main" />
            <span>by Mitchyugan © {new Date().getFullYear()}</span>
          </div>

          {/* Center - Powered by */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 font-display-inter">Powered by</span>
            <span className="text-main font-semibold font-display-inter">Irys Datachain</span>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-main transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-main transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
