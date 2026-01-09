import React from 'react';
import { Book, Info, BookOpen, Lock, Unlock } from "lucide-react";
import TabButton from '../molecules/TabButton';

export default function Header({ shop, activeTab, setActiveTab, isLibrarian }) {
    return (
        <header className="border-b border-emerald-900/10 bg-[#fdfcf8] shadow-sm">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <h1 className="font-serif text-4xl font-black tracking-tighter text-emerald-950 uppercase">
                            {shop.name}
                        </h1>
                        <p className="mt-1 font-serif italic text-emerald-800/70">{shop.tagline}</p>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-1">
                        <TabButton active={activeTab === "Home"} onClick={() => setActiveTab("Home")} icon={BookOpen}>Home</TabButton>
                        <TabButton active={activeTab === "Catalog"} onClick={() => setActiveTab("Catalog")} icon={Book}>Catalog</TabButton>
                        <TabButton active={activeTab === "Procurement Program"} onClick={() => setActiveTab("Procurement Program")} icon={Info}>Program</TabButton>
                        <TabButton active={activeTab === "Data"} onClick={() => setActiveTab("Data")} icon={isLibrarian ? Unlock : Lock}>
                            {isLibrarian ? "Librarian" : "Locked Area"}
                        </TabButton>
                    </nav>
                </div>
            </div>
        </header>
    );
}
