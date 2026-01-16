# Troubleshooting: ERR_BLOCKED_BY_CLIENT

## Problem
You're seeing `net::ERR_BLOCKED_BY_CLIENT` errors when trying to save data to Firestore. This means a browser extension is blocking the Firebase/Firestore connection.

## Solution

### Step 1: Disable Ad Blockers
The most common cause is ad blockers. Try:

1. **Temporarily disable ad blockers** for testing:
   - **uBlock Origin**: Click the extension icon → Toggle off
   - **AdBlock Plus**: Click the extension icon → Disable on this site
   - **AdBlock**: Click the extension icon → Pause on this site
   - **Privacy Badger**: Click the extension icon → Disable for this site

2. **Or add an exception** for Firebase domains:
   - Add `firestore.googleapis.com` to your ad blocker's whitelist
   - Add `*.googleapis.com` to your whitelist
   - Add `*.firebaseio.com` to your whitelist

### Step 2: Check Other Extensions
Other extensions that might block:
- **Privacy Badger**
- **Ghostery**
- **NoScript** (if you have it)
- **HTTPS Everywhere**
- Corporate security extensions

### Step 3: Try Incognito/Private Mode
1. Open an **Incognito/Private window** (Ctrl+Shift+N or Ctrl+Shift+P)
2. Disable extensions in incognito mode
3. Test your app there

### Step 4: Check Browser Settings
Some browsers have built-in tracking protection:
- **Chrome**: Settings → Privacy and security → Privacy Sandbox → Turn off
- **Firefox**: Settings → Privacy & Security → Enhanced Tracking Protection → Turn off for testing

### Step 5: Verify Firestore is Enabled
Make sure Firestore is actually enabled in your Firebase project:
1. Go to https://console.firebase.google.com/
2. Select project `your-project-id`
3. Click **Firestore Database** in the left sidebar
4. If you see "Create database", click it and enable Firestore

### Step 6: Check Firestore Security Rules
1. In Firebase Console → Firestore Database → **Rules** tab
2. Make sure rules allow read/write (for development):
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
3. Click **Publish**

### Quick Test
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try creating a patient
4. Look for blocked requests (they'll be red)
5. Check which extension is blocking them

## Alternative: Use a Different Browser
If the issue persists, try:
- **Chrome** (if using Firefox)
- **Firefox** (if using Chrome)
- **Edge** (if using Chrome)

This will help identify if it's browser-specific.
