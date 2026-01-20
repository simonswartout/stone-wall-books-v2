import React, { useState, useMemo } from 'react';
import { Search, Plus } from "lucide-react";
import Button from '../atoms/Button';
import Pill from '../atoms/Pill';
import { useStore } from '../../contexts/StoreContext';
import { setDoc } from 'firebase/firestore';
import { db, appId } from '../../lib/firebase';
import { getStoreConfigRef } from '../../lib/firestore_utils';
import BookEditor from './BookEditor';

export default function CatalogView() {
    const { data, isLibrarian } = useStore();
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [editingBook, setEditingBook] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const parsePriceFromBook = (book) => {
        const priceTag = book.tags?.find(t => t.startsWith("Price: "));
        if (!priceTag) return null;
        const priceString = priceTag.replace("Price: ", "");
        const num = parseFloat(priceString.replace(/[^0-9.]/g, ""));
        return isNaN(num) ? null : num;
    };

    const filteredCatalog = useMemo(() => {
        const items = data.catalog || [];
        const min = minPrice !== "" ? parseFloat(minPrice) : null;
        const max = maxPrice !== "" ? parseFloat(maxPrice) : null;

        return items.filter(item => {
            const matchesSearch = [item.title, item.author, item.shortDescription]
                .some(field => field?.toLowerCase().includes(search.toLowerCase()));

            const itemGenre = item.genre || "Uncategorized";
            const matchesGenre = selectedGenre === "All" || itemGenre === selectedGenre;

            if (!(matchesSearch && matchesGenre)) return false;

            const priceNum = parsePriceFromBook(item);
            if (min !== null && (priceNum === null || priceNum < min)) return false;
            if (max !== null && (priceNum === null || priceNum > max)) return false;

            return true;
        });
    }, [data.catalog, search, selectedGenre, minPrice, maxPrice]);

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
        const newData = { ...data, catalog: newCatalog };
        await setDoc(getStoreConfigRef(db, appId), newData);
        setIsEditorOpen(false);
    };

    const openNewBook = () => {
        setEditingBook(null);
        setIsEditorOpen(true);
    };

    const openEditBook = (book) => {
        setEditingBook(book);
        setIsEditorOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3 shadow-sm">
                <div className="mt-0.5 text-amber-600">
                    <Search className="h-5 w-5" />
                </div>
                <p className="text-sm font-serif italic text-emerald-900/80 leading-relaxed">
                    Note: The prices listed below are <strong>auction starting prices</strong> and may not reflect the current going rate. Please visit the eBay listing to learn more and see the latest activity.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-emerald-900 p-6 rounded-lg shadow-lg text-amber-50">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                    <input
                        type="text"
                        placeholder="Search titles..."
                        className="w-full rounded bg-emerald-800 border-none py-2.5 pl-10 pr-4 text-sm placeholder:text-emerald-400 outline-none focus:ring-2 focus:ring-amber-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto items-center">
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Min $"
                            className="w-20 rounded bg-emerald-800 border-none py-2 px-2 text-sm placeholder:text-emerald-400 outline-none focus:ring-2 focus:ring-amber-400"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Max $"
                            className="w-20 rounded bg-emerald-800 border-none py-2 px-2 text-sm placeholder:text-emerald-400 outline-none focus:ring-2 focus:ring-amber-400"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        {(minPrice || maxPrice) && (
                            <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded">Clear</button>
                        )}
                    </div>

                    <select
                        className="bg-emerald-800 text-sm rounded border-none py-2 px-4 focus:ring-2 focus:ring-amber-400 outline-none flex-grow md:w-40"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="All">All Genres</option>
                        {data.genres?.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {isLibrarian && (
                        <button onClick={openNewBook} className="bg-amber-400 text-emerald-900 rounded px-3 py-2 font-bold hover:bg-amber-300 transition-colors" title="Add Book">
                            <Plus className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {selectedGenre === "All" ? (
                // Group by genre
                Object.entries(filteredCatalog.reduce((acc, b) => {
                    const g = b.genre || 'Uncategorized';
                    acc[g] = acc[g] || [];
                    acc[g].push(b);
                    return acc;
                }, {})).map(([g, books]) => (
                    <div key={g} className="space-y-4">
                        <h4 className="text-lg font-serif font-bold text-emerald-900">{g}</h4>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {books.map(book => (
                                <div key={book.id} className="group flex flex-col h-full bg-[#fdfcf8] border border-emerald-900/10 rounded overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <div className="h-2 bg-emerald-800/10 group-hover:bg-amber-400 transition-colors" />

                                    {/* Images disabled */}
                                    <div className="h-44 bg-emerald-50/50 flex items-center justify-center overflow-hidden">
                                        <div className="text-sm text-emerald-700/40">No images</div>
                                    </div>

                                    <div className="p-6 flex-grow">
                                        <div className="flex justify-between items-start gap-2 mb-3">
                                            <Pill>{book.category}</Pill>
                                            {isLibrarian ? (
                                                <button onClick={() => openEditBook(book)} className="text-[10px] uppercase font-bold text-amber-600 hover:text-amber-800 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded-full hover:bg-amber-100">
                                                    Edit
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-mono text-emerald-800/40 uppercase">{book.condition}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-baseline mb-1 gap-2">
                                            <h3 className="font-serif text-xl font-black text-emerald-950 leading-tight">{book.title}</h3>
                                            {book.tags?.find(t => t.startsWith("Price: ")) && (
                                                <span className="font-mono text-lg font-bold text-emerald-700 whitespace-nowrap">
                                                    {book.tags.find(t => t.startsWith("Price: ")).replace("Price: ", "")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-serif italic text-emerald-800/70 text-sm mb-4">by {book.author}</p>
                                        <p className="text-sm text-emerald-900/80 leading-relaxed line-clamp-3">{book.shortDescription}</p>
                                    </div>
                                    <div className="p-4 bg-emerald-50/30 border-t border-emerald-900/5 flex justify-between items-center">
                                        <span className="text-[10px] text-emerald-800/40 font-mono">ID: {book.id}</span>
                                        <div className="flex gap-2">
                                            <a href={book.ebayUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="py-1 text-xs">eBay</Button></a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCatalog.map(book => (
                        <div key={book.id} className="group flex flex-col h-full bg-[#fdfcf8] border border-emerald-900/10 rounded overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="h-2 bg-emerald-800/10 group-hover:bg-amber-400 transition-colors" />

                            {/* Images disabled */}
                            <div className="h-44 bg-emerald-50/50 flex items-center justify-center overflow-hidden">
                                <div className="text-sm text-emerald-700/40">No images</div>
                            </div>

                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start gap-2 mb-3">
                                    <Pill>{book.category}</Pill>
                                    {isLibrarian ? (
                                        <button onClick={() => openEditBook(book)} className="text-[10px] uppercase font-bold text-amber-600 hover:text-amber-800 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded-full hover:bg-amber-100">
                                            Edit
                                        </button>
                                    ) : (
                                        <span className="text-[10px] font-mono text-emerald-800/40 uppercase">{book.condition}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-baseline mb-1 gap-2">
                                    <h3 className="font-serif text-xl font-black text-emerald-950 leading-tight">{book.title}</h3>
                                    {book.tags?.find(t => t.startsWith("Price: ")) && (
                                        <span className="font-mono text-lg font-bold text-emerald-700 whitespace-nowrap">
                                            {book.tags.find(t => t.startsWith("Price: ")).replace("Price: ", "")}
                                        </span>
                                    )}
                                </div>
                                <p className="font-serif italic text-emerald-800/70 text-sm mb-4">by {book.author}</p>
                                <p className="text-sm text-emerald-900/80 leading-relaxed line-clamp-3">{book.shortDescription}</p>
                            </div>
                            <div className="p-4 bg-emerald-50/30 border-t border-emerald-900/5 flex justify-between items-center">
                                <span className="text-[10px] text-emerald-800/40 font-mono">ID: {book.id}</span>
                                <div className="flex gap-2">
                                    <a href={book.ebayUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="py-1 text-xs">eBay</Button></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
