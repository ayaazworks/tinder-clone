'use client'
import BasicInfoStep from '@/components/onboarding/BasicInfoStep';
import InterestedStep from '@/components/onboarding/InterestedStep';
import JobEducationBio from '@/components/onboarding/JobEducationBio';
import LifeStyleStep from '@/components/onboarding/LifeStyleStep';
import LocationStep from '@/components/onboarding/LocationStep';
import PhotoStep from '@/components/onboarding/PhotoStep';
import PhysicalStep from '@/components/onboarding/PhysicalStep';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useOnboading } from '@/hooks/useOnboarding';
import { ONBOARDING_STEPS } from '@/lib/common-utils';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowLeft, ArrowLeftCircle, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import toast from 'react-hot-toast';

const OnboardingPage = () => {
  const [saving, setSaving] = useState(false);
  const { user, logout } = useFirebaseAuth();
  const { currentStep, profile, updateProfile, nextStep, prevStep, gotoStep, getOverallCompletion, getStepCompletion } = useOnboading(user?.uid);

  const router = useRouter();

  const steps = ONBOARDING_STEPS;

  const handlelogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out successfully.")
      router.push('/login')
    } catch (error) {
      console.error("Error during logout", error)
      toast.error("Failed to logout. Please try again.")
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (!user?.uid) return;

      await setDoc(doc(db, 'users', user?.uid), {
        ...profile,
        profileComplete: true,
        createdAt: new Date(),
        uid: user.uid,
        email: user.email,
        isOnline: true,
        lastSeen: new Date()
      });

      localStorage.removeItem("onboarding_step");
      localStorage.removeItem("onboarding_profile");
      localStorage.removeItem("last_onboading_user_id");

      toast.success("Welcome! Your profile has been created successfully.");
      router.push('/');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep profile={profile} updateProfile={updateProfile} />;
      case 2:
        return <InterestedStep profile={profile} updateProfile={updateProfile} />;
      case 3:
        return <PhysicalStep profile={profile} updateProfile={updateProfile} />;
      case 4:
        return <LifeStyleStep profile={profile} updateProfile={updateProfile} />;
      case 5:
        return <LocationStep profile={profile} updateProfile={updateProfile} />;
      case 6:
        return <JobEducationBio profile={profile} updateProfile={updateProfile} />;
      case 7:
        return <PhotoStep profile={profile} updateProfile={updateProfile} />;
      default:
        return null;
    }
  };

  const canProceedToNext = getStepCompletion(currentStep);
  const isLastStep = currentStep === steps.length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'>
      
      {/* Mobile Header */}
      <div className='md:hidden bg-white border-b shadow-sm'>
        <div className='p-4'>
          <div className='flex items-center justify-between mb-3'>
            <button
              onClick={handlelogout}
              className='p-1 rounded-full hover:bg-gray-100 transition-all duration-200 group'
              title='logout'
            >
              {/* Fixed: text-white was invisible on bg-white */}
              <ArrowLeftCircle className='h-6 w-6 text-gray-600 group-hover:text-gray-800 transition-colors' />
            </button>

            <h1 className='text-lg font-bold text-gray-900'>
              Complete Profile
            </h1>
            <span className='text-sm font-medium text-gray-900'>
              {getOverallCompletion()}%
            </span>
          </div>

          <Progress value={getOverallCompletion()} className='h-2' />
        </div>

        <div className='flex justify-between p-4 overflow-x-auto'>
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => {
                const isAccessible = step.id === 1 || getStepCompletion(step.id - 1);
                if (isAccessible) gotoStep(step.id)
              }}
              className={`min-w-8 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${step.id === currentStep
                ? 'bg-gray-900 text-white shadow-glow'
                : getStepCompletion(step.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
                }`}
            >
              {getStepCompletion(step.id) ? <Check className='h-4 w-4' /> : step.id}
            </button>
          ))}
        </div>
      </div>

      <div className='flex justify-center items-start'>
        
        {/* Desktop Sidebar */}
        {/* Fixed: bg-linear-to-b -> bg-gradient-to-b */}
        <div className='hidden md:block w-80 bg-gradient-to-b from-pink-500 to-red-500 min-h-screen p-6 text-white sticky top-0 h-screen overflow-y-auto'>
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-2'>
              <h1 className='text-2xl font-bold'>
                Complete Profile
              </h1>
              <button
                onClick={handlelogout}
                className='p-1 rounded-full hover:bg-white/20 transition-all duration-200 group'
                title='logout'
              >
                {/* Fixed: Gray text on pink/red bg was hard to read */}
                <ArrowLeftCircle className='h-6 w-6 text-white group-hover:text-white/90 transition-colors' />
              </button>
            </div>
            
            {/* Fixed: flext -> flex */}
            <div className='flex items-center space-x-2 mb-4'>
              <Progress value={getOverallCompletion()} className='flex-1 bg-white/20' />
              <span className='text-sm font-medium'>{getOverallCompletion()}%</span>
            </div>
          </div>

          <div className='space-y-4'>
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={() => {
                  const isAccessible = step.id === 1 || getStepCompletion(step.id - 1);
                  if (isAccessible) gotoStep(step.id)
                }}
                className={`flex items-center rounded-lg space-x-3 p-3 cursor-pointer text-sm transition-all ${step.id === currentStep ? "bg-white/20 shadow-lg" : 'hover:bg-white/10'}`}
              >
                {/* Fixed: Added 'flex' to center the icon */}
                <div className={`flex w-10 h-10 rounded-full items-center justify-center text-lg ${getStepCompletion(step.id) ? 'bg-green-500 text-white' : currentStep === step.id ? 'bg-white text-pink-500' : 'bg-white/20'}`}>
                  {getStepCompletion(step.id) ? (<Check className='h-4 w-4' />) : (
                    step.icon
                  )}
                </div>
                <div>
                  {/* Fixed: font-meditum -> font-medium */}
                  <p className='font-medium'>{step.title}</p>
                  <p className='text-xs opacity-75'>
                    {getStepCompletion(step.id) ? "Completed" : "Incomplete"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 md:p-8 p-4 w-full'>
          <div className='max-w-2xl mx-auto'>
            {/* Fixed: bg-whie -> bg-white/90 for better readability */}
            <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm'>
              <CardContent className='p-8'>
                {renderStep()}
                
                <div className='flex justify-between mt-8 pt-4 border-t'>
                  <Button
                    variant='outline'
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className='flex items-center gap-2 bg-transparent hover:bg-gray-50'
                  >
                    {/* Fixed: Icon structure (text should not be inside ArrowLeft) */}
                    <ArrowLeft className='h-4 w-4' />
                    <span>Previous</span>
                  </Button>

                  {isLastStep ? (
                    <Button
                      // Fixed: onClick was prevStep, changed to handleSaveProfile
                      onClick={handleSaveProfile}
                      disabled={!canProceedToNext || saving || profile.photos.length < 2}
                      className='bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white flex items-center gap-2'
                    >
                      {saving ? "Saving..." : "Complete Profile"}
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceedToNext}
                      className='bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white flex items-center gap-2'
                    >
                      <span>Next</span>
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage