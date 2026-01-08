import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";




export function useFirebaseAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (err) {
            console.error("Error during logoutZ:", err);
        }
    }, []);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            setLoading(false);
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);

        })
        return () => unsubscribe();
    }, [])

    return {
        user, loading, logout
    }
}