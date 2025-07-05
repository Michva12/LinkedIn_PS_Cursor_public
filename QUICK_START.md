# Quick Start Guide

Get your LinkedIn Profile Saver extension running in 5 minutes!

## 🚀 Quick Setup

### 1. Set up Google Apps Script (2 minutes)

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Replace the default code with the contents of `google-apps-script.gs`
4. Click "Deploy" → "New deployment"
5. Choose "Web app" → "Execute as: Me" → "Who has access: Anyone"
6. Click "Deploy" and copy the URL

### 2. Get Google OAuth Credentials (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google Sheets API" (APIs & Services → Library)
4. Create OAuth 2.0 credentials (APIs & Services → Credentials)
5. Choose "Chrome Extension" and enter a temporary extension ID (e.g., `YOUR_EXTENSION_ID_HERE`)
6. Copy the Client ID (e.g., `YOUR_GOOGLE_CLIENT_ID_HERE`)

### 3. Configure Extension (1 minute)

Run the setup script:
```bash
node setup.js
```

Or manually update these files:
- `manifest.json`: Replace `YOUR_GOOGLE_CLIENT_ID`
- `background.js`: Replace `YOUR_GOOGLE_APPS_SCRIPT_URL`

### 4. Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → Select this folder
4. Copy the extension ID from the page (e.g., `YOUR_EXTENSION_ID_HERE`)

### 5. Update OAuth Settings

1. Go back to Google Cloud Console
2. Update your OAuth credentials with the real extension ID (e.g., `YOUR_EXTENSION_ID_HERE`)
3. Add the extension ID to authorized origins (e.g., `YOUR_EXTENSION_ID_HERE`)

## ✅ Test It

1. Click the extension icon → "Connect to Google Sheets"
2. Visit any LinkedIn profile page
3. Check your Google Sheet (e.g., `YOUR_SPREADSHEET_ID_HERE`) for the saved data!

## 🆘 Need Help?

- Check the browser console for errors
- Verify all URLs and IDs are correct
- See the full [README.md](README.md) for detailed instructions

## 📝 What Gets Saved

- Name, headline, location
- Current company and about section
- Work experience and education
- Skills and endorsements
- Profile URL and timestamps

## 🔒 Privacy & Security

- Only extracts public profile data
- Data goes only to your Google Sheets
- No third-party servers involved
- OAuth tokens stored securely by Chrome 