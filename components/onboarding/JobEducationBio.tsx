import { UserProfile } from '@/lib/types'
import React from 'react'

interface JobEducationBioProps {
    profile: UserProfile
        updateProfile: (updates: Partial<UserProfile>) => void
}
const JobEducationBio = ({profile, updateProfile}: JobEducationBioProps) => {
  return (
    <div>
      
    </div>
  )
}

export default JobEducationBio
