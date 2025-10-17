import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/irys";
import { ProfileModal } from "@/components/ProfileModal";
import { Outlet, useNavigate } from "react-router-dom";

const ProfileCheckWrapper = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", address],
    queryFn: () => getProfile(address || ""),
    enabled: !!address,
  });

  useEffect(() => {
    if (!address) {
      setShowModal(false); // Hide modal if wallet disconnected
    } else if (!isLoading && !profile) {
      setShowModal(true); // Show modal if connected but no profile
    } else {
      setShowModal(false); // Hide modal if profile exists
    }
  }, [address, profile, isLoading]);

  const handleProfileCreated = () => {
    setShowModal(false);
    setRefreshKey((prev) => prev + 1); // Trigger re-fetch in components like SideNav
  };

  return (
    <>
      <Outlet /> {/* Render child routes */}
      {showModal && address && (
        <ProfileModal
          author={address}
          onClose={() => {
            setShowModal(false);
            navigate("/"); // Navigate to home on modal close
          }}
          onProfileCreated={handleProfileCreated}
        />
      )}
    </>
  );
};

export default ProfileCheckWrapper;