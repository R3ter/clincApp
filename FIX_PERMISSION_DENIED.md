# Fix "Permission denied" Error

## Problem
You're getting `Error: Permission denied` when trying to access the Realtime Database. This is because the security rules are blocking access.

## Solution: Update Security Rules

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: **your-project-id**

### Step 2: Open Realtime Database Rules
1. In the left sidebar, click **"Realtime Database"** (NOT Firestore)
2. Click on the **"Rules"** tab at the top

### Step 3: Update the Rules
Replace the existing rules with these (for development/testing):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Step 4: Publish
1. Click **"Publish"** button
2. Wait for confirmation that rules are published

### Step 5: Test
1. Refresh your app
2. Try creating a patient again
3. The error should be gone!

## What These Rules Do

- `.read: true` - Allows anyone to read data
- `.write: true` - Allows anyone to write data

⚠️ **Important:** These rules are for **development only**. For production, you should:
- Add authentication
- Restrict access based on user roles
- Use more specific path-based rules

## Alternative: More Secure Rules (Optional)

If you want slightly more control while still allowing access:

```json
{
  "rules": {
    "patients": {
      ".read": true,
      ".write": true
    }
  }
}
```

This only allows access to the `patients` path, but still allows full read/write within it.

## Still Having Issues?

1. Make sure you're editing **Realtime Database** rules, not Firestore rules
2. Make sure you clicked **"Publish"** after updating
3. Wait a few seconds for rules to propagate
4. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
