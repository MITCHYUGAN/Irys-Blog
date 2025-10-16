import { useEffect, useState } from "react";
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { useAccount } from "wagmi";
import { getProfile } from "./lib/irys";
import { ProfileModal } from "./components/ProfileModal";

function App() {

  const { address } = useAccount();
  const [hasProfile, setHasProfile] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const checkProfile = async () => {
      if (address) {
        const profile = await getProfile(address);
        setHasProfile(!!profile);
        if (!profile) setShowModal(true);
      }
    };
    checkProfile();
  }, [address]);

  const handleProfileCreated = () => {
    setHasProfile(true);
    setShowModal(false);
    setRefreshKey((prev) => prev + 1); // Trigger SideNav to re-fetch username
  };

  return (
    <main className="main">
      <Navbar onProfileCreated={handleProfileCreated}/>
      <Home />
      <Footer />
      {showModal && (
        <ProfileModal
          author={address || ""}
          onClose={() => setShowModal(false)}
          onProfileCreated={handleProfileCreated}
        />
      )}
    </main>
  )
}

export default App
