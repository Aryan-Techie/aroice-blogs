#!/bin/bash
# Simple commit script for Aroice Blog Subscription System

echo "=== Aroice Blog Subscription System ==="
echo "Preparing to commit changes..."

# Delete unnecessary test files if they exist
rm -f advanced-test.html test-integration.html simple-test.html direct-submit.html script.js

echo "Removed unnecessary test files"

# Add all remaining files
git add .

# Commit with a timestamp
git commit -m "Update blog subscription system - $(date '+%Y-%m-%d %H:%M:%S')"

echo "Changes committed successfully"
echo "Run 'git push' to push changes to remote repository"
