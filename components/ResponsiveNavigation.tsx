import { UserProfile } from '@/lib/types';
import { User } from 'firebase/auth';
import React from 'react'


interface ResponsiveNavigation {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    profile: UserProfile;
    user:User
}
const ResponsiveNavigation = ({user,activeTab,onTabChange,profile} : ResponsiveNavigation) => {
  return (
    <div>
      
    </div>
  )
}

export default ResponsiveNavigation
