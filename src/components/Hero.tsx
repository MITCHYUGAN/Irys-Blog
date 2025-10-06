import { Rocket, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <main className="flex mt-16 flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-main/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-main/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-main/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-main/10 border border-main/20 text-main text-sm font-medium">
          <Zap className="w-4 h-4" />
          <span>Powered by Irys Datachain</span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Publish on the{" "}
          <span className="text-main bg-gradient-to-r from-main to-emerald-400 bg-clip-text text-transparent">
            Datachain
          </span>
        </h1>

        <p className="font-display-inter text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Create, share, and own your content forever with cryptographic proof of authorship on Irys's programmable
          datachain.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-main" />
            <span>Permanent Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-main" />
            <span>Instant Publishing</span>
          </div>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-main" />
            <span>True Ownership</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link to={"/write"}>
            <Button className="bg-main hover:bg-main/90 text-black font-semibold px-8 py-6 text-lg rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105 cursor-pointer">
              <Rocket className="w-5 h-5 mr-2" />
              Start Writing
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Hero
