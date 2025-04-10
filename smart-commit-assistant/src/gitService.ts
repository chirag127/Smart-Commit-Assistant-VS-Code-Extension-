import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitService {
    /**
     * Get the staged diff from Git
     * @returns Promise with the staged diff as a string
     */
    public async getStagedDiff(): Promise<string> {
        try {
            // Get the current workspace folder
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('No workspace folder found');
            }

            // Execute git diff --staged command
            const { stdout } = await execAsync('git diff --staged', {
                cwd: workspaceFolder.uri.fsPath
            });

            if (!stdout.trim()) {
                throw new Error('No staged changes found');
            }

            return stdout;
        } catch (error) {
            console.error('Error getting staged diff:', error);
            throw error;
        }
    }

    /**
     * Set the commit message in the SCM input box
     * @param message The commit message to set
     */
    public setCommitMessage(message: string): void {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        if (!gitExtension) {
            vscode.window.showErrorMessage('Git extension not found');
            return;
        }

        const git = gitExtension.getAPI(1);
        if (!git) {
            vscode.window.showErrorMessage('Git API not available');
            return;
        }

        // Get the current repository
        const repo = git.repositories[0];
        if (!repo) {
            vscode.window.showErrorMessage('No Git repository found');
            return;
        }

        // Set the commit message
        repo.inputBox.value = message;
    }

    /**
     * Check if Git is available in the current workspace
     * @returns Promise<boolean> True if Git is available
     */
    public async isGitAvailable(): Promise<boolean> {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                return false;
            }

            await execAsync('git --version', {
                cwd: workspaceFolder.uri.fsPath
            });

            return true;
        } catch (error) {
            return false;
        }
    }
}
