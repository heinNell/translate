# Afrikaans to English Translator

A web-based AI-powered translation app that converts Afrikaans text to English with cultural sensitivity and contextual awareness.

![Translator Preview](https://img.shields.io/badge/Status-Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### Core Translation

- **AI-Powered Translation** - Uses OpenRouter API with Claude 3.5 Sonnet for accurate, context-aware translations
- **Idiomatic Expressions** - Recognizes and properly translates Afrikaans idioms
- **Cultural Sensitivity** - Provides cultural context notes when relevant
- **Alternative Translations** - Offers multiple translation options with contextual explanations
- **Formality Detection** - Identifies formal vs. informal language usage

### User Interface

- **Clean, Modern Design** - Intuitive interface with smooth animations
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Automatically adapts to system preferences
- **Speech-to-Text** - Microphone input for spoken Afrikaans (where supported)
- **Text-to-Speech** - Listen to the English translation
- **Copy to Clipboard** - One-click copy functionality

### Feedback System

- **User Feedback** - Rate translations to help improve quality
- **Local Storage** - Feedback stored for potential future ML improvements

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An [OpenRouter API key](https://openrouter.ai) (free tier available)

### Installation

1. **Clone or download this repository**

   ```bash
   git clone https://github.com/heinNell/translate.git
   cd translate
   ```

2. **Serve the files locally**

   Using Python:

   ```bash
   python3 -m http.server 8080
   ```

   Using Node.js:

   ```bash
   npx serve .
   ```

   Or simply open `index.html` in your browser.

3. **Enter your API key**
   - On first launch, you'll be prompted to enter your OpenRouter API key
   - Your key is stored locally in your browser and never sent to our servers

## 📖 Usage

1. **Enter Text**: Type or paste Afrikaans text in the input area
2. **Or Use Voice**: Click the microphone icon to speak in Afrikaans
3. **Translate**: Click the "Translate" button or press `Ctrl/Cmd + Enter`
4. **Review Results**: View the translation along with:
   - Formality indicator (formal/informal/neutral)
   - Alternative translations
   - Cultural context notes
   - Idiom explanations
5. **Listen**: Click the speaker icon to hear the English translation
6. **Copy**: Click the copy icon to copy the translation
7. **Provide Feedback**: Rate the translation to help improve the system

## 🎨 Example Translations

| Afrikaans                | English                           | Notes                   |
| ------------------------ | --------------------------------- | ----------------------- |
| Hoe gaan dit met jou?    | How are you?                      | Informal greeting       |
| Ek is lief vir jou       | I love you                        | Expression of affection |
| Baie dankie vir jou hulp | Thank you very much for your help | Formal gratitude        |
| Dit gaan goed            | It's going well / I'm fine        | Common response         |

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with CSS Variables for theming
- **API**: OpenRouter API (Claude 3.5 Sonnet model)
- **Storage**: localStorage for API key and feedback
- **Speech**: Web Speech API for voice input/output

## 📁 Project Structure

```
translate/
├── index.html      # Main HTML file
├── styles.css      # Styles and responsive design
├── app.js          # Application logic and API integration
└── README.md       # Documentation
```

## 🔐 Privacy & Security

- Your OpenRouter API key is stored locally in your browser's localStorage
- No data is sent to any server other than OpenRouter's API
- Feedback data is stored locally for potential future improvements
- No cookies or tracking mechanisms are used

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for providing the AI translation API
- The Afrikaans language community for cultural insights
- [Inter Font](https://fonts.google.com/specimen/Inter) for typography
