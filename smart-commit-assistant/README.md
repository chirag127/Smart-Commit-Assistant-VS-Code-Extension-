# Smart Commit Assistant

**Smart Commit Assistant** is a VS Code extension that auto-generates clear, concise, and context-aware Git commit messages using AI. It analyzes staged diffs and provides multiple commit message suggestions and natural language explanations to enhance developer productivity and maintain high-quality version history.

## Features

-   **AI-Powered Commit Messages**: Automatically generate high-quality commit messages based on your staged changes using Gemini 2.0 Flash Lite.
-   **Multiple Suggestions**: Get 1-3 different commit message options to choose from.
-   **Contextual Explanations**: Each suggestion includes a natural language explanation of what changed and why.
-   **Customizable Tone**: Choose from different tone presets: conventional, casual, detailed, or emoji-style.
-   **Seamless Integration**: Works directly within VS Code's Git workflow.
-   **One-Click Insert**: Insert your chosen commit message directly into the Git commit input box.

## Requirements

-   VS Code 1.99.0 or higher
-   Git installed and configured in your workspace
-   Node.js and npm (for the backend server)

## Installation

1. Install the extension from the VS Code Marketplace
2. Set up the backend server:
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Edit .env to add your Gemini API key
    npm start
    ```

## Usage

1. Stage your changes in Git as usual
2. Click the "Generate Commit Message" button in the Source Control view or use the command palette (Ctrl+Shift+P) and search for "Smart Commit: Generate Commit Message"
3. Review the generated suggestions in the Smart Commit Assistant panel
4. Click "Insert" to use a suggestion or "Copy" to copy it to the clipboard

## Extension Settings

This extension contributes the following settings:

-   `smartCommitAssistant.apiKey`: API Key for Gemini 2.0 Flash Lite
-   `smartCommitAssistant.apiEndpoint`: API Endpoint for the Smart Commit Assistant backend
-   `smartCommitAssistant.defaultTone`: Default tone for commit messages (conventional, casual, detailed, emoji-style)
-   `smartCommitAssistant.autoStageCommit`: Automatically stage and commit changes after selecting a commit message

## Backend Server

The extension requires a backend server to communicate with the Gemini API. The server is built with Node.js and Express.

### Setup

1. Navigate to the `backend` directory
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and add your Gemini API key
4. Start the server: `npm start`

The server will run on port 3000 by default.

## Release Notes

### 0.0.1

Initial release of Smart Commit Assistant with the following features:

-   Generate commit messages from staged changes
-   Multiple tone options
-   VS Code integration
-   Backend API with Gemini 2.0 Flash Lite

---

## License

MIT

## Author

Chirag Singhal
