#!/usr/bin/env node

/**
 * Setup script for LinkedIn Profile Saver Chrome Extension
 * This script helps configure the extension with your Google credentials
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class ExtensionSetup {
  constructor() {
    this.config = {
      googleClientId: 'YOUR_GOOGLE_CLIENT_ID_HERE',
      googleScriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
      spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE'
    };
  }

  // Main setup function
  async run() {
    console.log('🔧 LinkedIn Profile Saver Extension Setup\n');
    console.log('This script will help you configure the extension with your Google credentials.\n');

    try {
      await this.collectConfiguration();
      await this.updateFiles();
      await this.createIcons();
      this.showNextSteps();
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  // Collect configuration from user
  async collectConfiguration() {
    console.log('📋 Configuration Steps:\n');

    this.config.googleClientId = await this.prompt('1. Enter your Google OAuth Client ID (or leave as YOUR_GOOGLE_CLIENT_ID_HERE): ');
    this.config.googleScriptUrl = await this.prompt('2. Enter your Google Apps Script Web App URL (or leave as YOUR_GOOGLE_APPS_SCRIPT_URL_HERE): ');
    this.config.spreadsheetId = await this.prompt('3. Enter your Google Sheet ID (or leave as YOUR_SPREADSHEET_ID_HERE): ');

    console.log('\n✅ Configuration collected successfully!\n');
  }

  // Update extension files with configuration
  async updateFiles() {
    console.log('📝 Updating extension files...\n');

    // Update manifest.json
    await this.updateManifest();
    console.log('✅ Updated manifest.json');

    // Update background.js
    await this.updateBackground();
    console.log('✅ Updated background.js');

    // Update Google Apps Script
    await this.updateGoogleScript();
    console.log('✅ Updated google-apps-script.gs');

    console.log('\n✅ All files updated successfully!\n');
  }

  // Update manifest.json
  async updateManifest() {
    const manifestPath = path.join(__dirname, 'manifest.json');
    let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    manifest.oauth2.client_id = this.config.googleClientId;

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  // Update background.js
  async updateBackground() {
    const backgroundPath = path.join(__dirname, 'background.js');
    let background = fs.readFileSync(backgroundPath, 'utf8');

    background = background.replace(
      /YOUR_GOOGLE_CLIENT_ID_HERE/g,
      this.config.googleClientId
    );
    background = background.replace(
      /YOUR_GOOGLE_APPS_SCRIPT_URL_HERE/g,
      this.config.googleScriptUrl
    );

    fs.writeFileSync(backgroundPath, background);
  }

  // Update Google Apps Script
  async updateGoogleScript() {
    const scriptPath = path.join(__dirname, 'google-apps-script.gs');
    let script = fs.readFileSync(scriptPath, 'utf8');

    if (this.config.spreadsheetId) {
      script = script.replace(
        /YOUR_SPREADSHEET_ID_HERE/g,
        this.config.spreadsheetId
      );
    }

    fs.writeFileSync(scriptPath, script);
  }

  // Create placeholder icons
  async createIcons() {
    console.log('🎨 Creating placeholder icons...\n');

    const iconsDir = path.join(__dirname, 'icons');
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir);
    }

    // Create a simple SVG icon and convert to PNG (placeholder)
    const svgIcon = this.createSVGIcon();
    
    // For now, just create placeholder files
    const iconSizes = [16, 48, 128];
    
    for (const size of iconSizes) {
      const iconPath = path.join(iconsDir, `icon${size}.png`);
      
      // Create a simple text file as placeholder
      fs.writeFileSync(iconPath, `Placeholder icon ${size}x${size} - Replace with actual PNG file`);
      console.log(`✅ Created placeholder icon${size}.png`);
    }

    console.log('\n⚠️  Note: Replace placeholder icons with actual PNG files before publishing\n');
  }

  // Create a simple SVG icon
  createSVGIcon() {
    return `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" fill="#0077b5"/>
      <text x="64" y="80" font-family="Arial, sans-serif" font-size="60" fill="white" text-anchor="middle">LI</text>
      <circle cx="100" cy="28" r="12" fill="#4CAF50"/>
      <path d="M94 22 L100 28 L106 22" stroke="white" stroke-width="2" fill="none"/>
    </svg>`;
  }

  // Show next steps
  showNextSteps() {
    console.log('🎉 Setup completed successfully!\n');
    console.log('📋 Next Steps:\n');
    console.log('1. Replace placeholder icons in the icons/ directory with actual PNG files');
    console.log('2. Load the extension in Chrome:');
    console.log('   - Open chrome://extensions/');
    console.log('   - Enable "Developer mode"');
    console.log('   - Click "Load unpacked"');
    console.log('   - Select this directory');
    console.log('3. Test the extension by visiting a LinkedIn profile page');
    console.log('4. Check your Google Sheet for saved profile data\n');
    
    console.log('🔗 Useful Links:');
    console.log('- Google Apps Script: https://script.google.com/');
    console.log('- Google Cloud Console: https://console.cloud.google.com/');
    console.log('- Chrome Extensions: chrome://extensions/\n');
    
    console.log('📖 For detailed instructions, see README.md');
  }

  // Prompt user for input
  prompt(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  const setup = new ExtensionSetup();
  setup.run().catch(console.error);
}

module.exports = ExtensionSetup; 