import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const initAuth = async () => {
            // Wait for the prompt auth state to be restored
            await auth.authStateReady();

            if (!isMounted) return;

            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else if (!auth.currentUser) {
                // Only sign in anonymously if NO user was restored
                try {
                    await signInAnonymously(auth);
                } catch (e) {
                    console.error("Anonymous auth failed", e);
                }
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (isMounted) {
                setUser(u);
                setLoading(false);
            }
        });

        initAuth();
        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
