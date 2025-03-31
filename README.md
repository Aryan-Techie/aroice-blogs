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

## 🚀 Quick Start

1. **Clone this repository**
   ```bash
   git clone https://github.com/YourUsername/blog-subscription-system.git
   ```

2. **Setup configuration**
   - Copy `config.example.json` to `config.json`
   - Edit with your own values:
     ```json
     {
       "googleScriptUrl": "YOUR_GOOGLE_SCRIPT_URL_HERE",
       "sourceDomain": "YOUR_DOMAIN_HERE"
     }
     ```
   - **IMPORTANT**: Never commit your `config.json` file as it contains sensitive information

3. **Deploy to your web server**
   - Upload all files to your hosting provider
   - Ensure `config.json` is properly configured

## 🔒 Security Best Practices

- The `config.json` file contains sensitive information and is excluded via `.gitignore`
- Never commit your actual `config.json` to any public repository
- Use environment variables in production environments when possible
- Regularly rotate your Google Script deployment URL for enhanced security

## ⚙️ How It Works

The subscription system follows a three-layer approach for data reliability:

1. **Immediate Storage**: Uses browser's localStorage as a failsafe backup
2. **Cloud Storage**: Sends data to Google Sheets via Apps Script for permanent storage
3. **Error Handling**: Graceful fallbacks if network connectivity is compromised

## 🧰 Technical Details

```
📁 Project Structure
├── 📄 index.html      # Main entry point with subscription form
├── 📄 script.js       # Core functionality
├── 📄 styles.css      # Design and layout styling
├── 📄 config.json     # Configuration settings (gitignored)
└── 📄 config.example.json  # Template for configuration
```

## 🛠️ Development

To modify or extend:

1. The main functionality is wrapped in the `setupFormSubmission()` function
2. Form validation occurs before submission
3. Google Sheets integration uses fetch API with no-CORS mode
4. All network requests include proper timeout handling

## 🔄 Google Sheets Integration

This project requires a Google Apps Script deployment that:
1. Accepts POST requests with email data
2. Writes the data to a specified Google Sheet
3. Has appropriate permissions set for public access

## 📝 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

This project may include or adapt code from other MIT-licensed sources. The MIT license allows for code reuse, modification, and distribution under the same terms.

If you use this code in your project, please include the appropriate attribution and license information.

## 👥 Contact

Created by [Aroice](https://aroice.in) - feel free to contact us!
