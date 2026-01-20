// Minimal client-side Cloudinary unsigned upload helper
// Usage: uploadToCloudinary(file, { cloudName: 'my-cloud', unsignedPreset: 'mypreset' })
// Note: unsigned uploads are public and should be used for testing only or with precautions.

export async function uploadToCloudinary(file, { cloudName, unsignedPreset }) {
  if (!file) throw new Error('No file provided');
  if (!cloudName || !unsignedPreset) throw new Error('Missing Cloudinary configuration');

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', unsignedPreset);

  const resp = await fetch(url, { method: 'POST', body: form });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Cloudinary upload failed: ${resp.status} ${text}`);
  }
  const json = await resp.json();
  // json.secure_url contains the hosted image URL
  return json;
}
