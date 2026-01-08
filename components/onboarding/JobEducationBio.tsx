import { UserProfile } from '@/lib/types'
import { Briefcase, Building2, FileText, GraduationCap, School } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea' // Assuming you have this from shadcn, otherwise use standard textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { EDUCATION_OPTIONS } from '@/lib/common-utils'
// You might want to move this to your @/lib/common-utils file later


interface CareerAndAboutStepProps {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
}

const JobEducationBio = ({ profile, updateProfile }: CareerAndAboutStepProps) => {

  // Helper to update nested additionalInfo fields without overwriting the whole object
  const handleInfoUpdate = (key: keyof UserProfile['additionalInfo'], value: string) => {
    updateProfile({
      additionalInfo: {
        ...profile.additionalInfo,
        [key]: value
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <Briefcase className='h-12 w-12 text-blue-500 mx-auto mb-4' />
        <h3 className='text-xl font-bold text-gray-800 mb-2'>
          Career & Lifestyle
        </h3>
        <p className='text-gray-600'>
          Share a little about your work, education, and what makes you tick.
        </p>
      </div>

      {/* Row 1: Job & Company */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='jobTitle' className='flex items-center space-x-2 text-gray-700 font-medium'>
            <Briefcase className='h-4 w-4 text-primary' />
            <span>Job Title</span>
          </Label>
          <Input
            id='jobTitle'
            type='text'
            value={profile.additionalInfo?.jobTitle || ''}
            onChange={(e) => handleInfoUpdate('jobTitle', e.target.value)}
            placeholder='e.g. Product Designer'
            className='border-gray-300 focus:border-gray-900 focus:ring-gray-900 rounded-xl h-12'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='company' className='flex items-center space-x-2 text-gray-700 font-medium'>
            <Building2 className='h-4 w-4 text-primary' />
            <span>Company</span>
          </Label>
          <Input
            id='company'
            type='text'
            value={profile.additionalInfo?.company || ''}
            onChange={(e) => handleInfoUpdate('company', e.target.value)}
            placeholder='Where do you work?'
            className='border-gray-300 focus:border-gray-900 focus:ring-gray-900 rounded-xl h-12'
          />
        </div>
      </div>

      {/* Row 2: Education & University */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label className='flex items-center space-x-2 text-gray-700 font-medium'>
            <GraduationCap className='h-4 w-4 text-primary' />
            <span>Education Level</span>
          </Label>
          <Select
            value={profile.additionalInfo?.educationLevel || ''}
            onValueChange={(value) => handleInfoUpdate('educationLevel', value)}
          >
            <SelectTrigger className='w-full border-gray-300 focus:border-gray-900 rounded-xl h-12'>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {EDUCATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='university' className='flex items-center space-x-2 text-gray-700 font-medium'>
            <School className='h-4 w-4 text-primary' />
            <span>University / College</span>
          </Label>
          <Input
            id='university'
            type='text'
            value={profile.additionalInfo?.university || ''}
            onChange={(e) => handleInfoUpdate('university', e.target.value)}
            placeholder='Where did you study?'
            className='border-gray-300 focus:border-gray-900 focus:ring-gray-900 rounded-xl h-12'
          />
        </div>
      </div>

      {/* Row 3: Bio (Full Width) */}
      <div className='space-y-2'>
        <Label htmlFor='bio' className='flex items-center space-x-2 text-gray-700 font-medium'>
          <FileText className='h-4 w-4 text-primary' />
          <span>Bio</span>
        </Label>
        <Textarea
          id='bio'
          value={profile.additionalInfo?.bio || ''}
          onChange={(e) => handleInfoUpdate('bio', e.target.value)}
          placeholder="I enjoy hiking, coding, and coffee..."
          className='border-gray-300 focus:border-gray-900 focus:ring-gray-900 rounded-xl min-h-[120px] resize-none p-3'
        />
        <p className='text-xs text-gray-500 text-right'>
          {(profile.additionalInfo?.bio || '').length} / 500 characters
        </p>
      </div>
    </div>
  )
}

export default JobEducationBio