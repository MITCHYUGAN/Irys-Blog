"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { X, Bookmark, Heart, MessageCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getProfile } from "@/lib/irys";

interface SideNavProps {
  onToggle?: (isOpen: boolean) => void;
  onProfileCreated?: () => void;
}

const SideNav = ({ onToggle, onProfileCreated }: SideNavProps) => {
  const { address } = useAccount();
  const [navToggle, setNavToggle] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const {disconnect} = useDisconnect()

  const fetchProfile = async () => {
    if (address) {
      const profile = await getProfile(address);
      setUsername(profile?.username || null);
      setBio(profile?.bio || null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [address]);

  // Update: Handle profile creation to refresh username
  useEffect(() => {
    if (onProfileCreated) {
      fetchProfile(); // Re-fetch profile after creation
    }
  }, [onProfileCreated]);

  const navtoggle = () => {
    const newToggleState = !navToggle;
    setNavToggle(newToggleState);
    onToggle?.(newToggleState);
  };

  useEffect(() => {
    if (!address && navToggle) {
      setNavToggle(false);
      onToggle?.(false);
    }
  }, [address, navToggle, onToggle]);

  return (
    <div className="">
      {!address ? (
        <ConnectButton />
      ) : (
        <Button
          onClick={navtoggle}
          className="border border-gray-700 hover:bg-gray-800 bg-main btn-store_on_irys text-black font-medium px-6 py-4 text-1xl cursor-pointer"
        >
          Profile
        </Button>
      )}
      {navToggle && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={navtoggle}
        />
      )}
      <div
        className={`fixed right-0 top-0 h-screen w-80 bg-gray-900/95 backdrop-blur-md border-l border-gray-700 flex flex-col z-[70] transition-transform duration-300 ease-in-out ${
          navToggle ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute right-5 top-5 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          onClick={navtoggle}
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center justify-center flex-1 px-6 gap-8">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;
              return (
                <div className="w-full flex flex-col items-center gap-6">
                  {connected && (
                    <>
                      <div className="text-center flex flex-col items-center">
                        <div
                          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-black font-bold text-2xl"
                          style={{ backgroundColor: "rgb(81, 255, 214)" }}
                        >
                          {username?.slice(0, 2).toUpperCase() ||
                            account.address?.slice(0, 2).toUpperCase()}
                        </div>
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={openAccountModal}
                        >
                          <button className="text-white font-semibold text-lg font-display-inter hover:text-main transition-colors">
                            {username ? `@${username}` : account.displayName}
                          </button>
                          <svg
                            width="12"
                            height="7"
                            viewBox="0 0 12 7"
                            fill="none"
                            className="text-gray-400"
                          >
                            <path
                              d="M1 1L6 6L11 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-1xl mt-1">
                          {bio?.slice(0, 50) + "..."}
                        </p>
                      </div>

                      {/* <button
                        onClick={openChainModal}
                        className="w-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-main/50 rounded-lg px-4 py-3 flex items-center justify-between transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl || "/placeholder.svg"}
                              className="w-6 h-6"
                            />
                          )}
                          <span className="text-white font-medium font-display-inter">
                            {chain.name}
                          </span>
                        </div>
                        <svg
                          width="12"
                          height="7"
                          viewBox="0 0 12 7"
                          fill="none"
                          className="text-gray-400"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button> */}
                    </>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
          <div className="flex flex-col gap-3 w-full">
            {/* Update: Use username for profile link */}
            <Link to={`/profile/@${username}`}>
              {/* <Link to={`/profile/@${username || address}`}> */}
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-gray-800 hover:text-main transition-colors py-6 text-base font-display-inter"
              >
                <User className="w-5 h-5 mr-3" />
                View My Articles
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800 hover:text-main transition-colors py-6 text-base font-display-inter"
            >
              <Bookmark className="w-5 h-5 mr-3" />
              Bookmarks <span className="text-[10px]">(Coming soon...)</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800 hover:text-main transition-colors py-6 text-base font-display-inter"
            >
              <Heart className="w-5 h-5 mr-3" />
              Likes <span className="text-[10px]">(Coming soon...)</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800 hover:text-main transition-colors py-6 text-base font-display-inter"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Comments <span className="text-[10px]">(Coming soon...)</span>
            </Button>
          </div>
          <Button variant={"secondary"} onClick={() => disconnect()}>Disconnect Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
