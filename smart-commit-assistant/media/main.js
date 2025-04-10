(function () {
    // Get VS Code API
    const vscode = acquireVsCodeApi();

    // DOM Elements
    const generateBtn = document.getElementById('generate-btn');
    const toneSelect = document.getElementById('tone');
    const loadingElement = document.getElementById('loading');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const suggestionsList = document.getElementById('suggestions-list');

    // Initialize with default tone from settings
    let currentTone = toneSelect.value;

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        vscode.postMessage({
            command: 'generate',
            tone: toneSelect.value
        });
    });

    toneSelect.addEventListener('change', () => {
        currentTone = toneSelect.value;
        vscode.postMessage({
            command: 'changeTone',
            tone: currentTone
        });
    });

    // Handle messages from the extension
    window.addEventListener('message', (event) => {
        const message = event.data;

        switch (message.type) {
            case 'loading':
                setLoading(message.loading);
                break;
            case 'error':
                showError(message.message);
                break;
            case 'suggestions':
                showSuggestions(message.suggestions, message.tone);
                break;
        }
    });

    // Functions
    function setLoading(isLoading) {
        if (isLoading) {
            loadingElement.classList.remove('hidden');
            suggestionsContainer.classList.add('hidden');
            errorContainer.classList.add('hidden');
        } else {
            loadingElement.classList.add('hidden');
        }
    }

    function showError(message) {
        errorContainer.classList.remove('hidden');
        errorMessage.textContent = message;
        suggestionsContainer.classList.add('hidden');
    }

    function showSuggestions(suggestions, tone) {
        // Update tone selector if needed
        if (tone && tone !== currentTone) {
            toneSelect.value = tone;
            currentTone = tone;
        }

        // Clear previous suggestions
        suggestionsList.innerHTML = '';

        // Show suggestions container
        suggestionsContainer.classList.remove('hidden');
        errorContainer.classList.add('hidden');

        // Add each suggestion
        suggestions.forEach((suggestion, index) => {
            const card = document.createElement('div');
            card.className = 'suggestion-card';

            const title = document.createElement('h3');
            title.textContent = `Suggestion ${index + 1}`;
            card.appendChild(title);

            const message = document.createElement('div');
            message.className = 'suggestion-message';
            message.textContent = suggestion.message;
            card.appendChild(message);

            const explanation = document.createElement('div');
            explanation.className = 'suggestion-explanation';
            explanation.textContent = suggestion.explanation;
            card.appendChild(explanation);

            const actions = document.createElement('div');
            actions.className = 'suggestion-actions';

            const insertBtn = document.createElement('button');
            insertBtn.textContent = 'Insert';
            insertBtn.addEventListener('click', () => {
                vscode.postMessage({
                    command: 'insert',
                    index: index
                });
            });
            actions.appendChild(insertBtn);

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy';
            copyBtn.className = 'secondary';
            copyBtn.addEventListener('click', () => {
                vscode.postMessage({
                    command: 'copy',
                    index: index
                });
            });
            actions.appendChild(copyBtn);

            card.appendChild(actions);
            suggestionsList.appendChild(card);
        });
    }
})();
