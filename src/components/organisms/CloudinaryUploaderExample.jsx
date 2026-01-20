import React, { useState } from 'react';
import { uploadToCloudinary } from '../../lib/cloudinary';

export default function CloudinaryUploaderExample() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  const handleFile = (e) => setFile(e.target.files?.[0] || null);

  const handleUpload = async () => {
    if (!file) return alert('Select a file first');
    if (!cloudName || !unsignedPreset) return alert('Missing Cloudinary config in env (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UNSIGNED_PRESET)');
    setUploading(true);
    try {
      const json = await uploadToCloudinary(file, { cloudName, unsignedPreset });
      setResult(json);
    } catch (err) {
      alert(err.message || err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Cloudinary Upload Test</h3>
      <input type="file" onChange={handleFile} />
      <div className="mt-2 flex gap-2">
        <button onClick={handleUpload} disabled={uploading} className="btn">
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>

      {result && (
        <div className="mt-4">
          <div>Upload successful:</div>
          <a href={result.secure_url} target="_blank" rel="noreferrer">{result.secure_url}</a>
          <div className="mt-2">
            <img src={result.secure_url} alt="uploaded" className="max-w-xs border" />
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600">
        Note: this uses an unsigned preset which allows client-side uploads and is intended for testing only. For production, prefer signed uploads or a server-side proxy.
      </div>
    </div>
  );
}
