const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Generate commit message suggestions using Gemini 2.0 Flash Lite
 * @param {Object} parsedDiff Parsed diff information
 * @param {string} tone The tone for the commit message
 * @param {string} apiKey Optional API key for Gemini
 * @returns {Promise<Array<{ message: string, explanation: string }>>} Commit message suggestions
 */
async function generateCommitMessages(parsedDiff, tone, apiKey) {
    try {
        // If no API key is provided, check for environment variable
        const key = apiKey || process.env.GEMINI_API_KEY;

        if (!key) {
            throw new Error("No API key provided for Gemini");
        }

        // Initialize the Gemini API client
        const genAI = new GoogleGenerativeAI(key);

        // Get the model - using gemini-2.0-flash-lite for faster responses
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
        });

        // Create prompt based on the tone
        const prompt = createPrompt(parsedDiff, tone);

        // Set generation config
        const generationConfig = {
            temperature: 0.2,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
        };

        // Start a chat session
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        // Send the message and get the response
        const result = await chatSession.sendMessage(prompt);
        const responseText = result.response.text();

        // Parse the response to extract commit message suggestions
        return parseGeminiResponse(responseText);
    } catch (error) {
        console.error("Error generating commit messages:", error);

        // Provide more detailed error information
        if (error.message && error.message.includes("400 Bad Request")) {
            throw new Error(
                `API Error: ${error.message}. Please check your API key and model configuration.`
            );
        } else if (error.message && error.message.includes("429")) {
            throw new Error("Rate limit exceeded. Please try again later.");
        } else {
            throw error;
        }
    }
}

/**
 * Create a prompt for Gemini based on the diff and tone
 * @param {Object} parsedDiff Parsed diff information
 * @param {string} tone The tone for the commit message
 * @returns {string} The prompt for Gemini
 */
function createPrompt(parsedDiff, tone) {
    // Get tone-specific instructions
    const toneInstructions = getToneInstructions(tone);

    // Create a summary of the changes
    const changesSummary = createChangesSummary(parsedDiff);

    return `
You are a Git commit message generator. Analyze the following Git diff and generate 3 high-quality commit message suggestions.

${toneInstructions}

For each suggestion, provide:
1. A commit message (message)
2. A brief explanation of what changed and why (explanation)

Git diff:
\`\`\`
${parsedDiff.rawDiff}
\`\`\`

Changes summary:
${changesSummary}

Format your response as a JSON array with 3 objects, each containing 'message' and 'explanation' fields. Example:
[
  {
    "message": "feat(component): add user authentication flow",
    "explanation": "Added login and registration components with form validation."
  },
  {
    "message": "...",
    "explanation": "..."
  },
  {
    "message": "...",
    "explanation": "..."
  }
]
`;
}

/**
 * Get tone-specific instructions for the prompt
 * @param {string} tone The tone for the commit message
 * @returns {string} Tone-specific instructions
 */
function getToneInstructions(tone) {
    switch (tone) {
        case "conventional":
            return `
Use the Conventional Commits format: <type>(<scope>): <description>
Types: feat, fix, docs, style, refactor, test, chore
Keep the first line under 72 characters
Use imperative mood ("add" not "added" or "adds")
`;
        case "casual":
            return `
Use a casual, conversational tone
Keep it concise but friendly
Can use contractions and simpler language
Still be clear about what changed
`;
        case "detailed":
            return `
Provide a more detailed commit message
Include what changed and why
Can be longer than conventional format
Still use imperative mood
`;
        case "emoji-style":
            return `
Start the commit message with an appropriate emoji
Follow with a concise description
Examples:
✨ for new features
🐛 for bug fixes
📚 for documentation
🎨 for style/UI changes
♻️ for refactoring
✅ for tests
`;
        default:
            return `
Use the Conventional Commits format: <type>(<scope>): <description>
Types: feat, fix, docs, style, refactor, test, chore
Keep the first line under 72 characters
Use imperative mood ("add" not "added" or "adds")
`;
    }
}

/**
 * Create a summary of the changes from the parsed diff
 * @param {Object} parsedDiff Parsed diff information
 * @returns {string} A summary of the changes
 */
function createChangesSummary(parsedDiff) {
    let summary = "";

    if (parsedDiff.files && parsedDiff.files.length > 0) {
        summary += `Files changed (${parsedDiff.files.length}):\n`;
        parsedDiff.files.forEach((file) => {
            summary += `- ${file.path}: ${file.additions} additions, ${file.deletions} deletions\n`;
        });
    }

    return summary;
}

/**
 * Parse the Gemini API response to extract commit message suggestions
 * @param {string} responseText The text response from Gemini API
 * @returns {Array<{ message: string, explanation: string }>} Commit message suggestions
 */
function parseGeminiResponse(responseText) {
    try {
        // Try to parse the JSON response
        // Find JSON array in the response (it might be surrounded by other text)
        const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);

        if (jsonMatch) {
            const suggestions = JSON.parse(jsonMatch[0]);

            // Validate and format the suggestions
            return suggestions
                .map((suggestion) => ({
                    message: suggestion.message || "No message provided",
                    explanation:
                        suggestion.explanation || "No explanation provided",
                }))
                .slice(0, 3); // Ensure we only return up to 3 suggestions
        }

        // If JSON parsing fails, try to extract suggestions manually
        const fallbackSuggestions = extractFallbackSuggestions(responseText);
        if (fallbackSuggestions.length > 0) {
            return fallbackSuggestions;
        }

        // If all else fails, return a generic suggestion
        return [
            {
                message: "Update code based on recent changes",
                explanation:
                    "Failed to generate specific commit message. Please check the diff manually.",
            },
        ];
    } catch (error) {
        console.error("Error parsing Gemini response:", error);

        // Return a generic suggestion on error
        return [
            {
                message: "Update code based on recent changes",
                explanation:
                    "Failed to generate specific commit message. Please check the diff manually.",
            },
        ];
    }
}

/**
 * Extract suggestions manually if JSON parsing fails
 * @param {string} text The response text
 * @returns {Array<{ message: string, explanation: string }>} Extracted suggestions
 */
function extractFallbackSuggestions(text) {
    const suggestions = [];

    // Look for patterns like "1. message: ... explanation: ..."
    const suggestionRegex =
        /(\d+)\.\s*(?:message:|"message":)\s*"?([^"]+)"?\s*(?:explanation:|"explanation":)\s*"?([^"]+)"?/gi;

    let match;
    while (
        (match = suggestionRegex.exec(text)) !== null &&
        suggestions.length < 3
    ) {
        suggestions.push({
            message: match[2].trim(),
            explanation: match[3].trim(),
        });
    }

    return suggestions;
}

module.exports = {
    generateCommitMessages,
};
