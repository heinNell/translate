# Afrikaans AI Translator

AI-powered Afrikaans to English translator with multiple AI providers, chat, email formatting, and content enhancement features.

![Translator Preview](https://img.shields.io/badge/Status-Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-2.0.0-purple)

## ✨ Features

- 🌍 **Translation**: Afrikaans to English with cultural context and grammar analysis
- 💬 **Chat Mode**: Full conversational AI with streaming responses
- ✉️ **Email Mode**: Professional email formatting and translation
- ✨ **Enhance Mode**: Text improvement and suggestions
- 🤖 **Agent Mode**: Knowledge assistant with comprehensive answers
- 📊 **Strategy Mode**: Business strategy analysis and refinement

## 🤖 Supported AI Providers

| Provider        | Free Tier | Local | Setup Required |
| --------------- | --------- | ----- | -------------- |
| OpenRouter      | ❌        | ❌    | API Key        |
| Anthropic       | ❌        | ❌    | API Key        |
| OpenAI          | ❌        | ❌    | API Key        |
| Google Gemini   | ✅        | ❌    | API Key        |
| DeepSeek        | ❌        | ❌    | API Key        |
| Grok (xAI)      | ❌        | ❌    | API Key        |
| Morph           | ❌        | ❌    | API Key        |
| **Groq**        | ✅        | ❌    | API Key (Free) |
| **Together AI** | ✅        | ❌    | API Key (Free) |
| **Ollama**      | ✅        | ✅    | Local Install  |

## 📁 Project Structure

```
translate/
├── index.html          # Main HTML file
├── styles.css          # Styles (7000+ lines)
├── app.js              # Main application
├── package.json        # NPM configuration
├── vite.config.js      # Vite build configuration
├── vercel.json         # Vercel deployment config
│
└── src/                # Modular source code
    ├── index.js        # Module entry point
    ├── config/         # Configuration
    │   ├── constants.js    # App constants & defaults
    │   └── signature.js    # Email signature config
    ├── utils/          # Utilities
    │   ├── storage.js      # LocalStorage wrapper
    │   └── helpers.js      # Helper functions
    ├── providers/      # AI Provider implementations
    │   ├── base-provider.js    # Abstract base class
    │   ├── openrouter.js, anthropic.js, openai.js, etc.
    │   └── index.js        # Provider registry
    ├── core/           # Core functionality
    │   └── api-client.js   # API client with retry/fallback
    ├── ui/             # UI components
    │   ├── toast.js, modal.js, theme.js, speech.js
    │   └── index.js
    └── features/       # Feature modules
        ├── prompts.js, translate.js, enhance.js, email.js
        └── index.js
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 18+ (for development)
- An API key from any supported provider

### Installation

1. **Clone or download this repository**

   ```bash
   git clone https://github.com/heinNell/translate.git
   cd translate
   ```

2. **Install dependencies (optional, for development)**

   ```bash
   npm install
   ```

3. **Serve the files locally**

   Using Vite (recommended):

   ```bash
   npm run dev
   ```

   Or using Python:

   ```bash
   python3 -m http.server 8080
   ```

   Using Node.js:

   ```bash
   npx serve .
   ```

   Or simply open `index.html` in your browser.

4. **Enter your API key**
   - On first launch, you'll be prompted to enter your API key
   - Select your preferred provider from the settings
   - Your keys are stored locally in your browser and never sent to our servers

## 📖 Usage

### Translation Mode

1. **Enter Text**: Type or paste Afrikaans text in the input area
2. **Or Use Voice**: Click the microphone icon to speak in Afrikaans
3. **Translate**: Click "Translate" or press `Ctrl/Cmd + Enter`
4. **Review**: View translation with formality, alternatives, and cultural notes

### Chat Mode

1. Switch to Chat tab
2. Have natural conversations with the AI
3. Supports streaming responses for real-time output

### Email Mode

1. Switch to Email tab
2. Enter or paste email content in Afrikaans
3. Get professionally formatted English translation

### Enhance Mode

1. Switch to Enhance tab
2. Paste any text for AI-powered improvement
3. Receive suggestions and enhanced version

## ⌨️ Keyboard Shortcuts

| Shortcut               | Action           |
| ---------------------- | ---------------- |
| `Ctrl/Cmd + Enter`     | Submit/Translate |
| `Ctrl/Cmd + K`         | Clear input      |
| `Ctrl/Cmd + Shift + C` | Copy output      |
| `Alt + 1-6`            | Switch modes     |

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Build Tool**: Vite 5.0
- **Styling**: Custom CSS with CSS Variables for theming
- **APIs**: 10 AI providers (see table above)
- **Storage**: localStorage for API keys, history, and settings
- **Speech**: Web Speech API for voice input/output
- **Deployment**: Vercel

## 📜 NPM Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run serve    # Alias for dev
``API keys are stored locally in your browser's localStorage
- No data is sent to any server other than your selected AI provider
- No cookies or tracking mechanisms are used
- All communication with APIs is encrypted (HTTPS)

## 🔧 Development

### Modular Architecture

The app uses a modular ES Module architecture:

- **Providers**: Each AI provider extends `BaseProvider` for consistent interface
- **Registry**: `ProviderRegistry` manages provider lifecycle and fallback chains
- **Features**: Business logic separated into feature modules
- **UI Components**: Reusable UI managers (Toast, Modal, Theme, Speech)

### Adding a New Provider

1. Create `src/providers/your-provider.js` extending `BaseProvider`
2. Implement required methods: `getEndpoint()`, `getHeaders()`, `formatRequest()`, `parseResponse()`
3. Register in `src/providers/index.js`
4. Add configuration to `src/config/constants.js`

## 🤝 Contributing

Contributions are welcome! Please:

- Report bugs via Issues
- Suggest features
- Submit pull requests
- Follow existing code style

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- All AI provider teams for their excellent APIs
- The Afrikaans language community for cultural insights
- [Inter Font](https://fonts.google.com/specimen/Inter) for typography

---

**Live Demo**: [https://afrikaans-translator.vercel.app](https://afrikaans-translator.vercel.app)

- [OpenRouter](https://openrouter.ai) for providing the AI translation API
- The Afrikaans language community for cultural insights
- [Inter Font](https://fonts.google.com/specimen/Inter) for typography
```
