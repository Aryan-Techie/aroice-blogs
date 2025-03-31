/**
 * Google Apps Script for handling form submissions
 * Deploy this script as a web app with "Anyone, even anonymous" access
 */

// Spreadsheet ID - replace with your Google Sheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Subscribers'; // Name of the sheet to write to

// Enable detailed logging for debugging
const DEBUG_MODE = true;

function doGet(e) {
  return handleResponse(e);
}

function doPost(e) {
  return handleResponse(e);
}

function handleResponse(e) {
  try {
    // Log all incoming data for debugging
    if (DEBUG_MODE) {
      Logger.log("Request data received:");
      Logger.log(JSON.stringify(e));
    }
    
    // Extract data from various possible sources
    let data = {};
    
    // Case 1: URL parameters (works for both GET and POST)
    if (e.parameter) {
      if (DEBUG_MODE) Logger.log("Found URL parameters");
      
      // If email is directly in parameters
      if (e.parameter.email) {
        data.email = e.parameter.email;
        data.source = e.parameter.source || 'Unknown';
        data.timestamp = e.parameter.timestamp || new Date().toISOString();
      }
    }
    
    // Case 2: JSON data in POST body
    if (!data.email && e.postData && e.postData.contents) {
      if (DEBUG_MODE) Logger.log("Found POST data: " + e.postData.contents);
      
      try {
        const jsonData = JSON.parse(e.postData.contents);
        if (jsonData.email) {
          data.email = jsonData.email;
          data.source = jsonData.source || 'Unknown';
          data.timestamp = jsonData.timestamp || new Date().toISOString();
        }
      } catch (jsonError) {
        if (DEBUG_MODE) Logger.log("Failed to parse JSON: " + jsonError);
      }
    }
    
    // Case 3: Form data (multipart/form-data or application/x-www-form-urlencoded)
    if (!data.email && e.postData && e.postData.type) {
      if (DEBUG_MODE) Logger.log("Found form data: " + e.postData.type);
      
      // Check if we can parse form data
      if (e.parameter && e.parameter.email) {
        data.email = e.parameter.email;
        data.source = e.parameter.source || 'Unknown';
        data.timestamp = e.parameter.timestamp || new Date().toISOString();
      }
    }
    
    // Check if we have required data
    if (!data.email) {
      return sendResponse(false, 'Email is required but was not found in the request');
    }
    
    // Log the data we're going to save
    if (DEBUG_MODE) {
      Logger.log("Saving data:");
      Logger.log(JSON.stringify(data));
    }
    
    // Store data in the spreadsheet
    const sheet = getOrCreateSheet();
    
    // Append the data
    sheet.appendRow([
      data.email, 
      data.source || 'Unknown',
      data.timestamp || new Date().toISOString(),
      new Date().toISOString() // Server timestamp
    ]);
    
    return sendResponse(true, 'Data saved successfully');
  } catch (error) {
    Logger.log('Error processing request: ' + error.message);
    Logger.log(error.stack);
    return sendResponse(false, 'Error processing request: ' + error.message);
  }
}

// Helper to get or create the sheet
function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Sheet doesn't exist, create it
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Email', 'Source', 'Client Timestamp', 'Server Timestamp']);
  }
  
  return sheet;
}

// Send standardized response
function sendResponse(success, message) {
  const output = JSON.stringify({
    success: success,
    message: message
  });
  
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}

// For debugging - access this function to view recent logs
function getLogs() {
  const logs = Logger.getLog();
  return ContentService.createTextOutput(logs)
    .setMimeType(ContentService.MimeType.TEXT);
}
