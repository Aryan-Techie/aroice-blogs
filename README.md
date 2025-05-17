# 📧 Aroice Blog Subscription System

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> A modern, lightweight email collection system powered by Brevo (Sendinblue).

---

## ⏪ Previous Implementation (Google Sheets)

**Before Brevo, this project used Google Sheets and Google Apps Script for email collection:**

- The subscription form submitted emails via a Google Apps Script web app endpoint.
- Emails and names were appended directly to a Google Sheet for storage.
- Apps Script handled validation, duplicate checks, and basic error handling.
- Confirmation emails were sent using Gmail via Apps Script.
- This approach required maintaining a script, managing CORS, and handling quota limits.
- All logic was managed in `google-apps-script-template.js` and related files.

**Limitations:**
- Manual setup and deployment of Apps Script
- CORS and quota issues
- No built-in GDPR/compliance features
- More maintenance overhead

---

## ✨ Features (Current: Brevo)

- 🔒 Secure handling of subscriber data
- 📬 Direct integration with Brevo forms
- 💾 Local storage backup for data resilience
- 🌐 Works both online and offline
- ✅ Built-in email validation
- 🎨 Clean, responsive design

## 🛠️ Implementation Details

The subscription form now uses Brevo's embedded form for seamless email collection and management. This approach:

1. Embeds the Brevo form directly in the site
2. Provides a seamless user experience with success feedback
3. Avoids backend maintenance and CORS issues

---

## 🚀 Quick Start

1. **Clone this repository**
2. **Setup configuration**
   - Copy `config.example.json` to `config.json` (if needed for other settings)
   - Edit with your own values if required
3. **Set up Brevo Form**
   - Create a form in your Brevo (Sendinblue) dashboard
   - Copy the embed code (iframe) into your `index.html` (already done)
   - No backend or Google Sheets setup required
4. **Deploy to your web server**
   - Upload all files to your hosting provider

## 📁 Project Structure

- **index.html** - Main subscription page with the Brevo form
- **proper-form.html** - Alternative form implementation
- **styles.css** - Styling for the website
- **config.json** - Configuration (if needed)
- **SETUP-NOTES.md** - Setup and maintenance guide

## 📬 Contact

- 📧 Email: [aryan@aroice.in]
- 💼 LinkedIn: [Aryan Jangra](https://linkedin.com/in/aryantechie)
- 📷 Instagram: [@aryantechie](https://instagram.com/aryantechie)
- 🐦 Twitter: [@aryantechie](https://twitter.com/aryantechie)


Created with ❤️ by [Aroice](https://aroice.in) - feel free to contact us!