import * as vscode from 'vscode';
import * as path from 'path';
import { ApiService, CommitSuggestion, ToneType } from './apiService';
import { GitService } from './gitService';

export class CommitMessageViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'smart-commit-assistant.commitView';
    private _view?: vscode.WebviewView;
    private _suggestions: CommitSuggestion[] = [];
    private _currentTone: ToneType;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _apiService: ApiService,
        private readonly _gitService: GitService
    ) {
        this._currentTone = vscode.workspace.getConfiguration('smartCommitAssistant').get('defaultTone') as ToneType || 'conventional';
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'media')
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'generate':
                    await this.generateCommitMessages(message.tone);
                    break;
                case 'insert':
                    this.insertCommitMessage(message.index);
                    break;
                case 'copy':
                    this.copyCommitMessage(message.index);
                    break;
                case 'changeTone':
                    this._currentTone = message.tone;
                    await this.generateCommitMessages(message.tone);
                    break;
            }
        });
    }

    /**
     * Generate commit message suggestions
     * @param tone The tone for the commit message
     */
    public async generateCommitMessages(tone?: ToneType): Promise<void> {
        if (!this._view) {
            return;
        }

        const useTone = tone || this._currentTone;

        try {
            // Show loading state
            this._view.webview.postMessage({ type: 'loading', loading: true });

            // Get the staged diff
            const diff = await this._gitService.getStagedDiff();

            // Generate commit messages
            this._suggestions = await this._apiService.generateCommitMessages(diff, useTone);

            // Update the webview with the suggestions
            this._view.webview.postMessage({
                type: 'suggestions',
                suggestions: this._suggestions,
                tone: useTone
            });
        } catch (error) {
            let errorMessage = 'Failed to generate commit messages';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Show error in webview
            this._view.webview.postMessage({
                type: 'error',
                message: errorMessage
            });

            vscode.window.showErrorMessage(errorMessage);
        } finally {
            // Hide loading state
            this._view.webview.postMessage({ type: 'loading', loading: false });
        }
    }

    /**
     * Insert a commit message into the SCM input box
     * @param index The index of the commit message to insert
     */
    private insertCommitMessage(index: number): void {
        if (index >= 0 && index < this._suggestions.length) {
            const message = this._suggestions[index].message;
            this._gitService.setCommitMessage(message);
            vscode.window.showInformationMessage('Commit message inserted');
            
            // Check if auto-commit is enabled
            const autoStageCommit = vscode.workspace.getConfiguration('smartCommitAssistant').get('autoStageCommit') as boolean;
            if (autoStageCommit) {
                // TODO: Implement auto-commit functionality
            }
        }
    }

    /**
     * Copy a commit message to the clipboard
     * @param index The index of the commit message to copy
     */
    private copyCommitMessage(index: number): void {
        if (index >= 0 && index < this._suggestions.length) {
            const message = this._suggestions[index].message;
            vscode.env.clipboard.writeText(message);
            vscode.window.showInformationMessage('Commit message copied to clipboard');
        }
    }

    /**
     * Get the HTML for the webview
     * @param webview The webview to get the HTML for
     * @returns The HTML for the webview
     */
    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Get the local path to main script and CSS
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
        );
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
        );

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <link href="${styleUri}" rel="stylesheet">
            <title>Smart Commit Assistant</title>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Smart Commit Assistant</h2>
                    <div class="tone-selector">
                        <label for="tone">Tone:</label>
                        <select id="tone">
                            <option value="conventional">Conventional</option>
                            <option value="casual">Casual</option>
                            <option value="detailed">Detailed</option>
                            <option value="emoji-style">Emoji Style</option>
                        </select>
                    </div>
                    <button id="generate-btn" class="primary-btn">Generate Commit Messages</button>
                </div>
                
                <div id="loading" class="loading hidden">
                    <div class="spinner"></div>
                    <p>Generating commit messages...</p>
                </div>
                
                <div id="error-container" class="error-container hidden">
                    <p id="error-message"></p>
                </div>
                
                <div id="suggestions-container" class="suggestions-container hidden">
                    <div id="suggestions-list" class="suggestions-list"></div>
                </div>
                
                <div class="footer">
                    <p>Powered by Gemini 2.0 Flash Lite</p>
                </div>
            </div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
