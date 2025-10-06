import Navbar from "@/components/Navbar"
import { Rocket, Sparkles, FileText } from "lucide-react"

const Write = () => {
  return (
    <>
      <Navbar />
      <section className="w-full text-white mt-16 flex flex-col items-center relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-main/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-main/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-main/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6 py-16 px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-main/10 border border-main/20 text-main text-sm font-medium font-display-inter">
            <Sparkles className="w-4 h-4" />
            <span>Write & Publish Forever</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold font-display leading-tight">
            Create a{" "}
            <span className="text-main bg-gradient-to-r from-main to-emerald-400 bg-clip-text">
              New Post
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-display-inter leading-relaxed">
            Share your thoughts, ideas, and stories with the world. Your content will be permanently stored on the Irys
            datachain with cryptographic proof of authorship.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm text-gray-400 font-display-inter">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-main" />
              <span>Markdown Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-main" />
              <span>Instant Publishing</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Write
