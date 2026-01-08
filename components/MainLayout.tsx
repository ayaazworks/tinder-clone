import { UserProfile } from "@/lib/types";
import { User } from "firebase/auth";
import React from "react";
import ResponsiveNavigation from "./ResponsiveNavigation";

interface MainLayoutProps {
    user: User
    activeTab: string
    onTabChange: (tab: string) => void
    children: React.ReactNode
    profile: UserProfile

}
const MainLayout = ({ user, activeTab, onTabChange, children, profile }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-black flex relative pb-20 md:pb-0">
            <div className="hidden lg:block fixed top-0 left-0 h-screen">
                <ResponsiveNavigation
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    user={user}
                    profile={profile}
                />
            </div>
            <div className="flex-1 lg:ml-80 pb-16 lg:pb-0" >{children}</div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 ">
                <ResponsiveNavigation
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    user={user}
                    profile={profile}
                />
            </div>
            
        </div>
    )
}
export default MainLayout;