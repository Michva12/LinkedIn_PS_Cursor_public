# LinkedIn Profile Saver Chrome Extension
# You will need to create the ICONS folder, with 3 images, 16, 48, and 128 pixels
A Chrome extension that automatically extracts and saves LinkedIn profile data to Google Sheets when you visit profile pages.

## Features

- **Automatic Extraction**: Automatically extracts profile data when visiting LinkedIn profile pages
- **Google Sheets Integration**: Saves data directly to your Google Sheets
- **Duplicate Prevention**: Prevents duplicate entries by checking profile URLs
- **Rich Data Capture**: Extracts name, headline, location, company, about, experience, education, and skills
- **Real-time Notifications**: Shows notifications when profiles are saved
- **Beautiful UI**: Modern, responsive popup interface

## Prerequisites

- Google Chrome browser
- Google account with access to Google Sheets
- Basic knowledge of Google Apps Script

## Installation & Setup

### Step 1: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Replace the default code with the contents of `google-apps-script.gs`
4. Save the project with a name like "LinkedIn Profile Saver"
5. Deploy the script as a web app:
   - Click "Deploy" → "New deployment"
   - Choose "Web app" as the type
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
6. Copy the web app URL (you'll need this for the extension)

### Step 2: Create Google Cloud Project (for OAuth)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Chrome Extension" as application type
   - Enter your extension ID (you'll get this after loading the extension)
   - Copy the Client ID

### Step 3: Configure the Extension

1. Update `manifest.json`:
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID
   
2. Update `background.js`:
   - Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with your Google Apps Script web app URL

3. Update `google-apps-script.gs`:
   - Replace `YOUR_SPREADSHEET_ID` with your Google Sheet ID (optional - the script can create one for you)

### Step 4: Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the folder containing your extension files
5. Copy the extension ID from the extensions page

### Step 5: Update OAuth Configuration

1. Go back to Google Cloud Console
2. Update your OAuth 2.0 Client ID with the extension ID you just copied
3. Add the extension ID to the authorized origins

### Step 6: Create Icons

1. Create icon files in the `icons/` directory:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
2. Or use placeholder images for testing

## Usage

1. **Install the Extension**: Follow the setup steps above
2. **Authenticate**: Click the extension icon and click "Connect to Google Sheets"
3. **Browse LinkedIn**: Visit any LinkedIn profile page (e.g., `https://www.linkedin.com/in/username`)
4. **Automatic Saving**: The extension will automatically extract and save the profile data
5. **View Results**: Check your Google Sheet to see the saved profiles

## Data Extracted

The extension extracts the following information from LinkedIn profiles:

- **Name**: Full name of the person
- **Headline**: Professional title/headline
- **Location**: Geographic location
- **Current Company**: Current employer
- **About**: Summary/about section
- **Experience**: Work history (title, company, duration)
- **Education**: Educational background (school, degree, year)
- **Skills**: Listed skills and endorsements
- **Profile URL**: Link to the LinkedIn profile
- **Extracted At**: Timestamp of when data was extracted
- **Last Updated**: Timestamp of last update

## File Structure

```
linkedin-profile-saver/
├── manifest.json          # Extension manifest
├── content.js             # Content script for LinkedIn
├── background.js          # Background service worker
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── google-apps-script.gs  # Google Apps Script backend
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**:
   - Check that your Google Client ID is correct
   - Ensure the Google Sheets API is enabled
   - Verify the extension ID is added to OAuth credentials

2. **Data Not Saving**:
   - Check the Google Apps Script URL is correct
   - Verify the script is deployed as a web app
   - Check browser console for error messages

3. **Extension Not Working**:
   - Ensure the extension is loaded in developer mode
   - Check that all files are in the correct location
   - Verify the manifest.json is valid

4. **LinkedIn Selectors Not Working**:
   - LinkedIn may have updated their HTML structure
   - Check the browser console for extraction errors
   - Update the selectors in `content.js` if needed

### Debug Mode

To enable debug logging:
1. Open Chrome DevTools
2. Go to the Console tab
3. Look for messages starting with "LinkedIn Profile Saver:"

## Security Considerations

- The extension only accesses LinkedIn profile pages
- OAuth tokens are stored securely by Chrome
- No data is sent to third-party servers
- All data processing happens locally or in your Google account

## Privacy

- The extension only extracts publicly visible profile information
- Data is only saved to your own Google Sheets
- No data is shared with third parties
- You can delete saved data at any time

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Verify all configuration steps are completed
4. Create an issue with detailed error information

## Changelog

### Version 1.0.0
- Initial release
- Automatic LinkedIn profile extraction
- Google Sheets integration
- OAuth authentication
- Modern UI with notifications 
