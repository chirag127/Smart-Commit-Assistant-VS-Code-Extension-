Here's a full **Product Requirements Document (PRD)** for **Smart Commit Assistant**:

---

# 📄 Product Requirements Document (PRD)
## 🚀 Product Name: **Smart Commit Assistant**

---

## 🧠 Overview

**Smart Commit Assistant** is a VS Code extension that auto-generates clear, concise, and context-aware Git commit messages using AI. It analyzes staged diffs and provides multiple commit message suggestions and natural language explanations to enhance developer productivity and maintain high-quality version history.

---

## 🎯 Goals

- Add a button to the VS Code Git panel for generating commit messages.
- Use Gemini 2.0 Flash Lite to analyze staged diffs and generate commit messages.
- Increase developer productivity by automating commit message writing.
- Improve commit message quality using AI-generated summaries.
- Integrate naturally with Git and VS Code workflows.
- Allow users to customize tone and detail level of messages.


---

## 👥 Target Users

- Developers using Git inside VS Code.
- Teams wanting standardized and meaningful commit messages.
- Junior devs who want to learn how to write better commits.

---

## 🧩 Features & Requirements

### 1. 🔄 Git Integration
- Detect staged diffs (`git diff --staged`) on demand.
- Provide a quick-pick dropdown or button to trigger commit generation.

### 2. 🤖 AI Commit Generation (Gemini 2.0 Flash Lite)
- Send staged diffs to backend API.
- Generate 1–3 high-quality commit message suggestions.
- Include natural language explanation (what changed, why).
- Support tone presets: `conventional`, `casual`, `detailed`, `emoji-style`.

### 3. 🧑‍💻 VS Code Extension UI
- Add sidebar panel or floating popup with:
  - Generated commit messages.
  - "Insert", "Regenerate", and "Copy" buttons.
  - Optional diff view with explanation.
- Add command to Command Palette: `Smart Commit: Generate Commit Message`.

### 4. ⚙️ Settings & Config
- Settings menu for:
  - API Key setup (if needed).
  - Default tone.
  - Auto-stage + auto-commit toggle.
- Local storage for extension preferences.

---

## 🏗️ Technical Architecture

### Frontend (VS Code Extension)
- **Tech:** HTML, CSS, JavaScript (Manifest V3)
- **Browsers:** Chrome, Edge, Firefox (targeting WebView-compatible extensions)
- **Key Files:**
  - `extension/manifest.json`
  - `extension/panel.html`
  - `extension/panel.js`
  - `extension/main.js` (VS Code activation logic)

### Backend (AI Server)
- **Tech:** Node.js + Express
- **AI:** Gemini 2.0 Flash Lite via OpenRouter or direct API
- **Endpoints:**
  - `POST /generate-commit`: Accepts `diff`, `tone`, returns messages + explanations
  - `POST /health`: Healthcheck
- **Security:** API key auth (optional)

### Project Structure

```
project-root/
│
├── extension/
│   ├── manifest.json
│   ├── panel.html
│   ├── panel.js
│   ├── main.js
│   └── styles/
│
├── backend/
│   ├── server.js
│   ├── routes/commit.js
│   ├── services/geminiClient.js
│   └── utils/diffParser.js
```

---

## 🧪 User Flow

1. User stages changes in Git.
2. User triggers “Smart Commit: Generate” via command or sidebar.
3. Extension sends diff and tone to backend.
4. Backend returns suggestions + explanations.
5. User selects one and clicks "Insert".
6. Message gets inserted into VS Code Git input field.

---

## ✅ Success Metrics

- ⏱️ Reduced average time per commit message.
- 📈 Increased usage of AI-generated commits.
- 👍 Positive feedback from developers (via GitHub stars/reviews).
- 🔁 Extension activation count and daily active users (DAUs).

---

## ⏳ Milestones

| Phase | Description | ETA |
|-------|-------------|-----|
| ✅ Phase 1 | Setup project structure (frontend/backend) | Day 1 |
| ✅ Phase 2 | VS Code extension UI with mock data | Day 2 |
| 🔄 Phase 3 | Backend API with Gemini 2.0 Flash Lite integration | Day 3–4 |
| ⌛ Phase 4 | Full integration and testing | Day 5 |
| ⌛ Phase 5 | Publish to VS Code Marketplace | Day 6–7 |

---

## 🛠️ Future Enhancements

- Auto-detect diff granularity (line/function level).
- Inline suggestions inside Git diff view.
- Multi-repo support.
- Language-aware commit messages (i18n).
- GitHub Copilot or LLM comparison mode.
