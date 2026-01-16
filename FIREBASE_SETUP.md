# Firebase Setup Instructions

## Configuration

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database in your Firebase project
3. Get your Firebase configuration from Project Settings > General > Your apps
4. Update the Firebase configuration in `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Environment Variables (Optional)

Alternatively, you can use environment variables by creating a `.env` file in the project root:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Firestore Security Rules

For development (open access - as per requirements), use these rules:

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

**Note:** For production, implement proper authentication and security rules.

## Firestore Indexes

The app uses the following queries that may require composite indexes:
- `patients` collection: ordered by `createdAt` (desc)
- `sessions` subcollection: ordered by `sessionDate` (desc)

Firebase will prompt you to create these indexes when needed, or you can create them manually in the Firebase Console.
