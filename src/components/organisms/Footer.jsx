import React from 'react';

export default function Footer({ setTab, isLibrarian }) {
    return (
        <footer className="mt-20 border-t border-emerald-900/10 bg-[#fdfcf8] py-12">
            <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="text-center md:text-left">
                    <h5 className="font-serif font-black uppercase text-emerald-950 tracking-tighter">Stone Wall Books</h5>
                    <p className="text-xs font-serif italic text-emerald-800">Est. 2026 — Secure Librarian Portal</p>
                </div>
                <div className="flex gap-8 text-xs font-serif uppercase tracking-widest text-emerald-900">
                    <button onClick={() => setTab("Catalog")} className="hover:text-amber-600 transition-colors">Catalog</button>
                    <a href="https://www.ebay.com/sch/i.html?item=366103084195&rt=nc&_trksid=p4429486.m3561.l161211&_ssn=stonewallbooks" target="_blank" rel="noreferrer" className="hover:text-amber-600 transition-colors">eBay Store</a>
                    <button onClick={() => setTab("Data")} className="hover:text-amber-600 transition-colors">
                        {isLibrarian ? "Manage" : "Librarian Login"}
                    </button>
                </div>
            </div>
        </footer>
    );
}
