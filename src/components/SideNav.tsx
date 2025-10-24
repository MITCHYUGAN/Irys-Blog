"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  X,
  Bookmark,
  Heart,
  MessageCircle,
  User,
  Loader2,
  RotateCw,
  // Pointer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getIrysUploader, getProfile } from "@/lib/irys";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "./ui/textarea";
import { ethers, type AddressLike } from "ethers";

interface SideNavProps {
  onToggle?: (isOpen: boolean) => void;
  onProfileCreated?: () => void;
}

const SideNav = ({ onToggle, onProfileCreated }: SideNavProps) => {
  const { address } = useAccount();
  const [navToggle, setNavToggle] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const { disconnect } = useDisconnect();
  const [uploadBalance, setUploadBalance] = useState("Not found");
  const [walletBalance, setWalletBalance] = useState("Not Found");
  const [walletName, setWalletName] = useState("Not found");
  const [amountToFund, setAmountToFUnd] = useState("0.001");
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (address) {
      const profile = await getProfile(address);
      setUsername(profile?.username || null);
      setBio(profile?.bio || null);
    }
  };

  const fetchUploadBalance = async () => {
    const irys = await getIrysUploader();

    setLoading(true)
    try {
      console.log("Getting upload balance...");
      const balanceAtomic = await irys.getBalance();
      const balance = irys.utils.fromAtomic(balanceAtomic).toString();
      console.log("Balance", balance);
      setUploadBalance(balance);
    } catch (error) {
      console.log("Error getting Upload Balance", error);
    } finally {
      setLoading(false)
    }
  };

  const fetchWalletInfo = async () => {
    console.log("Fetching wallet Balance...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Fetch balance
      const walletBalance = await provider.getBalance(address as AddressLike);
      const walletBalanceEth = ethers.formatEther(walletBalance);

      // Fetch name
      const walletName = (await provider.getNetwork()).name;

      setWalletBalance(walletBalanceEth);
      setWalletName(walletName);

      return walletBalanceEth;
    } catch (error) {
      console.log("Error while fetching Wallet balance", error);
    }
  };

  const fundAccount = async (amount) => {
    console.log("Funding...", amount);

    if (!amount || amount <= 0) {
      alert("Pls enter a valid amount");
      return;
    }

    try {
      // Compare wallet balance with amount to fund
      const walletBalance = await fetchWalletInfo();

      if (walletBalance < amount) {
        alert("Not enough balance");
        return;
      }

      try {
        const irys = await getIrysUploader();

        setLoading(true);
        console.log("funding...");
        const fundTx = await irys.fund(irys.utils.toAtomic(amount));
        console.log(
          `Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${
            irys.token
          }`
        );
        alert("Funded Successful");
        // setLoading(false);
        setAmountToFUnd("");
      } catch (error) {
        console.log("Error while funding", error);

        if (error.message.includes("user rejected action")) {
          alert("User Rejected transaction");
        }
      }

      console.log("result", walletBalance);
    } catch (error) {
      console.log("Error when funding...", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUploadBalance();
    fetchWalletInfo();
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
          More
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

                      {/* Button to show network */}
                      <button
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
                      </button>
                    </>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>

          {/* Fund wallet */}
          <div className="flex flex-col gap-5 w-full justify-between text-white">
            <h1 className="">
              Upload balance:{" "}
              <span className="text-[10px] text-[#51ffd6] italic">
                {uploadBalance}
              </span>
            </h1>

            <div className="flex justify-between items-center">
              <Button disabled={loading} onClick={fetchUploadBalance} variant="default">
                Refresh
                <RotateCw
                  className="cursor-pointer w-[15px]"
                />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Fund</Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-0  text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Fund your Account
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Fund your upload account with custom testnet tokens
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5  py-2">
                    <div className="space-y-5  py-2">
                      <div className="flex flex-col text-white">
                        <h1>
                          Current balance:{" "}
                          <span className="text-[10px] text-[#51ffd6] italic">
                            {walletBalance}
                          </span>
                        </h1>
                        <h1>Current Network: {walletName}</h1>
                      </div>
                      <label className="block text-sm font-medium mb-1">
                        Amount
                      </label>
                      <Input
                        value={amountToFund}
                        onChange={(e) => setAmountToFUnd(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="0.0001"
                      />
                      {/* {usernameError && (
              <p className="text-red-400 text-sm mt-1">{usernameError}</p>
            )} */}
                    </div>
                    <div className="flex justify-between gap-3">
                      <Button
                        onClick={() => fundAccount(amountToFund)}
                        disabled={loading}
                        className="bg-main text-black cursor-pointer hover:bg-main/90"
                      >
                        {loading ? (
                          <>
                            Funding
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          </>
                        ) : (
                          "Fund"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button variant="outline">Fund</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-white text-3xl">
                      Fund Your Account
                    </DialogTitle>
                    <DialogDescription className="text-white">
                      Fund your upload account with custom testnet tokens
                    </DialogDescription>
                  </DialogHeader>

                  Show network button
                  <Dialog>
                    <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openChainModal,
                      mounted,
                    }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;
                      return (
                        <div className="w-full flex flex-col items-center gap-6">
                          {connected && (
                            <>
                              <button
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
                              </button>
                            </>
                          )}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                  </Dialog>

                  <div className="grid gap-4">
                    <div className="flex flex-col text-white">
                      <h1>
                        Current balance:{" "}
                        <span className="text-[10px] text-[#51ffd6] italic">
                          0.000000004
                        </span>
                      </h1>
                      <h1>Current Network: Ethereum</h1>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="amout" className="text-white">
                        Amount
                      </Label>
                      <Input
                        id="amount"
                        name="Amount"
                        defaultValue="0.0001"
                        className="text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog> */}
          </div>

          {/* Other profile actions */}
          <div className="flex flex-col gap-3 mt-5 w-full">
            {/* Update: Use username for profile link */}
            <Link to={`/profile/@${username}`}>
              {/* <Link to={`/profile/@${username || address}`}> */}
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-gray-800 hover:text-main transition-colors py-6 text-base font-display-inter"
              >
                <User className="w-5 h-5 mr-3" />
                View Complete Profile
              </Button>
            </Link>
            {/* <Link to={"/me/bookmarks"}> */}
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800 hover:text-main transition-colors py-6 text-base font-display-inter"
            >
              <Bookmark className="w-5 h-5 mr-3" />
              Bookmarks <span className="text-[10px]">(Coming soon...)</span>
            </Button>
            {/* </Link> */}
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
          <Button variant={"secondary"} onClick={() => disconnect()}>
            Disconnect Profile
          </Button>
        </div>

        {/* {fundModal && (
        <Dialog>
          
        </Dialog>
      )} */}
      </div>
    </div>
  );
};

export default SideNav;
