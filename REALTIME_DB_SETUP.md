# Firebase Realtime Database Setup

## ✅ App is Now Configured for Realtime Database

The Clinic app has been converted to use **Firebase Realtime Database** instead of Firestore.

## Database Structure

Your data will be stored in this structure:

```
{
  "patients": {
    "patientId1": {
      "fullName": "John Doe",
      "israelId": "123456789",
      "birthDate": 631152000000,  // milliseconds timestamp
      "gender": "male",
      "diagnosis": "...",
      "therapyName": "CBT",
      "totalSessionsPlanned": 10,
      "createdAt": 1234567890000,
      "updatedAt": 1234567890000,
      "sessions": {
        "sessionId1": {
          "sessionType": "CBT",
          "sessionDate": 1234567890000,  // milliseconds timestamp
          "notes": "...",
          "createdAt": 1234567890000,
          "updatedAt": 1234567890000
        }
      }
    }
  }
}
```

## Firebase Configuration

Update `src/config/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id.firebaseio.com",  // ← Important!
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

**Important:** Make sure `databaseURL` is set to `https://your-project-id.firebaseio.com`

## Get Your Firebase Config

1. Go to https://console.firebase.google.com/
2. Select project **your-project-id**
3. Click **Project Settings** (gear icon)
4. Scroll to **"Your apps"** section
5. If you don't have a web app:
   - Click **"Add app"** > Select **Web** (</> icon)
   - Register your app
   - Copy the `firebaseConfig` object

## Realtime Database Security Rules

1. Go to **Realtime Database** (not Firestore) in Firebase Console
2. Click **Rules** tab
3. For development (open access), use:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Click **Publish**

⚠️ **Warning:** These rules allow anyone to read/write. For production, implement proper authentication and security rules.

## Enable Realtime Database

If you haven't enabled Realtime Database yet:

1. In Firebase Console, click **"Realtime Database"** in the left sidebar
2. Click **"Create Database"**
3. Choose a location (closest to your users)
4. Choose **"Start in test mode"** (for development)
5. Click **"Enable"**

## Testing

1. Start your app: `npm start`
2. Navigate to `/clinic/patients`
3. Create a patient
4. Check Firebase Console > Realtime Database to see your data

## Differences from Firestore

- **Data Structure**: JSON tree instead of collections/documents
- **Timestamps**: Stored as milliseconds (numbers) instead of Firestore Timestamps
- **Queries**: Different query syntax (though we're doing client-side filtering for search)
- **Real-time**: Built-in real-time synchronization (can add live updates later if needed)

## Troubleshooting

- **"Permission denied"**: Check your Realtime Database security rules
- **"Database not found"**: Make sure Realtime Database is enabled in Firebase Console
- **"Invalid database URL"**: Verify `databaseURL` in firebase.js matches your project
