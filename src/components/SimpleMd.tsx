"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import SimpleMdeReact from "react-simplemde-editor"
import { useAccount } from "wagmi"
import "easymde/dist/easymde.min.css"
import { getIrysUploader } from "@/lib/irys"
import { useNavigate } from "react-router-dom"

const SimpleMd = () => {
  const [bodyInput, setBodyInput] = useState("# How to ...")
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

    try {
      const irys = await getIrysUploader()

      const dataToUpload = bodyInput

      const tags = [
        { name: "application-id", value: "test-blog2" },
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
    }
  }

  return (
    <section className="w-[80%] flex flex-col items-center">
      <form
        className="w-full flex flex-col items-center gap-20"
        onSubmit={(e) => {
          e.preventDefault()
          uploadDataToIrys()
        }}
      >
        <div className="editor-wrapper w-full">
          <SimpleMdeReact value={bodyInput} onChange={setBodyInput} />
        </div>
        <Button type="submit" className="bg-main btn-store_on_irys text-black font-medium px-10 py-8 text-2xl cursor-pointer">
          Store on Irys
        </Button>
      </form>
    </section>
  )
}

export default SimpleMd
