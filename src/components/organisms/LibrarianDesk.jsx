import React, { useState } from 'react';
import { Lock, Key, Database, Book, Download, RotateCcw, UserCheck } from "lucide-react";
import SectionCard from '../molecules/SectionCard';
import Button from '../atoms/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import { auth, db, appId } from '../../lib/firebase';
import { getStoreConfigRef } from '../../lib/firestore_utils';
import JsonEditor from './JsonEditor';

import { UploadCloud } from "lucide-react";
import { parseCSV } from '../../lib/csv_utils';

export default function LibrarianDesk() {
    const { user } = useAuth();
    const { data, isLibrarian, DEFAULT_DATA } = useStore();
    const [editorOpen, setEditorOpen] = useState(false);

    const handleCsvUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target.result;
                const newBooks = parseCSV(text);

                if (newBooks.length === 0) {
                    alert("No valid books found in CSV.");
                    return;
                }

                if (!confirm(`Found ${newBooks.length} books. This will REPLACE the current catalog. Continue?`)) return;

                // Extract unique categories from CSV, splitting by '/'
                const rawCategories = newBooks.map(b => b.category).filter(Boolean);
                const extractedCategories = [...new Set(
                    rawCategories.flatMap(cat => cat.split('/').map(s => s.trim()))
                )].filter(Boolean).sort();

                const newData = {
                    ...data,
                    catalog: newBooks,
                    // If we found categories, replace the old ones. Otherwise keep existing.
                    categories: extractedCategories.length > 0 ? extractedCategories : data.categories
                };

                const dataRef = getStoreConfigRef(db, appId);
                await setDoc(dataRef, newData);
                alert(`Catalog updated! Found ${extractedCategories.length} categories.`);
            } catch (err) {
                console.error("CSV Parse Error", err);
                alert("Failed to parse CSV.");
            }
        };
        reader.readAsText(file);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            signInAnonymously(auth);
        });
    };

    const claimDesk = async () => {
        if (!user || user.isAnonymous) return;
        const newData = {
            ...data,
            shop: { ...data.shop, librarianEmail: user.email }
        };
        const dataRef = getStoreConfigRef(db, appId);
        await setDoc(dataRef, newData);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {!isLibrarian ? (
                <SectionCard title="Secure Desk" subtitle="Authentication Required" icon={Lock}>
                    <div className="text-center py-8 space-y-6">
                        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Key className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-serif text-emerald-900 font-bold">This area is reserved for the Librarian.</p>
                            <p className="text-sm font-serif italic text-emerald-800/60">
                                Please sign in with your verified Google account.
                            </p>
                        </div>
                        {user && !user.isAnonymous ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded text-rose-900 text-sm">
                                    Access Denied: <strong>{user.email}</strong> is not recognized as the Librarian.
                                </div>
                                <Button variant="outline" onClick={handleSignOut}>Switch Account</Button>
                            </div>
                        ) : (
                            <Button onClick={loginWithGoogle} className="w-full">
                                Login with Google
                            </Button>
                        )}
                    </div>
                </SectionCard>
            ) : (
                <SectionCard
                    title="Librarian's Desk"
                    subtitle={`Welcome, ${user.email}`}
                    icon={Database}
                    right={<Button variant="outline" className="text-xs py-1" onClick={handleSignOut}>{data.shop.librarianEmail === user.email ? "Lock Desk" : "Sign Out"}</Button>}
                >
                    {!data.shop.librarianEmail && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded flex items-center justify-between">
                            <div className="text-sm text-emerald-900">
                                <strong>First Time Setup:</strong> Claim this desk as the primary Librarian.
                            </div>
                            <Button variant="primary" className="text-xs" onClick={claimDesk}>Claim as {user.email}</Button>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                        <Button onClick={() => setEditorOpen(true)}><Book className="h-4 w-4" /> Edit Catalog JSON</Button>
                        <label className="inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-serif font-bold transition-all duration-200 bg-emerald-900/10 text-emerald-900 hover:bg-emerald-900/20 cursor-pointer">
                            <UploadCloud className="h-4 w-4" />
                            Import CSV
                            <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
                        </label>
                        <Button variant="secondary" onClick={() => {
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(blob);
                            a.download = "catalog-backup.json";
                            a.click();
                        }}><Download className="h-4 w-4" /> Backup Data</Button>
                        <Button variant="outline" onClick={() => { if (confirm("Reset catalog?")) setDoc(getStoreConfigRef(db, appId), DEFAULT_DATA); }}>
                            <RotateCcw className="h-4 w-4" /> Reset Store
                        </Button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-emerald-900/5 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800/40">Shop Settings</h4>
                        <div className="bg-amber-50/50 p-4 rounded border border-amber-100 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-[10px] font-bold text-emerald-900 uppercase mb-1">Contact Email</label>
                                    <input
                                        id="contactEmail-input"
                                        type="email"
                                        className="w-full rounded bg-white border border-emerald-900/10 p-2 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                                        defaultValue={data.shop.contactEmail}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-emerald-900 uppercase mb-1">eBay Store URL</label>
                                    <input
                                        id="ebayUrl-input"
                                        type="url"
                                        className="w-full rounded bg-white border border-emerald-900/10 p-2 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                                        defaultValue={data.shop.ebayStoreUrl}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-emerald-800/60 italic">Changes here update the Home and Footer links.</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="text-[10px] py-1" onClick={async () => {
                                        const newData = {
                                            ...data,
                                            shop: {
                                                ...data.shop,
                                                contactEmail: "simon@luminarylabs.dev",
                                                ebayStoreUrl: "https://www.ebay.com/sch/i.html?item=366103084195&rt=nc&_trksid=p4429486.m3561.l161211&_ssn=stonewallbooks"
                                            }
                                        };
                                        await setDoc(getStoreConfigRef(db, appId), newData);
                                        document.getElementById("contactEmail-input").value = "simon@luminarylabs.dev";
                                        document.getElementById("ebayUrl-input").value = "https://www.ebay.com/sch/i.html?item=366103084195&rt=nc&_trksid=p4429486.m3561.l161211&_ssn=stonewallbooks";
                                        alert("Restored defaults!");
                                    }}>Sync Code Defaults</Button>
                                    <Button className="text-[10px] py-1" onClick={async () => {
                                        const email = document.getElementById("contactEmail-input").value;
                                        const url = document.getElementById("ebayUrl-input").value;
                                        const newData = { ...data, shop: { ...data.shop, contactEmail: email, ebayStoreUrl: url } };
                                        await setDoc(getStoreConfigRef(db, appId), newData);
                                        alert("Shop settings saved!");
                                    }}>Save Shop Info</Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800/40">Librarian Access</h4>
                            <div className="flex items-center gap-2 text-sm text-emerald-900">
                                <UserCheck className="h-4 w-4 text-emerald-600" />
                                <span>Authorized Email: <strong>{data.shop.librarianEmail || "None set (Public Access Mode)"}</strong></span>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            )}
            {editorOpen && <JsonEditor isOpen={editorOpen} onClose={() => setEditorOpen(false)} />}
        </div>
    );
}
