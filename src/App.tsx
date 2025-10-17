import Footer from "./components/Footer";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
// import { useEffect, useState } from "react";
// import { useAccount } from "wagmi";
// import { getProfile } from "./lib/irys";
// import { ProfileModal } from "./components/ProfileModal";

function App() {
  // const { address } = useAccount();
  // const [, setHasProfile] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [, setRefreshKey] = useState(0);

  // useEffect(() => {
  //   const checkProfile = async () => {
  //     if (address) {
  //       const profile = await getProfile(address);
  //       setHasProfile(!!profile);
  //       setShowModal(!profile);
  //     } else {
  //       setHasProfile(false);
  //       setShowModal(false); // Don't show modal if not connected
  //     }
  //   };
  //   checkProfile();
  // }, [address]);

  // const handleProfileCreated = () => {
  //   setHasProfile(true);
  //   setShowModal(false);
  //   setRefreshKey((prev) => prev + 1); // Trigger SideNav to re-fetch username
  // };

  return (
    <main className="main">
      <Navbar />
      {/* <Navbar onProfileCreated={handleProfileCreated} /> */}
      <Home />
      <Footer />
      {/* {showModal && address && (
        <ProfileModal
          author={address}
          onClose={() => setShowModal(false)}
          onProfileCreated={handleProfileCreated}
        />
      )} */}
    </main>
  );
}

export default App;
