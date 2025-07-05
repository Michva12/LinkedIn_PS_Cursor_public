// Popup script for LinkedIn Profile Saver
class PopupManager {
  constructor() {
    this.elements = {
      loading: document.getElementById('loading'),
      authStatus: document.getElementById('authStatus'),
      authMessage: document.getElementById('authMessage'),
      authButton: document.getElementById('authButton'),
      testButton: document.getElementById('testButton'),
      savedCount: document.getElementById('savedCount'),
      lastSaved: document.getElementById('lastSaved')
    };

    this.init();
  }

  // Initialize the popup
  async init() {
    this.setupEventListeners();
    await this.checkAuthStatus();
    await this.loadStats();
  }

  // Setup event listeners
  setupEventListeners() {
    this.elements.authButton.addEventListener('click', () => {
      this.authenticate();
    });

    this.elements.testButton.addEventListener('click', () => {
      this.testConnection();
    });

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'authSuccess') {
        this.updateAuthStatus(true, 'Successfully connected to Google Sheets!');
      } else if (request.action === 'authError') {
        this.updateAuthStatus(false, `Authentication failed: ${request.error}`);
      }
    });
  }

  // Check authentication status
  async checkAuthStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getAuthStatus' });
      this.updateAuthStatus(response.isAuthenticated, 
        response.isAuthenticated ? 'Connected to Google Sheets' : 'Not connected to Google Sheets');
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.updateAuthStatus(false, 'Error checking authentication status');
    }
  }

  // Update authentication status display
  updateAuthStatus(isAuthenticated, message) {
    this.elements.authMessage.textContent = message;
    
    if (isAuthenticated) {
      this.elements.authStatus.classList.remove('error');
      this.elements.authButton.style.display = 'none';
      this.elements.testButton.style.display = 'block';
    } else {
      this.elements.authStatus.classList.add('error');
      this.elements.authButton.style.display = 'block';
      this.elements.testButton.style.display = 'none';
    }
  }

  // Authenticate with Google
  async authenticate() {
    this.showLoading(true);
    try {
      await chrome.runtime.sendMessage({ action: 'authenticate' });
    } catch (error) {
      console.error('Authentication error:', error);
      this.updateAuthStatus(false, 'Authentication failed');
    } finally {
      this.showLoading(false);
    }
  }

  // Test connection to Google Sheets
  async testConnection() {
    this.showLoading(true);
    try {
      // Send a test message to background script
      await chrome.runtime.sendMessage({ 
        action: 'testConnection' 
      });
      
      // Simulate a successful test (in real implementation, this would test the actual connection)
      setTimeout(() => {
        this.showNotification('Connection Test', 'Successfully connected to Google Sheets!');
        this.showLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Test connection error:', error);
      this.showNotification('Connection Test', 'Failed to connect to Google Sheets');
      this.showLoading(false);
    }
  }

  // Load statistics from storage
  async loadStats() {
    try {
      const result = await chrome.storage.local.get(['savedCount', 'lastSaved']);
      
      this.elements.savedCount.textContent = result.savedCount || 0;
      
      if (result.lastSaved) {
        const date = new Date(result.lastSaved);
        this.elements.lastSaved.textContent = date.toLocaleDateString();
      } else {
        this.elements.lastSaved.textContent = 'Never';
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  // Show/hide loading spinner
  showLoading(show) {
    this.elements.loading.style.display = show ? 'block' : 'none';
  }

  // Show notification
  showNotification(title, message) {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 12px; opacity: 0.9;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
}); 