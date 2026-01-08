'use client'
import Loader from "@/components/Loader";
import MainLayout from "@/components/MainLayout";
import { useActiveTab } from "@/hooks/useActiveTab";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MessagePage from "./message/page";
import DiscoveryPage from "./discovery/page";
import MatchesPage from "./matches/page";
import ProfilePage from "./profile/page";

export default function Home() {

  const { user, loading: userLoading } = useFirebaseAuth();
  const { profile, loading: profileLoading } = useUserProfile(user?.uid);
  const [activeTab, setActiveTab] = useActiveTab("activeTab", "discovery");
  const router = useRouter();

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }
    console.log("user:",user);
    console.log("Profile",profile);

    if (user && !profile && !profileLoading) {
      router.push("/user-onboarding");
      return;
    }
  }, [user, userLoading, profile, profileLoading, router]);

  const handleSelectMatch = () =>{
    setActiveTab("message")
  }

  if (userLoading) {
    return <Loader message="Checking authentication..." />;
  }

  if (profileLoading) {
    return <Loader message="Loading your profile..." />;
  }
  if (!user) {
    return <Loader message="Redirecting to login..." />;
  }
  if (!profile) {
    return <Loader message="Redirecting to profile setup..." />;
  }
  console.log("User in home page:", user);
  return (
    <MainLayout user={user} activeTab={activeTab} onTabChange={setActiveTab} profile={profile}>
      {activeTab === "messages" ? (
        <MessagePage user={user} />
      ) : activeTab === "discovery" ? (
        <DiscoveryPage user={user} onSelectMatch={handleSelectMatch} />
      ) : activeTab === "matches" ? (
        <MatchesPage user={user} onSelectMatch={handleSelectMatch} />
      ) : activeTab === 'profile' ? (
        <ProfilePage user={user} isOwnProfile={true} />
      ) : (
        null
      )}

    </MainLayout>
  );
}
