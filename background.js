// Background service worker for LinkedIn Profile Saver
class ProfileSaver {
  constructor() {
    this.googleClientId = 'YOUR_GOOGLE_CLIENT_ID_HERE';
    this.googleScriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    this.isAuthenticated = false;
    this.accessToken = null;
  }

  // Initialize the service worker
  init() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'saveProfile') {
        this.handleProfileSave(request.data);
      } else if (request.action === 'authenticate') {
        this.authenticateWithGoogle();
      } else if (request.action === 'getAuthStatus') {
        sendResponse({ isAuthenticated: this.isAuthenticated });
      }
    });

    // Check authentication status on startup
    this.checkAuthStatus();
  }

  // Check if user is authenticated
  async checkAuthStatus() {
    try {
      const result = await chrome.identity.getAuthToken({ interactive: false });
      if (result.token) {
        this.accessToken = result.token;
        this.isAuthenticated = true;
        console.log('LinkedIn Profile Saver: Already authenticated');
      }
    } catch (error) {
      console.log('LinkedIn Profile Saver: Not authenticated');
      this.isAuthenticated = false;
    }
  }

  // Authenticate with Google
  async authenticateWithGoogle() {
    try {
      const result = await chrome.identity.getAuthToken({ 
        interactive: true,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      
      if (result.token) {
        this.accessToken = result.token;
        this.isAuthenticated = true;
        console.log('LinkedIn Profile Saver: Successfully authenticated');
        
        // Notify popup of successful authentication
        chrome.runtime.sendMessage({
          action: 'authSuccess',
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('LinkedIn Profile Saver: Authentication failed:', error);
      this.isAuthenticated = false;
      
      chrome.runtime.sendMessage({
        action: 'authError',
        error: error.message
      });
    }
  }

  // Handle profile save request
  async handleProfileSave(profileData) {
    if (!this.isAuthenticated) {
      console.log('LinkedIn Profile Saver: Not authenticated, attempting to authenticate...');
      await this.authenticateWithGoogle();
      
      if (!this.isAuthenticated) {
        console.error('LinkedIn Profile Saver: Authentication required to save profile');
        return;
      }
    }

    try {
      await this.saveToGoogleSheets(profileData);
      console.log('LinkedIn Profile Saver: Profile saved successfully');
      
      // Show notification
      this.showNotification('Profile Saved', `${profileData.name}'s profile has been saved to Google Sheets`);
      
    } catch (error) {
      console.error('LinkedIn Profile Saver: Error saving profile:', error);
      this.showNotification('Save Failed', 'Failed to save profile to Google Sheets');
    }
  }

  // Save profile data to Google Sheets via Apps Script
  async saveToGoogleSheets(profileData) {
    const response = await fetch(this.googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({
        action: 'saveProfile',
        data: profileData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Unknown error occurred');
    }

    return result;
  }

  // Show notification to user
  showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: title,
      message: message
    });
  }
}

// Initialize the profile saver
const profileSaver = new ProfileSaver();
profileSaver.init(); 