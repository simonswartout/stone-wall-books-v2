import React, { useState } from 'react';
import { Coffee, ExternalLink, ChevronRight, MapPin, Mail } from "lucide-react";
import SectionCard from '../molecules/SectionCard';
import Button from '../atoms/Button';
import BookEditor from './BookEditor';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously } from 'firebase/auth';
import { auth, db, appId } from '../../lib/firebase';
import { setDoc } from 'firebase/firestore';
import { getStoreConfigRef } from '../../lib/firestore_utils';

export default function HomeDashboard({ setTab }) {
    const { user } = useAuth();
    const { data, isLibrarian } = useStore();
    const shop = data.shop;

    const [editingBook, setEditingBook] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [assigningSlot, setAssigningSlot] = useState(null);
    const [assignValue, setAssignValue] = useState("");

    const openEditBook = (book) => {
        setEditingBook(book);
        setIsEditorOpen(true);
    };

    const handleSaveBook = async (book) => {
        const currentCatalog = data.catalog || [];
        let newCatalog;
        const existingIndex = currentCatalog.findIndex(b => b.id === book.id);
        if (existingIndex >= 0) {
            newCatalog = [...currentCatalog];
            newCatalog[existingIndex] = book;
        } else {
            newCatalog = [...currentCatalog, book];
        }

        const newData = { ...data, catalog: newCatalog };
        await setDoc(getStoreConfigRef(db, appId), newData);
        setIsEditorOpen(false);
    };

    const handleDeleteBook = async () => {
        if (!editingBook || !confirm("Are you sure you want to delete this book?")) return;

        const newCatalog = data.catalog.filter(b => b.id !== editingBook.id);
        const newData = { ...data, catalog: newCatalog, featured: data.featured?.map(f => f === editingBook.id ? null : f) };
        await setDoc(getStoreConfigRef(db, appId), newData);
        setIsEditorOpen(false);
    };

    const assignFeatured = async (slotIndex, bookId) => {
        const newFeatured = [...(data.featured || [null, null])];
        newFeatured[slotIndex] = bookId || null;
        const newData = { ...data, featured: newFeatured };
        await setDoc(getStoreConfigRef(db, appId), newData);
        setAssigningSlot(null);
        setAssignValue("");
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

    return (
        <div className="home-hero">
            <div className="home-hero-inner grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <SectionCard
                        title="Greetings"
                        subtitle="A note from the librarian"
                        icon={Coffee}
                        right={
                            <a href={shop.ebayStoreUrl} target="_blank" rel="noreferrer">
                                <Button>Visit eBay Store <ExternalLink className="h-4 w-4" /></Button>
                            </a>
                        }
                    >
                    <div className="font-serif text-lg leading-relaxed text-emerald-900/90 space-y-4">
                        <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-emerald-900 first-letter:leading-none">
                            Welcome to the digital collections of Stone Wall Books. Here you can view our catalog, learn about our community procurement program, or go right to our eBay store front.
                        </p>
                        <p>
                            When you find a book in the catalog that speaks to you on this site, simply follow the link to our eBay page where transactions are handled securely.
                        </p>
                        <p className="italic text-emerald-800">
                            We believe every book deserves a new life.
                        </p>
                    </div>
                </SectionCard>

                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="group relative overflow-hidden rounded-lg bg-emerald-900 p-8 text-amber-50 shadow-lg transition-transform hover:-translate-y-1">
                            <h3 className="font-serif text-2xl font-bold">The Catalog</h3>
                            <p className="mt-2 text-emerald-100/80 font-serif italic">Browse our current collection of treasures.</p>
                            <button onClick={() => setTab("Catalog")} className="mt-6 flex items-center gap-2 font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4 transition-colors">
                                Search the shelves <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="group relative overflow-hidden rounded-lg border border-amber-200 bg-amber-50 p-8 shadow-sm transition-transform hover:-translate-y-1">
                            <h3 className="font-serif text-2xl font-bold text-emerald-950">Collaborate</h3>
                            <p className="mt-2 text-emerald-800/70 font-serif italic">Learn how to share your books with our program.</p>
                            <button onClick={() => setTab("Procurement Program")} className="mt-6 flex items-center gap-2 font-bold text-emerald-900 hover:text-emerald-700 underline underline-offset-4 transition-colors">
                                Program Details <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-sm border">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800/40 mb-3">Featured</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[0,1].map(i => {
                                const id = data.featured?.[i];
                                const book = data.catalog?.find(b => b.id === id);
                                return (
                                    <div key={i} className="p-3 rounded border bg-emerald-50/30 flex flex-col items-start gap-2 relative">
                                        {isLibrarian && (
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                {book ? <button onClick={() => openEditBook(book)} className="text-xs px-2 py-1 bg-amber-300 text-emerald-900 rounded">Edit</button> : null}
                                                <button onClick={() => { setAssigningSlot(i); setAssignValue(id || ""); }} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-900 rounded">Assign</button>
                                                {book ? <button onClick={() => assignFeatured(i, null)} className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded">Clear</button> : null}
                                            </div>
                                        )}

                                        {book ? (
                                            <>
                                                <div className="h-20 w-full overflow-hidden rounded bg-white border">
                                                    {book.images?.[0] ? <img src={book.images[0]} alt={book.title} className="h-full w-full object-cover" /> : <div className="text-xs p-3 text-emerald-700/40">No image</div>}
                                                </div>
                                                <div className="text-sm font-serif font-bold">{book.title}</div>
                                                <div className="text-xs italic">by {book.author}</div>
                                                <a className="mt-2 text-xs" href={book.ebayUrl} target="_blank" rel="noreferrer">View on eBay</a>
                                            </>
                                        ) : (
                                            <div className="text-sm text-emerald-700/60">Empty slot — fill from Librarian Desk or assign</div>
                                        )}

                                        {assigningSlot === i && isLibrarian && (
                                            <div className="mt-2 w-full">
                                                <select className="w-full p-2 border rounded text-sm" value={assignValue} onChange={(e) => setAssignValue(e.target.value)}>
                                                    <option value="">— None —</option>
                                                    {data.catalog?.map(b => <option key={b.id} value={b.id}>{b.title} — {b.author}</option>)}
                                                </select>
                                                <div className="mt-2 flex gap-2 justify-end">
                                                    <button className="text-xs px-2 py-1 bg-emerald-100 rounded" onClick={() => { assignFeatured(i, assignValue || null); }}>Save</button>
                                                    <button className="text-xs px-2 py-1 bg-white border rounded" onClick={() => setAssigningSlot(null)}>Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div> 
                </div>
                <aside className="space-y-6">
                <div className="rounded-lg bg-[#e9e4d7] p-6 shadow-inner border border-emerald-900/5">
                    <h4 className="font-serif text-xs font-black uppercase tracking-widest text-emerald-800/60 mb-4">Shop Information</h4>
                    <div className="space-y-4 text-sm font-serif">
                        <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-amber-600 mt-1" /><span>{shop.locationLine}</span></div>
                        <div className="flex items-start gap-3"><Mail className="h-4 w-4 text-amber-600 mt-1" /><span>{shop.contactEmail}</span></div>
                        <hr className="border-emerald-900/10" />
                        {user && !user.isAnonymous ? (
                            <div className="bg-white/50 p-3 rounded text-xs italic">
                                Logged in as: <br /><strong>{user.email}</strong>
                                <button onClick={handleSignOut} className="block mt-2 text-rose-700 font-bold hover:underline">Sign Out</button>
                            </div>
                        ) : (
                            <button onClick={loginWithGoogle} className="text-xs text-emerald-800 font-bold underline">Librarian Login</button>
                        )}
                    </div>
                </div>
            </aside>
            </div>

            {isEditorOpen && (
                <BookEditor
                    book={editingBook}
                    onSave={handleSaveBook}
                    onCancel={() => setIsEditorOpen(false)}
                    onDelete={editingBook ? handleDeleteBook : undefined}
                />
            )}
        </div>
    );
}
