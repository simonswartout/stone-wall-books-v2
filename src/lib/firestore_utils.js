import { doc } from 'firebase/firestore';

export const getStoreConfigRef = (db, appId) => {
    if (!appId) {
        console.error("getStoreConfigRef: appId is missing", appId);
        // Fallback or error? doc() will throw if we pass undefined, so this log helps.
    }
    // Path: artifacts/{appId}/public/data/configs/store_config
    // This is 6 segments which is EVEN, so it creates a valid DocumentReference.
    return doc(db, 'artifacts', String(appId), 'public', 'data', 'configs', 'store_config');
};
