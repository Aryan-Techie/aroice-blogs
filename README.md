# 📧 Aroice Blog Subscription System

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> A modern, lightweight email collection system that seamlessly integrates with Google Sheets.

## ✨ Features

- 🔒 Secure handling of subscriber data
- 📊 Direct integration with Google Sheets
- 💾 Local storage backup for data resilience
- 🌐 Works both online and offline
- ✅ Built-in email validation
- 🎨 Clean, responsive design

## 🛠️ Implementation Details

The subscription form uses a hidden iframe technique to submit data to Google Sheets without redirecting the user or causing CORS issues. This approach:

1. Targets form submission to a hidden iframe instead of the main window
2. Provides a seamless user experience with success feedback 
3. Avoids common redirect issues with Google Script web apps

## 🚀 Quick Start

1. **Clone this repository**

2. **Setup configuration**
   - Copy `config.example.json` to `config.json`
   - Edit with your own values:
     ```json
     {
       "googleScriptUrl": "YOUR_GOOGLE_SCRIPT_URL_HERE",
       "sourceDomain": "YOUR_DOMAIN_HERE"
     }
     ```

3. **Set up Google Apps Script**
   - Create a Google Sheet to store subscriber data
   - Go to Extensions > Apps Script
   - Copy the code from `improved-google-script.js` into the Apps Script editor
   - Update the `SPREADSHEET_ID` in the script with your Sheet's ID
   - Deploy as a web app with "Anyone, even anonymous" access
   - Copy the Web App URL into your `config.json` file

4. **Deploy to your web server**
   - Upload all files to your hosting provider

## 📁 Project Structure

- **index.html** - Main subscription page with the form
- **proper-form.html** - Alternative form implementation
- **styles.css** - Styling for the website
- **config.json** - Configuration with Google Script URL
- **improved-google-script.js** - Code for Google Apps Script
- **SETUP-NOTES.md** - Detailed setup and maintenance guide


## 📬 Contact

- 📧 Email: [aryan@aroice.in]
- 💼 LinkedIn: [Aryan Jangra](https://linkedin.com/in/aryantechie)

- 📷 Instagam: [@aryantechie](https://instagram.com/aryantechie)
- 🐦 Twitter: [@aryantechie](https://twitter.com/aryantechie)


## 📝 License

This project is licensed under the [MIT License](LICENSE).

Created with ❤️ by [Aroice](https://aroice.in) - feel free to contact us!