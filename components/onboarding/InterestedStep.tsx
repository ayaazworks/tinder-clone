import { INTERESTS_OPTIONS } from '@/lib/common-utils'
import { UserProfile } from '@/lib/types'
import { Heart } from 'lucide-react'
import React from 'react'
import { Badge } from '../ui/badge'

interface InterestedStepProps {
    profile: UserProfile
        updateProfile: (updates: Partial<UserProfile>) => void
}

const InterestedStep = ( {profile, updateProfile}: InterestedStepProps) => {
  const handleInterestToggle = (interest:string)=>{
    const currentInterest = profile.interests;
    const newInterests =  currentInterest.includes(interest) ? currentInterest.filter((i)=> i !== interest) : [...currentInterest,interest]

    updateProfile({interests:newInterests})
  }
  return (
    <div className='space-y-6'>
      <div className='text-center' >
        <Heart className='h-12 w-12 text-pink-500 mx-auto mb-4' />
        <h3 className='text-xl font-bold text-gray-800 mb-2'>
          What are you passionate about?
        </h3>
        <p className='text-gray-600'>
          Select upto 8 interests that represent you 
        </p>
      </div>
      <div className='grid gri-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' >
        {INTERESTS_OPTIONS.map((interest)=>(
          <Badge key={interest.name}
          variant={profile.interests.includes(interest.name) ? "default" : "outline"}
          className={`w-full cursor-pointer p-3 text-center justify-center transition-all hover:scale-105 ${profile.interests.includes(interest.name) ? "bg-linear-to-r from-pink-500 to-red-500 text-white border-0" : "border-gray-300 hover:border-pink-400 hover:bg-pink-50" }`}
          onClick={()=> handleInterestToggle(interest.name)}
          >
            <span className='text-lg mr-2'>{interest.icon}</span>
            <span className='text-sm font-medium'>{interest.name}</span>

          </Badge>
        ))}

      </div>
      {profile.interests.length > 8 && (
        <p className='text-amber-600 text-sm text-center'>
          You can select up to 8 interests. Please deselect some to continue
        </p>
      )}
      
    </div>
  )
}

export default InterestedStep
