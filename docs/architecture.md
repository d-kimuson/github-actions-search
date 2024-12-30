# Architecture Overview

This document describes the high-level architecture of the github-actions-search Chrome extension.

## Core Components

### Content Script

- Injects search and pin functionality into GitHub's Actions tab
- Monitors page navigation and DOM changes
- Manages workflow search and pin state
- Communicates with background script for data persistence

## Data Flow

1. User navigates to GitHub Actions tab
2. Content script:
   - Detects page load
   - Injects search controls
   - Fetches workflow files via GitHub Internal API
   - Renders search results
3. When user pins workflow:
   - Updates UI
   - Sends data to background script
   - Background script persists to storage

## Technical Implementation

### GitHub Integration

- Uses GitHub's Internal API to fetch workflow files
- Authenticates using user's active GitHub session
