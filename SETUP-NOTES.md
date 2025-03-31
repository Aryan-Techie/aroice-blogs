# Aroice Blog Subscription System - Setup Guide

## Core Files

- **index.html** - Main website with subscription form 
- **proper-form.html** - Alternative form implementation that also works well
- **styles.css** - Styling for the website
- **config.json** - Configuration file with Google Script URL
- **improved-google-script.js** - Code to paste into Google Apps Script

## Google Sheet Integration Setup

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com) and create a new sheet
   - Copy the spreadsheet ID from the URL (the long string between /d/ and /edit)

2. **Set Up Google Apps Script**
   - In your Google Sheet, go to Extensions > Apps Script
   - Replace the entire code with the contents of improved-google-script.js
   - Update the SPREADSHEET_ID at the top with your sheet's ID
   - Save the script

3. **Deploy the Script**
   - Click Deploy > New Deployment
   - Select "Web app" as the type
   - Set "Execute as" to "Me" 
   - Set "Who has access" to "Anyone, even anonymous"
   - Click Deploy and copy the Web App URL

4. **Update Configuration**
   - Edit config.json and paste the Web App URL as the googleScriptUrl value
   - Update sourceDomain if needed

## Troubleshooting

If the form stops working:

1. Verify your Google Sheet is still accessible
2. Check if you need a new deployment (URLs expire occasionally)
3. Look at the Google Apps Script execution logs for errors

To create a new deployment:
- Go to your Apps Script project
- Deploy > New Deployment
- Follow the same steps as initial setup and update config.json with new URL
