import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <div className="w-full bg-background top-0 fixed border-b-0.5 border-b-neutral-600 text-white grid place-items-center">
      <header className="flex w-[90%] items-center justify-between px-6 py-4">
        <Link to={"/"}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-main rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-semibold">IrysBlog</span>
          </div>
        </Link>
        <div className="relative flex-1 max-w-md mx-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link to={"/write"}>
            <Button
              variant="ghost"
              className="text-white cursor-pointer hover:bg-gray-800"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Write
            </Button>
          </Link>
          {/* <Button className="bg-main cursor-pointer text-black font-medium">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button> */}
          <ConnectButton />
        </div>
      </header>
    </div>
  );
}
