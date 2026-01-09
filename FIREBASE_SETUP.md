# Stone Wall Books - Firebase Setup Guide

This application relies on Firebase Authentication and Cloud Firestore. Follow these steps to configure your environment.

## 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., "stone-wall-books").
3. Enable **Authentication** and **Firestore Database**.

## 2. Configure Authentication
1. In the Firebase Console, go to **Authentication > Sign-in method**.
2. Enable **Anonymous** sign-in.
3. Enable **Google** sign-in.
   - You may need to configure the OAuth consent screen in Google Cloud Console if prompted.

## 3. Configure Firestore
1. Go to **Firestore Database**.
2. Create a database (start in **Test Mode** or **Production Mode**).
   - If Production, ensure you set rules to allow reading/writing `artifacts/{appId}/public/...`
3. The application expects the following data path:
   `artifacts/{appId}/public/data/configs/store_config`
   - `appId` defaults to `stone-wall-books-v2`.

### Recommended Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/configs/store_config {
      allow read: if true;
      allow write: if true; // Ideally restrict to the specific librarian email in production rules
    }
  }
}
```

## 4. Connect the Application
There are two ways to provide the configuration to the app:

### Option A: Edit Source Code (Recommended for Dev)
1. Go to Project Settings in Firebase Console.
2. Scroll to "Your apps" and select the Web app (create one if needed).
3. Copy the `firebaseConfig` object.
4. Open `src/lib/firebase.js` in this project.
5. Replace `defaultFirebaseConfig` with your actual config values.

### Option B: Runtime Injection (Production/Deployment)
The app supports injecting credentials via a global variable, which is useful for CDNs or static hosting where you don't want secrets in the bundle (though Firebase config is public).
- Define `window.__firebase_config` with the JSON string of the config before the app loads (e.g., in `index.html` head).
- Define `window.__app_id` to override the default App ID if needed.

## 5. Librarian Setup
1. Launch the application.
2. Go to the **Librarian / Data** tab.
3. Sign in with Google.
4. Click **Claim Desk**.
   - This sets your email as the lock for the desk. Future attempts to write data will check against this email logic in the app (and should be enforced by Security Rules in a real production environment).
