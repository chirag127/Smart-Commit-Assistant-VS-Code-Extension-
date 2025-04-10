# Smart Commit Assistant Backend

This is the backend server for the Smart Commit Assistant VS Code extension. It provides an API for generating commit messages using the Gemini AI model.

## Features

- Express.js server with API endpoints for commit message generation
- Integration with Google's Gemini AI model
- Support for different commit message tones (conventional, casual, detailed, emoji-style)
- Git diff parsing and analysis

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
- **GET /health**
  - Returns a 200 OK response if the server is running

### Generate Commit Message
- **POST /generate-commit**
  - Request body:
    ```json
    {
      "diff": "git diff content",
      "tone": "conventional | casual | detailed | emoji-style",
      "apiKey": "optional_api_key_override"
    }
    ```
  - Response:
    ```json
    {
      "suggestions": [
        {
          "message": "feat(component): add user authentication flow",
          "explanation": "Added login and registration components with form validation."
        },
        ...
      ]
    }
    ```

## Gemini AI Integration

The backend uses Google's official Generative AI SDK to communicate with the Gemini API. It's currently configured to use the `gemini-pro` model, which provides high-quality commit message suggestions.

### Prompt Structure

The prompts sent to Gemini include:
1. Instructions based on the selected tone
2. The Git diff to analyze
3. A summary of the changes (files changed, additions, deletions)
4. Format instructions for the response

### Response Parsing

The backend parses the Gemini response to extract structured commit message suggestions, with fallback mechanisms in case the response format is unexpected.

## Error Handling

The server includes comprehensive error handling for:
- Missing API keys
- Invalid diffs
- API rate limiting
- Malformed responses

## Development

To run the server in development mode with auto-restart:
```bash
npm run dev
```
