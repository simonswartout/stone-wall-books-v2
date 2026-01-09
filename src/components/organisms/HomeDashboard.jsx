import React from 'react';
import { Coffee, ExternalLink, ChevronRight, MapPin, Mail } from "lucide-react";
import SectionCard from '../molecules/SectionCard';
import Button from '../atoms/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function HomeDashboard({ setTab }) {
    const { user } = useAuth();
    const { data } = useStore();
    const shop = data.shop;

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
        <div className="grid gap-8 lg:grid-cols-3">
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
    );
}
