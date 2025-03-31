/**
 * Aroice Blog Subscription - Google Apps Script
 * 
 * This script handles form submissions from your blog subscription system
 * and saves them to a Google Spreadsheet.
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the entire code with this script
 * 4. Update the SPREADSHEET_ID with your Google Sheet ID (from the URL)
 * 5. Save and deploy as a web app:
 *    - Click "Deploy" > "New deployment"
 *    - Select type "Web app"
 *    - Set "Execute as" to "Me"
 *    - Set "Who has access" to "Anyone, even anonymous"
 *    - Deploy and copy the Web App URL
 * 6. Use the URL in your config.json file
 */

// ========= CONFIGURATION =========
// Spreadsheet ID - Get this from your Google Sheet URL
// Example: https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit
const SPREADSHEET_ID = '1R-Qu5o7nia0kecgsqvkI_QGFO6TjwpDWAT06OF3K_7o'; // Updated with your actual spreadsheet ID
const SHEET_NAME = 'Subscribers'; // Name of the sheet to save data to

// Enable detailed logging for debugging (set to false in production)
const DEBUG_MODE = true;

// CORS settings - domains that are allowed to send data
// Leave empty to accept requests from any origin
const ALLOWED_ORIGINS = [];

// ========= MAIN FUNCTIONS =========

/**
 * Handles GET requests (including URL parameters)
 */
function doGet(e) {
  logInfo('Received GET request');
  // Fix: Check if e exists before trying to access e.parameter
  if (!e) e = {};
  logDebug('GET parameters:', e.parameter || {});
  return handleRequest(e);
}

/**
 * Handles POST requests (JSON, form data, etc.)
 */
function doPost(e) {
  logInfo('Received POST request');
  // Fix: Check if e exists before trying to access properties
  if (!e) e = {};
  logDebug('Content type:', e.postData ? e.postData.type : 'none');
  return handleRequest(e);
}

/**
 * Main request handler for both GET and POST
 */
function handleRequest(e) {
  try {
    // Fix: Ensure e is an object
    e = e || {};
    
    // Log the entire request for debugging
    logInfo('Handling request');
    logDebug('Full request object:', JSON.stringify(e));
    
    // Check for special testing requests first
    const specialResponse = processSpecialRequests(e);
    if (specialResponse) return specialResponse;
    
    // Extract data from request
    const data = extractData(e);
    logInfo('Extracted data: ' + JSON.stringify(data));
    
    // Verify required data
    if (!data.email) {
      return sendResponse(false, 'Email address is required');
    }
    
    // Validate email format
    if (!isValidEmail(data.email)) {
      return sendResponse(false, 'Invalid email format');
    }
    
    // Check if this is a test request
    const isTest = data.test === 'true' || data.test === true;
    if (isTest) {
      logInfo('Processing test request');
    }
    
    // Store the data in spreadsheet
    const sheet = getOrCreateSheet();
    
    // Check if email already exists (to prevent duplicates)
    const existingRow = findEmailInSheet(sheet, data.email);
    if (existingRow > 0) {
      logInfo(`Email ${data.email} already exists in row ${existingRow}`);
      return sendResponse(true, 'Email already subscribed');
    }
    
    // Add new row with all data
    sheet.appendRow([
      data.email, 
      data.source || 'Unknown',
      data.timestamp || new Date().toISOString(),
      new Date().toISOString(), // Server timestamp
      isTest ? 'Test' : 'Live'  // Indicates if this was a test submission
    ]);
    
    logInfo(`Successfully added email: ${data.email} from source: ${data.source || 'Unknown'}`);
    return sendResponse(true, 'Subscription successfully added');
    
  } catch (error) {
    logError('Error processing request', error);
    return sendResponse(false, 'Error: ' + error.message);
  }
}

// ========= HELPER FUNCTIONS =========

/**
 * Extract data from various possible sources in the request
 * Modified to be more aggressive in finding the email parameter
 */
