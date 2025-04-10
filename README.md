# Smart Commit Assistant VS Code Extension

**Smart Commit Assistant** is a VS Code extension that auto-generates clear, concise, and context-aware Git commit messages using AI. It analyzes staged diffs and provides multiple commit message suggestions and natural language explanations to enhance developer productivity and maintain high-quality version history.

## Project Structure

This repository contains both the VS Code extension and the backend server:

-   `smart-commit-assistant/`: VS Code extension code
-   `backend/`: Node.js backend server for AI integration

## Features

-   **AI-Powered Commit Messages**: Automatically generate high-quality commit messages based on your staged changes using Gemini 2.0 Flash Lite.
-   **Multiple Suggestions**: Get 1-3 different commit message options to choose from.
-   **Contextual Explanations**: Each suggestion includes a natural language explanation of what changed and why.
-   **Customizable Tone**: Choose from different tone presets: conventional, casual, detailed, or emoji-style.
-   **Seamless Integration**: Works directly within VS Code's Git workflow.

## Getting Started

### Extension Setup

1. Navigate to the extension directory:

    ```bash
    cd smart-commit-assistant
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Build the extension:

    ```bash
    npm run compile
    ```

4. Open the extension in VS Code:

    ```bash
    code .
    ```

5. Press F5 to start debugging the extension.

### Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file based on `.env.example` and add your Gemini API key:

    ```bash
    cp .env.example .env
    # Edit .env to add your Gemini API key
    ```

4. Start the server:
    ```bash
    npm start
    ```

## Usage

1. Stage your changes in Git as usual
2. Click the "Generate Commit Message" button in the Source Control view or use the command palette (Ctrl+Shift+P) and search for "Smart Commit: Generate Commit Message"
3. Review the generated suggestions in the Smart Commit Assistant panel
4. Click "Insert" to use a suggestion or "Copy" to copy it to the clipboard

## License

MIT

## Author

Chirag Singhal
