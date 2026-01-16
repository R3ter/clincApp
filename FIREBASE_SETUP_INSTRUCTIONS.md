# Firebase Setup Instructions

## Important Notes

The URL you provided (`https://your-project-id.firebaseio.com/`) is for **Firebase Realtime Database**, but this Clinic app uses **Firestore**. You need to:

1. **Enable Firestore** in your Firebase project
2. **Get your complete Firebase config** from the Firebase Console

## Step-by-Step Setup

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/
- Select your project: **your-project-id**

### 2. Enable Firestore Database
- In the left sidebar, click **"Firestore Database"**
- Click **"Create database"**
- Choose **"Start in test mode"** (for development - allows read/write)
- Select a location for your database (choose the closest to your users)
- Click **"Enable"**

### 3. Get Your Firebase Configuration
- Go to **Project Settings** (gear icon ⚙️ next to "Project Overview")
- Scroll down to **"Your apps"** section
- If you don't have a web app yet:
  - Click **"Add app"** > Select **Web** (</> icon)
  - Register your app with a nickname (e.g., "Clinic App")
  - Copy the `firebaseConfig` object

### 4. Update Your App Configuration

You have two options:

#### Option A: Update `src/config/firebase.js` directly
Replace the placeholder values with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "AIza...", // Your actual API key
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789", // Your actual sender ID
  appId: "1:123456789:web:abc123" // Your actual app ID
};
```

#### Option B: Use Environment Variables (Recommended)
Create a `.env` file in the project root (`clinc/.env`):

```
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
REACT_APP_FIREBASE_APP_ID=your-actual-app-id
```

**Important:** Add `.env` to `.gitignore` to keep your keys secure!

### 5. Set Firestore Security Rules

For development (open access as per requirements):

1. Go to **Firestore Database** > **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

**⚠️ Warning:** These rules allow anyone to read/write. For production, implement proper authentication and security rules.

### 6. Test Your Connection

1. Start your app: `npm start`
2. Navigate to `/clinic/patients`
3. Try creating a patient
4. Check Firebase Console > Firestore Database to see if data appears

## Troubleshooting

- **"Firestore is not enabled"**: Make sure you completed Step 2
- **"Permission denied"**: Check your Firestore security rules
- **"Invalid API key"**: Verify your config values are correct
- **Data not appearing**: Check browser console for errors

## Next Steps

Once Firestore is set up and working:
- Your Clinic app will automatically save patients and sessions to Firestore
- Data will persist across page refreshes
- You can view/edit data in Firebase Console
