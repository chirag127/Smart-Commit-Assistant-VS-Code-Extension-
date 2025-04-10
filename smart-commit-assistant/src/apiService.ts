import * as vscode from "vscode";
import axios from "axios";

export interface CommitSuggestion {
    message: string;
    explanation: string;
}

export type ToneType = "conventional" | "casual" | "detailed" | "emoji-style";

export class ApiService {
    private getApiEndpoint(): string {
        return (
            (vscode.workspace
                .getConfiguration("smartCommitAssistant")
                .get("apiEndpoint") as string) ||
            "https://smart-commit-assistant-vs-code-extension.onrender.com"
        );
    }

    private getApiKey(): string {
        return (
            (vscode.workspace
                .getConfiguration("smartCommitAssistant")
                .get("apiKey") as string) || ""
        );
    }

    /**
     * Generate commit message suggestions based on the diff
     * @param diff The git diff to analyze
     * @param tone The tone for the commit message
     * @returns Promise with commit message suggestions
     */
    public async generateCommitMessages(
        diff: string,
        tone: ToneType
    ): Promise<CommitSuggestion[]> {
        try {
            const apiEndpoint = this.getApiEndpoint();
            const apiKey = this.getApiKey();

            const response = await axios.post(
                `${apiEndpoint}/generate-commit`,
                {
                    diff,
                    tone,
                    apiKey,
                }
            );

            if (response.status !== 200) {
                throw new Error(
                    `API request failed with status ${response.status}`
                );
            }

            return response.data.suggestions;
        } catch (error) {
            console.error("Error generating commit messages:", error);
            throw error;
        }
    }

    /**
     * Check if the API is available
     * @returns Promise<boolean> True if the API is available
     */
    public async isApiAvailable(): Promise<boolean> {
        try {
            const apiEndpoint = this.getApiEndpoint();
            const response = await axios.get(`${apiEndpoint}/health`);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}
