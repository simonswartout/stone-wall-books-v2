import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { onSnapshot, setDoc } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';
import { getStoreConfigRef } from '../lib/firestore_utils';
import { useAuth } from './AuthContext';
import { DEFAULT_DATA } from '../lib/constants';

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const { user } = useAuth();
    const [data, setData] = useState(DEFAULT_DATA);

    useEffect(() => {
        if (!user) return;
        const dataRef = getStoreConfigRef(db, appId);
        const unsubscribe = onSnapshot(dataRef, (snapshot) => {
            if (snapshot.exists()) {
                const remoteData = snapshot.data();
                // Merge default lists (genres/categories) with remote data so new defaults are available
                const mergedGenres = Array.from(new Set([...(DEFAULT_DATA.genres || []), ...(remoteData.genres || [])]));
                const mergedCategories = Array.from(new Set([...(DEFAULT_DATA.categories || []), ...(remoteData.categories || [])]));
                const mergedData = { ...DEFAULT_DATA, ...remoteData, genres: mergedGenres, categories: mergedCategories };
                setData(mergedData);
            } else {
                setDoc(dataRef, DEFAULT_DATA).catch(err => console.error("Initial write error:", err));
            }
        }, (error) => console.error("Firestore error:", error));

        return () => unsubscribe();
    }, [user]);

    const isLibrarian = useMemo(() => {
        if (!user || user.isAnonymous) return false;
        if (!data.shop.librarianEmail) return true;
        return user.email === data.shop.librarianEmail;
    }, [user, data.shop.librarianEmail]);



    return (
        <StoreContext.Provider value={{ data, setData, isLibrarian }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => useContext(StoreContext);