function extractData(e) {
  const data = {};
  
  // Fix: Add null checks to avoid errors
  e = e || {};
  e.parameter = e.parameter || {};
  
  // Case 1: URL parameters (works for both GET and POST)
  if (e.parameter) {
    logDebug('Found parameters:', e.parameter);
    
    // Look for email in parameters
    if (e.parameter.email) {
      data.email = e.parameter.email;
      data.source = e.parameter.source || 'URL Parameter';
      data.timestamp = e.parameter.timestamp;
      data.test = e.parameter.test;
      logInfo('Found email in parameters: ' + data.email);
    }
  }
  
  // Case 2: JSON data in POST body
  if (!data.email && e.postData && e.postData.contents) {
    try {
      const jsonData = JSON.parse(e.postData.contents);
      if (jsonData.email) {
        data.email = jsonData.email;
        data.source = jsonData.source || 'JSON POST';
        data.timestamp = jsonData.timestamp;
        data.test = jsonData.test;
      }
    } catch (jsonError) {
      logDebug('Failed to parse JSON', jsonError.message);
    }
  }
  
  // Case 3: Form data
  if (!data.email && e.postData && e.postData.type && 
      (e.postData.type.includes('form-data') || e.postData.type.includes('x-www-form-urlencoded'))) {
    if (e.parameter && e.parameter.email) {
      data.email = e.parameter.email;
      data.source = e.parameter.source || 'Form Data';
      data.timestamp = e.parameter.timestamp;
      data.test = e.parameter.test;
    }
  }
  
  // Final check - if we have an email in parameter but didn't catch it above
  if (!data.email && e.parameter && typeof e.parameter === 'object') {
    // Sometimes the parameter might be there but not detected in the standard way
    const keys = Object.keys(e.parameter);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].toLowerCase();
      if (key === 'email') {
        data.email = e.parameter[keys[i]];
        data.source = data.source || 'Parameter Scan';
        logInfo('Found email via parameter scan: ' + data.email);
        break;
      }
    }
  }
  
  // Add timestamp if not provided
  if (!data.timestamp) {
    data.timestamp = new Date().toISOString();
  }
  
  logDebug('Final extracted data:', data);
  return data;
}

/**
 * Finds an email in the sheet and returns its row number
 * Returns 0 if not found
 */
function findEmailInSheet(sheet, email) {
  // Get all data from the sheet
  const data = sheet.getDataRange().getValues();
  
  // Skip the header row and search for the email
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toLowerCase() === email.toLowerCase()) {
      return i + 1; // +1 because array is 0-indexed, but rows start at 1
    }
  }
  
  return 0; // Not found
}

/**
 * Get or create the subscribers sheet
 */
function getOrCreateSheet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // Sheet doesn't exist, create it with headers
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Email Address', 
        'Source', 
        'Client Timestamp', 
        'Server Timestamp',
        'Submission Type'
      ]);
      
      // Format the header row
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      
      logInfo('Created new sheet: ' + SHEET_NAME);
    }
    
    return sheet;
  } catch (error) {
    logError('Error accessing spreadsheet', error);
    throw new Error('Cannot access spreadsheet. Check your Spreadsheet ID and permissions.');
  }
}

/**
 * Send standardized JSON response
 */
