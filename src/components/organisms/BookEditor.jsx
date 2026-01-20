import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import Pill from '../atoms/Pill';
import { useStore } from '../../contexts/StoreContext';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../lib/firebase';

export default function BookEditor({ book, onSave, onCancel, onDelete }) {
    const { data } = useStore();
    const categories = data.categories || ["Fiction"]; // Fallback
    const genres = data.genres || ["General"];

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        author: "",
        category: "Fiction",
        genre: genres[0] || "General",
        condition: "Good",
        shortDescription: "",
        ebayUrl: "",
        tags: [],
        images: [],
        price: "" // Virtual field for editing
    });

    const [newFiles, setNewFiles] = useState([]); // Files selected but not yet uploaded
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (book) {
            // Extract price from tags for the form
            const priceTag = book.tags?.find(t => t.startsWith("Price: "));
            const price = priceTag ? priceTag.replace("Price: ", "") : "";
            setFormData({ ...book, price, images: book.images || [], tags: book.tags || [] });
            setNewFiles([]);
        } else {
            // New book default
            setFormData({
                id: `swb-${Date.now()}`,
                title: "",
                author: "",
                category: "Fiction",
                genre: genres[0] || "General",
                condition: "Good",
                shortDescription: "",
                ebayUrl: "",
                tags: [],
                images: [],
                price: ""
            });
            setNewFiles([]);
        }
    }, [book]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        setNewFiles(prev => [...prev, ...files]);
    };

    const removeExistingImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        // Sync price back to tags
        let newTags = formData.tags ? formData.tags.filter(t => !t.startsWith("Price: ")) : [];
        if (formData.price) {
            newTags.push(`Price: ${formData.price}`);
        }

        // Upload new files to Firebase Storage and collect URLs
        const storage = getStorage(app);
        const existingImages = formData.images ? [...formData.images] : [];

        for (const file of newFiles) {
            try {
                const path = `images/${formData.id}/${Date.now()}_${file.name}`;
                const ref = storageRef(storage, path);
                await uploadBytes(ref, file);
                const url = await getDownloadURL(ref);
                existingImages.push(url);
            } catch (err) {
                console.error('Image upload failed', err);
            }
        }

        const finalData = { ...formData, tags: newTags, images: existingImages };
        delete finalData.price; // Don't save virtual field to DB structure strictly if we use tags

        await onSave(finalData);
        setUploading(false);
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

                    <div>
                        <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Genre</label>
                        <select
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            className="w-full rounded bg-emerald-50/50 border border-emerald-900/10 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                        >
                            {genres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
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

                    <div>
                        <label className="block text-xs font-bold text-emerald-900 uppercase mb-1">Images</label>
                        <div className="flex flex-wrap gap-3 mb-2">
                            {(formData.images || []).map((url, i) => (
                                <div key={i} className="relative">
                                    <img src={url} alt={`img-${i}`} className="h-20 w-20 object-cover rounded border" />
                                    <button type="button" onClick={() => removeExistingImage(i)} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full h-5 w-5 text-xs">×</button>
                                </div>
                            ))}

                            {newFiles.map((file, i) => (
                                <div key={i} className="relative">
                                    <img src={URL.createObjectURL(file)} alt={file.name} className="h-20 w-20 object-cover rounded border" />
                                    <button type="button" onClick={() => removeNewFile(i)} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full h-5 w-5 text-xs">×</button>
                                </div>
                            ))}
                        </div>

                        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
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

                        <div className="flex gap-3 items-center">
                            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                            <Button type="submit" disabled={uploading}>{uploading ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
