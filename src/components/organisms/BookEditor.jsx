import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import Pill from '../atoms/Pill';
import { useStore } from '../../contexts/StoreContext';

export default function BookEditor({ book, onSave, onCancel, onDelete }) {
    const { data } = useStore();
    const categories = data.categories || ["Fiction"]; // Fallback

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        author: "",
        category: "Fiction",
        condition: "Good",
        shortDescription: "",
        ebayUrl: "",
        tags: [],
        price: "" // Virtual field for editing
    });

    useEffect(() => {
        if (book) {
            // Extract price from tags for the form
            const priceTag = book.tags?.find(t => t.startsWith("Price: "));
            const price = priceTag ? priceTag.replace("Price: ", "") : "";
            setFormData({ ...book, price });
        } else {
            // New book default
            setFormData({
                id: `swb-${Date.now()}`,
                title: "",
                author: "",
                category: "Fiction",
                condition: "Good",
                shortDescription: "",
                ebayUrl: "",
                tags: [],
                price: ""
            });
        }
    }, [book]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Sync price back to tags
        let newTags = formData.tags ? formData.tags.filter(t => !t.startsWith("Price: ")) : [];
        if (formData.price) {
            newTags.push(`Price: ${formData.price}`);
        }

        const finalData = { ...formData, tags: newTags };
        delete finalData.price; // Don't save virtual field to DB structure strictly if we use tags

        onSave(finalData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#fdfcf8] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 bg-emerald-900 text-amber-50 flex justify-between items-center">
                    <h3 className="font-serif font-bold">{book ? "Edit Book" : "Add New Book"}</h3>
                    <button onClick={onCancel} className="text-emerald-300 hover:text-white">&times; Close</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Title</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Author</label>
                            <input
                                required
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Condition</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                            >
                                <option value="New">New</option>
                                <option value="Like New">Like New</option>
                                <option value="Very Good">Very Good</option>
                                <option value="Good">Good</option>
                                <option value="Acceptable">Acceptable</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">eBay URL</label>
                            <input
                                name="ebayUrl"
                                value={formData.ebayUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Price</label>
                            <input
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="$..."
                                className="w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Description</label>
                        <textarea
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-emerald-900/10">
                        {book && onDelete ? (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="text-xs text-rose-700 font-bold hover:underline"
                            >
                                Delete Book
                            </button>
                        ) : <div />}

                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
