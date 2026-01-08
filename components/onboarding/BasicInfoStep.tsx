import { GENDER_OPTIONS, validationUtils } from '@/lib/common-utils'
import { UserProfile } from '@/lib/types'
import { Calendar, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'


interface BasicInfoStepProps {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void

}
const BasicInfoStep = ({ profile, updateProfile }: BasicInfoStepProps) => {
  const [ageInput, setAgeInput] = useState<string>(profile.age ? String(profile.age) : "")

  useEffect(() => {
    setAgeInput(profile.age ? String(profile.age) : "")
  }, [profile.age])

  const parseAge = ageInput.trim() === "" ? NaN : Number.parseInt(ageInput, 10)
  const isTypedUnderage = !Number.isNaN(parseAge) && parseAge < 18;
  const isProfileAgeInValid = !ageInput && !validationUtils.isValidAge(profile.age) && profile.age > 0;

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <User className='h-12 w-12 text-blue-500 mx-auto mb-4' />
        <h3 className='text-xl font-bold text-gray-800 mb-2'>
          Let's get to know you!
        </h3>
        <p className='text-gray-600'>
          Tell us a bit about yourself so we can personalize your experience.
        </p>

      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='name' className='flex items-center spac-x-2 text-gray-700 font-medium' >
            <User className='h-4 w-4 text-primary ' />
            <span> Full Name</span>
          </Label>
          <Input id='name'
            type='text'
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder='Enter your full name'
            className='border-gray-300 border-primary focus:ring-gray-900 rounded-xl h-12 ' />


        </div>
        <div className='space-y-2'>
          <Label htmlFor='age' className='flex items-center spac-x-2 text-gray-700 font-medium' >
            <Calendar className='h-4 w-4 text-gray-900 ' />
            <span> Age</span>
          </Label>
          <Input id='age'
            type='number'
            min='18'
            max='100'
            value={ageInput}
            onChange={(e) => {
              setAgeInput(e.target.value);
            }}
            onBlur={() => {
              const value = ageInput.trim();
              if (value === "") {
                updateProfile({ age: 0 })
                return
              }

              const numValue = Number.parseInt(value, 10)
              if (validationUtils.isValidAge(numValue)) {
                updateProfile({ age: numValue })
              } else {
                updateProfile({ age: 18 });
                setAgeInput("18")
              }
            }}
            placeholder='Your Age'
            className='border-gray-300 focus:border-gray-900 focus:ring-gray-900 rounded-xl h-12 ' />

          {isTypedUnderage && (
            <p className='text-sm text-red-500 '>
              Age must be 18 or 18+
            </p>
          )}
          {isTypedUnderage && isProfileAgeInValid && (
            <p className='text-sm text-red-500 '>
              Must be 18 or older
            </p>
          )}


        </div>


      </div>

      <div className='space-y-2'>
        <Label className='flex items-center spac-x-2 text-gray-700 font-medium' >
          <User className='h-4 w-4 text-gray-900 ' />
          <span> Gender</span>
        </Label>
        <Select value={profile.gender} onValueChange={(value) => updateProfile({ gender: value })}>
          <SelectTrigger className='w-full border-gray-300 focus:border-gray-300 rounded-xl h-12'>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {GENDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.icon} {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>
      <div className='space-y-2'>
        <Label htmlFor='phone' className='flex items-center spac-x-2 text-gray-700 font-medium' >
          <User className='h-4 w-4 text-gray-900 ' />
          <span> Phone Number</span>
        </Label>
        <Input id='phone'
          type='tel'
          value={profile.phone}
          onChange={(e) => updateProfile({ phone: e.target.value })}
          placeholder='+91 98979 51097'
          className='border-gray-300 focus:border-gray-900 focus:ring-gray-900 rounded-xl h-12 ' />

        {profile.phone && !validationUtils.isValidPhone(profile.phone) && (
          <p className='text-sm text-red-500'>Please enter a valid number</p>
        )}


      </div>

    </div>
  )
}

export default BasicInfoStep
