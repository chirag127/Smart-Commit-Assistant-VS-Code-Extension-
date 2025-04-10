import * as vscode from "vscode";
import { GitService } from "./gitService";
import { ApiService, ToneType } from "./apiService";
import { CommitMessageViewProvider } from "./webviewProvider";

export function activate(context: vscode.ExtensionContext) {
    console.log("Smart Commit Assistant is now active!");

    // Initialize services
    const gitService = new GitService();
    const apiService = new ApiService();

    // Register the webview provider
    const commitMessageViewProvider = new CommitMessageViewProvider(
        context.extensionUri,
        apiService,
        gitService
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            CommitMessageViewProvider.viewType,
            commitMessageViewProvider
        )
    );

    // Register the generate commit message command
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "smart-commit-assistant.generateCommitMessage",
            async () => {
                try {
                    // Check if Git is available
                    const isGitAvailable = await gitService.isGitAvailable();
                    if (!isGitAvailable) {
                        vscode.window.showErrorMessage(
                            "Git is not available in the current workspace"
                        );
                        return;
                    }

                    // Check if API is available
                    const isApiAvailable = await apiService.isApiAvailable();
                    if (!isApiAvailable) {
                        const result = await vscode.window.showErrorMessage(
                            "Smart Commit Assistant API is not available. Please make sure the backend server is running.",
                            "Open Settings"
                        );

                        if (result === "Open Settings") {
                            vscode.commands.executeCommand(
                                "workbench.action.openSettings",
                                "smartCommitAssistant.apiEndpoint"
                            );
                        }
                        return;
                    }

                    // Get the default tone from settings
                    const defaultTone =
                        (vscode.workspace
                            .getConfiguration("smartCommitAssistant")
                            .get("defaultTone") as ToneType) || "conventional";

                    // Show the commit message view
                    await vscode.commands.executeCommand(
                        "smart-commit-assistant.commitView.focus"
                    );

                    // Generate commit messages
                    await commitMessageViewProvider.generateCommitMessages(
                        defaultTone
                    );
                } catch (error) {
                    let errorMessage = "Failed to generate commit messages";

                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }

                    vscode.window.showErrorMessage(errorMessage);
                }
            }
        )
    );

    // Register the regenerate commit message command
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "smart-commit-assistant.regenerateCommitMessage",
            async () => {
                try {
                    // Get the default tone from settings
                    const defaultTone =
                        (vscode.workspace
                            .getConfiguration("smartCommitAssistant")
                            .get("defaultTone") as ToneType) || "conventional";

                    // Generate commit messages
                    await commitMessageViewProvider.generateCommitMessages(
                        defaultTone
                    );
                } catch (error) {
                    let errorMessage = "Failed to regenerate commit messages";

                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }

                    vscode.window.showErrorMessage(errorMessage);
                }
            }
        )
    );
}

export function deactivate() {}

