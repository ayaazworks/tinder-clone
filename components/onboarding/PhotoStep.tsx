import { UserProfile } from '@/lib/types'
import React from 'react'

interface PhotoStepProps {
    profile: UserProfile
        updateProfile: (updates: Partial<UserProfile>) => void
}

const PhotoStep = ({profile, updateProfile}: PhotoStepProps) => {
  return (
    <div>
      
    </div>
  )
}

export default PhotoStep
