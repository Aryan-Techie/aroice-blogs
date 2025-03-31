/**
 * Aroice Blog Subscription System
 * https://blogs.aroice.in
 * 
 * MIT License
 * Copyright (c) 2025 Aroice
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Handle email form submission
    const emailForm = document.getElementById('email-form');
    const formMessage = document.querySelector('.form-message');
    
    // Load configuration
    fetch('./config.json')
        .then(response => response.json())
        .then(config => {
            // Set up form submission with loaded configuration
            setupFormSubmission(emailForm, formMessage, config);
        })
        .catch(error => {
            console.error('Failed to load configuration:', error);
            formMessage.innerText = "Service configuration error. Please try again later.";
            formMessage.className = "form-message error";
        });

    function setupFormSubmission(emailForm, formMessage, config) {
        emailForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // Validate email format
            if (!validateEmail(email)) {
                formMessage.innerText = "Please enter a valid email address.";
                formMessage.className = "form-message error";
                return;
            }
            
            // Show submitting message
            formMessage.innerText = "Submitting...";
            formMessage.className = "form-message";
            
            // Store in localStorage as backup
            const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
            subscribers.push({
                email: email,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            
            // Network connectivity check
            if (!navigator.onLine) {
                formMessage.innerText = "You appear to be offline. Please check your internet connection and try again.";
                formMessage.className = "form-message error";
                return;
            }

            // Google Sheets Integration with improved error handling
            fetch(config.googleScriptUrl, {
                method: 'POST',
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    source: config.sourceDomain,
                    timestamp: new Date().toISOString()
                }),
                signal: AbortSignal.timeout(10000) // 10 second timeout
            }).then(() => {
                console.log("Data sent to Google Sheet");
                
                // Show success message
                formMessage.innerText = "Thank you! We'll notify you when we launch.";
                formMessage.className = "form-message success";
                emailForm.reset();
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formMessage.innerText = "";
                    formMessage.className = "form-message";
                }, 5000);
                
            }).catch(error => {
                console.error("Google Sheet error:", error);
                
                if (error.name === 'AbortError') {
                    console.warn("Google Sheet request timed out");
                    formMessage.innerText = "Request timed out. However, your data was saved locally.";
                } else if (!navigator.onLine) {
                    formMessage.innerText = "Network connection lost. Please try again when you're online.";
                } else {
                    formMessage.innerText = "Something went wrong. Please try again.";
                }
                
                formMessage.className = "form-message error";
            });
        });
    }
    
    // Email validation helper function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});
