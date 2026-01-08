'use client'
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/types";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useRef, useCallback } from "react";




interface UserProfileResult {
    profile: UserProfile | null
    loading: boolean
    error:string | null
    refresh: () => Promise<void>;
}

export function useUserProfile(userId: string | undefined): UserProfileResult {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setProfile(null);
            setLoading(true);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        
        const userRef = doc(db,"users", userId);

        const unsubscribe = onSnapshot(userRef, (snapshot) =>{
            if(snapshot.exists()){
                const profileData = snapshot.data() as UserProfile;

                if(profileData.profileComplete){
                    const profileWithId = { ...profileData,
                         id: snapshot.id 
                        }
                        setProfile(profileWithId);
                        setError(null);
                }else{
                    setProfile(null);
                    setError(null)
                }
            }else{
                setProfile(null);
                setError(null);
            }
            setLoading(false);
    }, (err) =>{
        console.error("Error fetching user profile:", err);
        setError(err.message);
        setProfile(null);
        setLoading(false);
    }
    )

    return () => unsubscribe();
    }, [userId]);

    const refresh = useCallback(async () => {
    // Real time listener handles updates, so no action needed here
    },[])

    return {
        profile,
        loading,
        error,
        refresh
    }
}