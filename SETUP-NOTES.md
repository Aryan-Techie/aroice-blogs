# Aroice™ Blog Subscription System - Setup Guide

---

## ⏪ Previous Implementation (Google Sheets)

**How it worked before Brevo:**

- The subscription form submitted data to a Google Apps Script web app endpoint.
- Apps Script appended each submission to a Google Sheet.
- Confirmation emails were sent via Gmail using Apps Script.
- All logic was managed in `google-apps-script-template.js` and similar files.
- Required manual deployment and maintenance of Apps Script and Google Sheet.

**Why we switched:**
- CORS and quota issues
- No built-in compliance or analytics
- More maintenance overhead
- Brevo offers a more robust, secure, and user-friendly solution

---

## Core Files (Current: Brevo)

- **index.html** - Main website with Brevo subscription form
- **proper-form.html** - Alternative form implementation
- **styles.css** - Styling for the website
- **config.json** - Configuration file (if needed)

## Brevo Integration Setup

1. **Create a Brevo (Sendinblue) account**
   - Go to [Brevo](https://www.brevo.com/) and sign up
   - Create a new subscription form in your Brevo dashboard
   - Copy the embed code (iframe)

2. **Add the Brevo Form to Your Site**
   - Paste the iframe code into `index.html` where you want the form to appear
   - (Already done in this repo)

3. **Deploy to Your Web Server**
   - Upload all files to your hosting provider


## Troubleshooting

If the form stops working:
1. Verify your Brevo account and form are active
2. Check the embed code in your HTML is correct
3. Review Brevo's documentation for any changes or issues

To update the form:
- Edit your form in the Brevo dashboard
- Replace the iframe code in your HTML if needed
