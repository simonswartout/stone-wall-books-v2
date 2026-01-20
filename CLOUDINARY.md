Cloudinary quick test (unsigned upload)

This repository includes a small client helper and an example component to test direct browser uploads to Cloudinary without touching Firebase Storage.

Files added:
- `src/lib/cloudinary.js` - minimal helper: `uploadToCloudinary(file, { cloudName, unsignedPreset })`
- `src/components/organisms/CloudinaryUploaderExample.jsx` - small component to pick a file and upload to Cloudinary and show the returned `secure_url`.

Quick setup
1. Create a free Cloudinary account at https://cloudinary.com/ and get your Cloud name.
2. Create an *unsigned* upload preset:
   - Console → Settings → Upload → Upload Presets → Add unsigned preset.
   - Note the preset name.
3. Add env vars to your Vite dev env (create `.env.local` at project root):

```
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UNSIGNED_PRESET=your_unsigned_preset_name
```

4. Restart dev server (`npm run dev`) and open (for example) the new example route/component.

How to use in your app
- The `uploadToCloudinary` helper returns the Cloudinary response (including `secure_url`). Use that URL as the image in your catalog entry when saving to Firestore.

Security notes
- Unsigned uploads are public and can be abused. Use unsigned only for testing or for non-sensitive flows.
- For production: implement a server-signed upload (server generates a signature) or proxy uploads through your own server using the Admin SDK (preferred if you need control).
