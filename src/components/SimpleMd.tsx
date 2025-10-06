"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import SimpleMdeReact from "react-simplemde-editor"
import { useAccount } from "wagmi"
import "easymde/dist/easymde.min.css"
import { getIrysUploader } from "@/lib/irys"
import { useNavigate } from "react-router-dom"
import { Upload, Loader2 } from "lucide-react"

const SimpleMd = () => {
  const [bodyInput, setBodyInput] = useState("# How to ...")
  const [isUploading, setIsUploading] = useState(false)
  const { address } = useAccount()
  const navigate = useNavigate()

  const uploadDataToIrys = async () => {
    if (!address) {
      alert("Please connect your wallet first.")
      return
    }

    if (!bodyInput) {
      alert("Please enter content.")
      return
    }

    console.log("BodyInput", bodyInput)

    setIsUploading(true)

    try {
      const irys = await getIrysUploader()

      const dataToUpload = bodyInput

      const tags = [
        { name: "application-id", value: "test-blog3" },
        { name: "type", value: "post" },
        { name: "Content-Type", value: "text/markdown" },
        { name: "author", value: address },
      ]

      const receipt = await irys.upload(dataToUpload, { tags })
      console.log(`Markdown uploaded ==> https://gateway.irys.xyz/${receipt.id}`)
      alert(`Post uploaded! View at https://gateway.irys.xyz/${receipt.id}`)

      setBodyInput("")
      navigate("/")
    } catch (error) {
      console.error("Error uploading data ", error)
      alert("Error uploading post. Check console for details.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="w-full max-w-[85%] px-6 flex flex-col items-center pb-20">
      <form
        className="w-full flex flex-col items-center gap-8"
        onSubmit={(e) => {
          e.preventDefault()
          uploadDataToIrys()
        }}
      >
        <div className="editor-wrapper w-full bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 shadow-xl">
          <SimpleMdeReact value={bodyInput} onChange={setBodyInput} style={{zIndex: '1Z'}} />
        </div>

        <Button
          type="submit"
          disabled={isUploading}
          className="bg-main hover:bg-main/90 btn-store_on_irys text-black font-semibold px-12 py-7 text-xl rounded-lg shadow-lg shadow-main/20 hover:shadow-xl hover:shadow-main/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-display-inter"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Publish to Irys
            </>
          )}
        </Button>
      </form>
    </section>
  )
}

export default SimpleMd
