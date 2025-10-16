// src/components/ProfileModal.tsx (new file - popup for profile creation)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { checkUsername, uploadProfile } from "@/lib/irys";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useDisconnect } from "wagmi";

interface ProfileModalProps {
  author: string;
  onClose: () => void;
  onProfileCreated: () => void;
}

export function ProfileModal({
  author,
  onClose,
  onProfileCreated,
}: ProfileModalProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const { disconnect } = useDisconnect();

  const cleanUsername = (input: string) => {
    return input.replace(/^@+/, ""); // Remove any leading @ symbols
  };

  const handleUsernameChange = async (input: string) => {
    const cleaned = cleanUsername(input);
    setUsername(cleaned);
    if (cleaned) {
      const exists = await checkUsername(cleaned);
      setUsernameError(exists ? "Username already taken" : "");
    } else {
      setUsernameError("");
    }
  };

  const handleSubmit = async () => {
    if (!name || !username || !bio) {
      alert("Please fill all fields.");
      return;
    }
    if (usernameError) {
      alert("Please choose a different username.");
      return;
    }
    setLoading(true);
    try {
      await uploadProfile(name, username, bio, author);
      onProfileCreated();
      onClose();
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    disconnect();
    onClose(); // Change: Close modal after disconnect
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="bg-gray-800 border-0  text-white [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Complete Your Profile
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in your profile details to create your public profile.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              value={username ? `@${username}` : ""}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="@username"
            />
            {usernameError && (
              <p className="text-red-400 text-sm mt-1">{usernameError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
          <div className="flex justify-between gap-3">
            <Button
              variant="default"
              onClick={handleDisconnect}
              disabled={loading}
              className="cursor-pointer"
            >
              {" "}
              {/* Change: Add Disconnect button */}
              Disconnect Wallet
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !!usernameError}
              className="bg-main text-black cursor-pointer hover:bg-main/90"
            >
              {loading ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
