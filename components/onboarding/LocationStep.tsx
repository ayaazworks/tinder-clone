import { getCurrentLocation } from '@/lib/common-utils'
import { UserProfile } from '@/lib/types'
import { Loader, MapPin, Navigation, Search, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface LocationStepProps {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
}
const LocationStep = ({ profile, updateProfile }: LocationStepProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResult, setShowResults] = useState(false)
  const locationSuccessRef = useRef(false)
  const isLocationSet = profile.location.latitude !== 0 && profile.location.longitude !== 0;

  useEffect(() => {
    if (profile.location.address && !searchQuery) {
      setSearchQuery(profile.location.address)
    }
  }, [profile.location.address, searchQuery])

  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      setIsSearching(false)
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            "User-Agent": "DatingApp/1.0"
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search address failed")
    } finally {
      setIsSearching(false);
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      searchPlaces(value)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }
  const selectPlace = (place: any) => {
    setShowResults(false);
    setSearchQuery(place.display_name);
    const city = place.address?.city || place.address?.town || place.address?.village ||
      place.address?.locality || place.address?.district || place.address?.country || "Unknown City"

    const locationData = {
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      city: city,
      state: place.address?.state || place.address?.province || place.address?.region || "",
      country: place.address?.country || "",
      address: place.display_name
    };
    updateProfile({ location: locationData })
  };

  const handleGetCurrentLocation = async () => {
    setIsLoading(true)
    locationSuccessRef.current = false;
    try {
      const { lat: latitude, lng: longitude } = await getCurrentLocation();
      locationSuccessRef.current = true;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              "User-Agent": "DatingApp/1.0"
            }
          }
        );
        const data = await response.json();
        if (data && data.address) {
          let city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.locality ||
            data.address?.district ||
            data.address?.country

          if (!city && data.display_name) {
            const parts = data.display_name.split(",")
            if (parts.length > 0) {
              city = parts[0].trim();
            }
          }

          if (!city) {
            city = "Unkown City"
          }
          const locationData = {
            latitude,
            longitude,
            city: city,
            state: data.address?.state ||
              data.address?.province ||
              data.address?.region || "",
            country: data.address?.country || "",
            address: data.display_name
          };
          updateProfile({ location: locationData })
          setSearchQuery(locationData.address)

        }

      } catch (error) {
        console.error("Reverse address failed")
      } finally {
        setIsLoading(false);
      }

    } catch (error: any) {
      if (error.code === 1) {
        setTimeout(() => {
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
            searchInput.placeholder = "Location access denied. Please search for you city"
          }
        }, 100)
      }
      setIsLoading(false);
    }
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <MapPin className='h-12 w-12 text-blue-500 mx-auto mb-4' />
        <h3 className='text-xl font-bold text-gray-800 mb-2'>
          Where you located?
        </h3>
        <p className='text-gray-600'>
          Help others find you nearby by setting your location
        </p>

      </div>
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Search for you location
        </label>
        <div className='relative '>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Search for your city or address...'
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='pl-10 pr-10 h-12 border-gray-300 focus:border-primary focus:ring-primary rounded-xl '
            autoComplete='off'
          />
          {searchQuery && (
            <button onClick={() => {
              setSearchQuery("")
              setSearchResults([])
              setShowResults(false)
              updateProfile({
                location: {
                  latitude: 0,
                  longitude: 0,
                  city: "",
                  state: "",
                  country: "",
                  address: ""
                }
              })
            }}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 h-4 w-4'>
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
        {showResult && searchResults.length > 0 && (
          <div className='border border-gray-200 rounded-xl bg-white shadow-lg max-h-60 overflow-y-auto'>
            {searchResults.map((place, index) => (
              <button
                key={index}
                onClick={() => selectPlace(place)}
                className='w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
              >
                <div className='flex items-start gap-3'>
                  <MapPin className='h-4 w-4 text-gray-400 mt-1 shrink-0  ' />
                  <div>
                    <p className='font-medium text-gray-800'>
                      {place.display_name}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {place.address?.city ||
                        place.address?.town ||
                        place.address?.village ||
                        place.address?.locality ||
                        place.address?.district}
                      {place.address?.state && `, ${place.address?.state}`}
                      {place.address?.country && `, ${place.address?.country}`}
                    </p>
                  </div>

                </div>

              </button>
            ))}

          </div>
        )}
        {isSearching && (
          <div className='flex items-center justify-center py-2 '>
            <Loader className='h-4 w-4 animate-spin text-gray-400' />
            <span className='ml-2 text-sm text-gray-500'>Searching...</span>
          </div>
        )}
      </div>
      <div className='flex items-center'>
        <div className='flex-1 border-t boder-gray-300'></div>
        <span className='px-3 text-sm text-gray-500 '></span>
        <div className='flex-1 border-t boder-gray-300'></div>
      </div>
      <Button
      onClick={handleGetCurrentLocation}
      disabled={isLoading}
      variant="outline"
      className='w-full h-12 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed '
      >
        {isLoading ? (
          <>
            <Loader className='w-4 h-4 animate-spin mr-2' />
            Getting Location...
          </>
        ) : (
          <>
            <Navigation className='w-4 h-4 mr-2' />
            Use Current Location
          </>
        )}
      </Button>
      {isLocationSet && (
        <div className='bg-green-50 border border-green-200 rounded-xl p-4'>
          <div className='flex item-start gap-3 '>
            <MapPin className='w-5 h-5 text-green-500 shrink-0 mt-0.5' />
            <div>
              <p className='text-green-800 font-medium'>Location Set</p>
              <p className='text-green-700 text-sm font-medium'>{profile.location.city}</p>
              <p className='text-green-600 text-sm '>{profile.location.state},{profile.location.country}</p>
              <p className='text-green-500 text-xs mt-1'>{profile.location.address}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default LocationStep
