import React, { useState, useEffect } from 'react';
import { setDoc } from 'firebase/firestore';
import { db, appId } from '../../lib/firebase';
import { getStoreConfigRef } from '../../lib/firestore_utils';
import { useStore } from '../../contexts/StoreContext';
import Button from '../atoms/Button';

export default function JsonEditor({ isOpen, onClose }) {
    const { data } = useStore();
    const [editorText, setEditorText] = useState("");
    const [editorError, setEditorError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setEditorText(JSON.stringify(data, null, 2));
            setEditorError("");
        }
    }, [isOpen, data]);

    const applyChanges = async () => {
        try {
            const parsed = JSON.parse(editorText);
            const dataRef = getStoreConfigRef(db, appId);
            await setDoc(dataRef, parsed);
            onClose(); // In a real app we might wait for confirmation, but context updates automatically via listener
        } catch (e) {
            setEditorError("Invalid JSON structure.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm">
            <div className="w-full max-w-4xl bg-[#fdfcf8] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 bg-emerald-900 text-amber-50 flex justify-between items-center">
                    <h3 className="font-serif font-bold">Raw Catalog Editor</h3>
                    <button onClick={onClose} className="text-emerald-300 hover:text-white">&times; Close</button>
                </div>
                <div className="flex-grow p-6 flex flex-col">
                    <textarea
                        className="flex-grow w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-4 font-mono text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                        spellCheck={false}
                        value={editorText}
                        onChange={(e) => setEditorText(e.target.value)}
                    />
                    {editorError && <p className="mt-2 text-red-600 text-xs font-bold">{editorError}</p>}
                    <div className="mt-6 flex gap-3">
                        <Button onClick={applyChanges}>Save to Cloud</Button>
                        <Button variant="secondary" onClick={onClose}>Discard</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