function sendResponse(success, message, data) {
  const responseData = {
    success: success,
    message: message
  };
  
  // Add any additional data if provided
  if (data) {
    responseData.data = data;
  }
  
  // Completely rewritten safe implementation that won't throw errors
  try {
    // Return as plain JSON text - this is the most reliable approach
    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Last-resort fallback - plain text response
    Logger.log('[ERROR] Error creating response: ' + error.message);
    return ContentService.createTextOutput("Error occurred, but data was likely saved. Please check spreadsheet.");
  }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========= LOGGING FUNCTIONS =========

/**
 * Log info level message
 */
function logInfo(message) {
  Logger.log('[INFO] ' + message);
}

/**
 * Log debug message if debug mode is enabled
 */
function logDebug(message, data) {
  if (DEBUG_MODE) {
    if (data) {
      Logger.log('[DEBUG] ' + message + ' ' + JSON.stringify(data));
    } else {
      Logger.log('[DEBUG] ' + message);
    }
  }
}

/**
 * Log error with details
 */
function logError(message, error) {
  Logger.log('[ERROR] ' + message + ': ' + error.message);
  if (error.stack) {
    Logger.log('[ERROR] Stack trace: ' + error.stack);
  }
}

// ========= UTILITY FUNCTIONS =========

/**
 * Test function to verify spreadsheet connection
 * Access this via the URL: your-script-url?test=true
 */
function testSpreadsheetConnection() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet();
    
    return sendResponse(true, 'Spreadsheet connection successful', {
      spreadsheetName: ss.getName(),
      sheetName: sheet.getName(),
      url: ss.getUrl()
    });
  } catch (error) {
    return sendResponse(false, 'Spreadsheet connection failed: ' + error.message);
  }
}

/**
 * Function to view recent logs - useful for debugging
 * Access this via the URL: your-script-url?logs=true
 */
function getLogs() {
  return ContentService.createTextOutput(Logger.getLog())
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Determine what to do based on special parameters
 */
function processSpecialRequests(e) {
  if (e.parameter) {
    // Test parameter to check spreadsheet connection
    if (e.parameter.test === 'true' || e.parameter.test === 'connection') {
      return testSpreadsheetConnection();
    }
    
    // Direct test that returns visible response
    if (e.parameter.directTest === 'true') {
      return directTest(e);
    }
    
    // Logs parameter to view recent logs
    if (e.parameter.logs === 'true') {
      return getLogs();
    }
  }
  
  return null; // No special request
}

/**
 * Direct test function that returns clear response without no-cors limitations
 */
function directTest(e) {
  try {
    // Try to access the spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    
    // Add test data if email is provided
    let testResult = "Connection successful! ";
    if (e.parameter.email) {
      const testRow = [
        e.parameter.email,
        'Direct Test',
        new Date().toISOString(),
        new Date().toISOString(),
        'DirectTest'
      ];
      sheet.appendRow(testRow);
      testResult += "Test data added to sheet.";
    } else {
      testResult += "No email provided for test data.";
    }
    
    // Return a response that can be read directly in browser
    return HtmlService.createHtmlOutput(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
            .success { color: green; padding: 10px; background: #e7f3e7; border-left: 4px solid green; }
            .data { background: #f5f5f5; padding: 10px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>Google Sheets Connection Test</h1>
          <div class="success">${testResult}</div>
          <div class="data">
            <h3>Spreadsheet Details:</h3>
            <p><strong>Spreadsheet ID:</strong> ${SPREADSHEET_ID}</p>
            <p><strong>Spreadsheet Name:</strong> ${ss.getName()}</p>
            <p><strong>Sheet Name:</strong> ${sheet.getName()}</p>
            <p><strong>Current Row Count:</strong> ${sheet.getLastRow()}</p>
          </div>
          <p>If you can see this message, your Apps Script is working correctly.</p>
          <p>Check your Google Sheet to confirm the test data was added.</p>
          <p><a href="javascript:window.close()">Close this window</a></p>
        </body>
      </html>
    `);
  } catch (error) {
    return HtmlService.createHtmlOutput(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
            .error { color: red; padding: 10px; background: #f8e6e6; border-left: 4px solid red; }
          </style>
        </head>
        <body>
          <h1>Google Sheets Connection Error</h1>
          <div class="error">
            <p>Error: ${error.message}</p>
            <p>This is likely due to an incorrect Spreadsheet ID or permissions issue.</p>
          </div>
          <div>
            <h3>Troubleshooting:</h3>
            <ul>
              <li>Check that the SPREADSHEET_ID constant (${SPREADSHEET_ID}) matches your Google Sheet ID</li>
              <li>Make sure the script has permission to access the spreadsheet</li>
              <li>Verify that the sheet name "${SHEET_NAME}" exists or can be created</li>
            </ul>
          </div>
        </body>
      </html>
    `);
  }
}
