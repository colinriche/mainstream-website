# Firebase Setup Guide

This guide will help you set up Firebase authentication and Firestore for the Mainstream Movement website.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAjav7x8oJLyeH4dWCvbd3TJYHlWnrwBHk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mainstream-movement.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mainstream-movement
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mainstream-movement.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=127357378231
NEXT_PUBLIC_FIREBASE_APP_ID=1:127357378231:web:948946c4750e1601a7b732
```

## Firebase Console Setup

### 1. Enable Authentication Providers

1. Go to [Firebase Console](https://console.firebase.google.com/project/mainstream-movement/authentication/providers)
2. Navigate to **Authentication** > **Sign-in method**
3. Enable the following providers:
   - **Google**: Enable and add your OAuth consent screen details
   - **GitHub**: Enable and add your GitHub OAuth app credentials

### 2. Configure OAuth Providers

#### Google OAuth Setup:
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** and enable it
3. Add your project's support email
4. Save the changes

#### GitHub OAuth Setup:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Mainstream Movement
   - **Homepage URL**: https://gomainstream.org
   - **Authorization callback URL**: https://mainstream-movement.firebaseapp.com/__/auth/handler
3. Copy the Client ID and Client Secret
4. In Firebase Console, go to **Authentication** > **Sign-in method** > **GitHub**
5. Enter the Client ID and Client Secret
6. Save the changes

### 3. Set Up Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/project/mainstream-movement/firestore)
2. Navigate to **Firestore Database**
3. Click **Create database**
4. Choose **Start in production mode** (or test mode for development)
5. Select your preferred location
6. Click **Enable**

### 4. Configure Firestore Security Rules

Go to **Firestore Database** > **Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact submissions - only authenticated users can read
    match /contactSubmissions/{submissionId} {
      allow read: if request.auth != null;
      allow create: if true; // Anyone can submit
      allow update, delete: if request.auth != null;
    }
    
    // Pledge submissions - only authenticated users can read
    match /pledgeSubmissions/{submissionId} {
      allow read: if request.auth != null;
      allow create: if true; // Anyone can submit
      allow update, delete: if request.auth != null;
    }
  }
}
```

## Features Implemented

### Authentication
- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ Protected admin routes
- ✅ Authentication context for React components

### Firestore Integration
- ✅ Contact form submissions saved to `contactSubmissions` collection
- ✅ Pledge form submissions saved to `pledgeSubmissions` collection
- ✅ Real-time updates in admin panel
- ✅ Read/unread status tracking

### Admin Panel
- ✅ View all form submissions
- ✅ Filter by read/unread status
- ✅ Mark submissions as read/unread
- ✅ Real-time updates
- ✅ User authentication display

## Usage

### Accessing the Admin Panel

1. Navigate to `/login` on your website
2. Sign in with Google or GitHub
3. You'll be redirected to `/admin` where you can view all form submissions

### API Endpoints

- `POST /api/contact` - Saves contact form submissions to Firestore
- `POST /api/pledge` - Saves pledge submissions to Firestore

Both endpoints now automatically save data to Firestore with timestamps and read status.

## Security Notes

- All environment variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Firestore security rules ensure only authenticated users can read submissions
- Anyone can create submissions (for public forms)
- Only authenticated users can update/delete submissions

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure all environment variables are set in `.env.local`
- Restart your development server after adding environment variables

### "Permission denied" in Firestore
- Check your Firestore security rules
- Ensure you're signed in when accessing the admin panel

### OAuth providers not working
- Verify OAuth credentials in Firebase Console
- Check that callback URLs are correctly configured
- Ensure your domain is authorized in Firebase Console
