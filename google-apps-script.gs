/**
 * Google Apps Script for LinkedIn Profile Saver
 * This script handles saving LinkedIn profile data to Google Sheets
 */

// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID
const SHEET_NAME = 'LinkedIn Profiles';

/**
 * Main function to handle incoming requests from the Chrome extension
 */
function doPost(e) {
  try {
    // Parse the incoming request
    const request = JSON.parse(e.postData.contents);
    
    if (request.action === 'saveProfile') {
      return saveProfileToSheet(request.data);
    } else {
      return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse(false, 'Error processing request: ' + error.message);
  }
}

/**
 * Save profile data to Google Sheets
 */
function saveProfileToSheet(profileData) {
  try {
    // Get or create the spreadsheet
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = getOrCreateSheet(spreadsheet, SHEET_NAME);
    
    // Check if profile already exists (by URL)
    const existingRow = findExistingProfile(sheet, profileData.url);
    
    if (existingRow) {
      // Update existing profile
      updateExistingProfile(sheet, existingRow, profileData);
      return createResponse(true, 'Profile updated successfully');
    } else {
      // Add new profile
      addNewProfile(sheet, profileData);
      return createResponse(true, 'Profile saved successfully');
    }
    
  } catch (error) {
    console.error('Error saving profile:', error);
    return createResponse(false, 'Error saving profile: ' + error.message);
  }
}

/**
 * Get or create the main spreadsheet
 */
function getOrCreateSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (error) {
    // If spreadsheet doesn't exist, create a new one
    const newSpreadsheet = SpreadsheetApp.create('LinkedIn Profiles Database');
    
    // Set up the main sheet
    const sheet = newSpreadsheet.getActiveSheet();
    sheet.setName(SHEET_NAME);
    setupSheetHeaders(sheet);
    
    console.log('Created new spreadsheet with ID: ' + newSpreadsheet.getId());
    return newSpreadsheet;
  }
}

/**
 * Get or create the specified sheet
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    setupSheetHeaders(sheet);
  }
  
  return sheet;
}

/**
 * Set up the sheet headers
 */
function setupSheetHeaders(sheet) {
  const headers = [
    'Name',
    'Headline',
    'Location',
    'Current Company',
    'About',
    'Experience',
    'Education',
    'Skills',
    'Profile URL',
    'Extracted At',
    'Last Updated'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Find existing profile by URL
 */
function findExistingProfile(sheet, profileUrl) {
  const urlColumn = 9; // Column I (Profile URL)
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][urlColumn - 1] === profileUrl) {
      return i + 1; // Return row number (1-indexed)
    }
  }
  
  return null;
}

/**
 * Add new profile to sheet
 */
function addNewProfile(sheet, profileData) {
  const rowData = formatProfileData(profileData);
  const lastRow = sheet.getLastRow();
  
  sheet.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);
  
  // Format the new row
  const newRow = lastRow + 1;
  sheet.getRange(newRow, 1, 1, rowData.length).setBorder(true, true, true, true, true, true);
  
  console.log('Added new profile: ' + profileData.name);
}

/**
 * Update existing profile
 */
function updateExistingProfile(sheet, rowNumber, profileData) {
  const rowData = formatProfileData(profileData);
  
  sheet.getRange(rowNumber, 1, 1, rowData.length).setValues([rowData]);
  
  console.log('Updated existing profile: ' + profileData.name);
}

/**
 * Format profile data for sheet insertion
 */
function formatProfileData(profileData) {
  return [
    profileData.name || '',
    profileData.headline || '',
    profileData.location || '',
    profileData.company || '',
    profileData.about || '',
    formatExperience(profileData.experience),
    formatEducation(profileData.education),
    formatSkills(profileData.skills),
    profileData.url || '',
    profileData.extractedAt || '',
    new Date().toISOString()
  ];
}

/**
 * Format experience data
 */
function formatExperience(experience) {
  if (!experience || !Array.isArray(experience)) {
    return '';
  }
  
  return experience.map(exp => {
    return `${exp.title} at ${exp.company} (${exp.duration})`;
  }).join('; ');
}

/**
 * Format education data
 */
function formatEducation(education) {
  if (!education || !Array.isArray(education)) {
    return '';
  }
  
  return education.map(edu => {
    return `${edu.degree} from ${edu.school} (${edu.year})`;
  }).join('; ');
}

/**
 * Format skills data
 */
function formatSkills(skills) {
  if (!skills || !Array.isArray(skills)) {
    return '';
  }
  
  return skills.join(', ');
}

/**
 * Create response object
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify the script is working
 */
function testConnection() {
  return createResponse(true, 'Google Apps Script is working correctly');
}

/**
 * Manual function to create a new spreadsheet (for testing)
 */
function createNewSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create('LinkedIn Profiles Database - ' + new Date().toISOString());
  const sheet = spreadsheet.getActiveSheet();
  sheet.setName(SHEET_NAME);
  setupSheetHeaders(sheet);
  
  console.log('Created new spreadsheet: ' + spreadsheet.getUrl());
  return spreadsheet.getId();
} 