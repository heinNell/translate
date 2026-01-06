/**
 * Afrikaans to English Translator
 * AI-powered translation using OpenRouter API
 */

class AfrikaansTranslator {
    constructor() {
        this.apiKey = localStorage.getItem('openrouter_api_key') || '';
        this.apiEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'anthropic/claude-3.5-sonnet';
        
        // DOM Elements
        this.inputText = document.getElementById('inputText');
        this.outputArea = document.getElementById('outputArea');
        this.translateBtn = document.getElementById('translateBtn');
        this.micBtn = document.getElementById('micBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.speakBtn = document.getElementById('speakBtn');
        this.charCount = document.getElementById('charCount');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.apiKeyModal = document.getElementById('apiKeyModal');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.saveApiKeyBtn = document.getElementById('saveApiKey');
        this.cancelApiKeyBtn = document.getElementById('cancelApiKey');
        this.recordingIndicator = document.getElementById('recordingIndicator');
        this.toastContainer = document.getElementById('toastContainer');
        
        // Details section elements
        this.detailsSection = document.getElementById('detailsSection');
        this.formalitySection = document.getElementById('formalitySection');
        this.formalityBadge = document.getElementById('formalityBadge');
        this.alternativesSection = document.getElementById('alternativesSection');
        this.alternativesList = document.getElementById('alternativesList');
        this.culturalSection = document.getElementById('culturalSection');
        this.culturalNote = document.getElementById('culturalNote');
        this.idiomSection = document.getElementById('idiomSection');
        this.idiomNote = document.getElementById('idiomNote');
        
        // Enhanced ML elements
        this.suggestionsSection = document.getElementById('suggestionsSection');
        this.suggestionsList = document.getElementById('suggestionsList');
        this.grammarSection = document.getElementById('grammarSection');
        this.grammarAnalysis = document.getElementById('grammarAnalysis');
        this.toneSection = document.getElementById('toneSection');
        this.toneBadges = document.getElementById('toneBadges');
        this.improvementsSection = document.getElementById('improvementsSection');
        this.improvementsList = document.getElementById('improvementsList');
        this.relatedSection = document.getElementById('relatedSection');
        this.relatedPhrases = document.getElementById('relatedPhrases');
        this.confidenceSection = document.getElementById('confidenceSection');
        this.confidenceFill = document.getElementById('confidenceFill');
        this.confidenceValue = document.getElementById('confidenceValue');
        
        // Content Intelligence elements
        this.insightsSection = document.getElementById('insightsSection');
        this.topicSection = document.getElementById('topicSection');
        this.topicBadges = document.getElementById('topicBadges');
        this.strategicSection = document.getElementById('strategicSection');
        this.strategicList = document.getElementById('strategicList');
        this.alternativeApproachesSection = document.getElementById('alternativeApproachesSection');
        this.approachesContainer = document.getElementById('approachesContainer');
        this.conceptsSection = document.getElementById('conceptsSection');
        this.conceptsGrid = document.getElementById('conceptsGrid');
        this.industryContextSection = document.getElementById('industryContextSection');
        this.industryContext = document.getElementById('industryContext');
        this.bestPracticesSection = document.getElementById('bestPracticesSection');
        this.bestPracticesList = document.getElementById('bestPracticesList');
        this.researchSection = document.getElementById('researchSection');
        this.researchTopics = document.getElementById('researchTopics');
        this.questionsSection = document.getElementById('questionsSection');
        this.questionsList = document.getElementById('questionsList');
        
        // Expanded Context elements
        this.expandedSection = document.getElementById('expandedSection');
        this.practicalExamplesSection = document.getElementById('practicalExamplesSection');
        this.examplesContainer = document.getElementById('examplesContainer');
        this.scenariosSection = document.getElementById('scenariosSection');
        this.scenariosContainer = document.getElementById('scenariosContainer');
        this.calculationsSection = document.getElementById('calculationsSection');
        this.calculationsContainer = document.getElementById('calculationsContainer');
        this.benchmarksSection = document.getElementById('benchmarksSection');
        this.benchmarksContainer = document.getElementById('benchmarksContainer');
        this.implementationSection = document.getElementById('implementationSection');
        this.implementationSteps = document.getElementById('implementationSteps');
        this.caseStudySection = document.getElementById('caseStudySection');
        this.caseStudiesContainer = document.getElementById('caseStudiesContainer');
        this.pitfallsSection = document.getElementById('pitfallsSection');
        this.pitfallsList = document.getElementById('pitfallsList');
        this.metricsSection = document.getElementById('metricsSection');
        this.metricsGrid = document.getElementById('metricsGrid');
        this.templatesSection = document.getElementById('templatesSection');
        this.templatesContainer = document.getElementById('templatesContainer');
        
        // Feedback elements
        this.feedbackSection = document.getElementById('feedbackSection');
        this.feedbackGood = document.getElementById('feedbackGood');
        this.feedbackBad = document.getElementById('feedbackBad');
        this.feedbackThanks = document.getElementById('feedbackThanks');
        
        // Mode toggle elements
        this.translateModeBtn = document.getElementById('translateMode');
        this.enhanceModeBtn = document.getElementById('enhanceMode');
        this.emailModeBtn = document.getElementById('emailMode');
        this.agentModeBtn = document.getElementById('agentMode');
        this.inputLabel = document.getElementById('inputLabel');
        this.outputLabel = document.getElementById('outputLabel');
        this.currentMode = 'translate';
        
        // Enhancement section elements
        this.enhancementSection = document.getElementById('enhancementSection');
        this.enhancedTextSection = document.getElementById('enhancedTextSection');
        this.enhancedText = document.getElementById('enhancedText');
        this.copyEnhancedBtn = document.getElementById('copyEnhancedBtn');
        this.structureSection = document.getElementById('structureSection');
        this.structureList = document.getElementById('structureList');
        this.additionsSection = document.getElementById('additionsSection');
        this.additionsList = document.getElementById('additionsList');
        this.ideasSection = document.getElementById('ideasSection');
        this.ideasList = document.getElementById('ideasList');
        this.versionsSection = document.getElementById('versionsSection');
        this.versionsList = document.getElementById('versionsList');
        this.toneEnhanceSection = document.getElementById('toneEnhanceSection');
        this.toneEnhanceList = document.getElementById('toneEnhanceList');
        this.claritySection = document.getElementById('claritySection');
        this.clarityFill = document.getElementById('clarityFill');
        this.clarityValue = document.getElementById('clarityValue');
        this.clarityNote = document.getElementById('clarityNote');
        
        // Email section elements
        this.emailSection = document.getElementById('emailSection');
        this.subjectSection = document.getElementById('subjectSection');
        this.emailSubject = document.getElementById('emailSubject');
        this.emailPreviewSection = document.getElementById('emailPreviewSection');
        this.emailPreview = document.getElementById('emailPreview');
        this.copyEmailBtn = document.getElementById('copyEmailBtn');
        this.greetingSection = document.getElementById('greetingSection');
        this.greetingOptions = document.getElementById('greetingOptions');
        this.closingSection = document.getElementById('closingSection');
        this.closingOptions = document.getElementById('closingOptions');
        this.emailToneSection = document.getElementById('emailToneSection');
        this.emailToneBadges = document.getElementById('emailToneBadges');
        this.emailVersionsSection = document.getElementById('emailVersionsSection');
        this.emailVersionsList = document.getElementById('emailVersionsList');
        
        // AI Agent section elements
        this.agentSection = document.getElementById('agentSection');
        this.answerSection = document.getElementById('answerSection');
        this.agentAnswer = document.getElementById('agentAnswer');
        this.keyInsightsSection = document.getElementById('keyInsightsSection');
        this.keyInsightsList = document.getElementById('keyInsightsList');
        this.expandedIdeasSection = document.getElementById('expandedIdeasSection');
        this.expandedIdeasList = document.getElementById('expandedIdeasList');
        this.actionItemsSection = document.getElementById('actionItemsSection');
        this.actionItemsList = document.getElementById('actionItemsList');
        this.relatedQuestionsSection = document.getElementById('relatedQuestionsSection');
        this.relatedQuestionsList = document.getElementById('relatedQuestionsList');
        this.resourcesSection = document.getElementById('resourcesSection');
        this.resourcesList = document.getElementById('resourcesList');
        this.copyAgentBtn = document.getElementById('copyAgentBtn');
        
        // Current enhancement/email/agent data
        this.currentEnhancement = null;
        this.currentEmail = null;
        this.currentAgentResponse = null;
        
        // Speech recognition
        this.recognition = null;
        this.isRecording = false;
        
        // Current translation data
        this.currentTranslation = null;
        
        // Translation history for ML learning
        this.translationHistory = JSON.parse(localStorage.getItem('translation_history') || '[]');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initSpeechRecognition();
        this.updateCharCount();
        
        // Check if API key exists
        if (!this.apiKey) {
            this.showModal();
        }
    }
    
    bindEvents() {
        // Mode toggle
        this.translateModeBtn.addEventListener('click', () => this.setMode('translate'));
        this.enhanceModeBtn.addEventListener('click', () => this.setMode('enhance'));
        this.emailModeBtn.addEventListener('click', () => this.setMode('email'));
        this.agentModeBtn.addEventListener('click', () => this.setMode('agent'));
        
        // Translation/Enhancement/Email
        this.translateBtn.addEventListener('click', () => this.handleAction());
        this.inputText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.handleAction();
            }
        });
        
        // Character count
        this.inputText.addEventListener('input', () => this.updateCharCount());
        
        // Action buttons
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.copyBtn.addEventListener('click', () => this.copyTranslation());
        this.speakBtn.addEventListener('click', () => this.speakTranslation());
        this.micBtn.addEventListener('click', () => this.toggleSpeechRecognition());
        
        // Copy enhanced text
        this.copyEnhancedBtn.addEventListener('click', () => this.copyEnhancedText());
        
        // Copy email
        this.copyEmailBtn.addEventListener('click', () => this.copyEmail());
        
        // Copy agent response
        this.copyAgentBtn.addEventListener('click', () => this.copyAgentResponse());
        
        // Settings
        this.settingsBtn.addEventListener('click', () => this.showModal());
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.cancelApiKeyBtn.addEventListener('click', () => this.hideModal());
        this.apiKeyModal.addEventListener('click', (e) => {
            if (e.target === this.apiKeyModal) {
                this.hideModal();
            }
        });
        
        // API key input enter
        this.apiKeyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });
        
        // Feedback
        this.feedbackGood.addEventListener('click', () => this.submitFeedback('good'));
        this.feedbackBad.addEventListener('click', () => this.submitFeedback('bad'));
        
        // Escape to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.apiKeyModal.classList.contains('visible')) {
                this.hideModal();
            }
        });
    }
    
    setMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        this.translateModeBtn.classList.toggle('active', mode === 'translate');
        this.enhanceModeBtn.classList.toggle('active', mode === 'enhance');
        this.emailModeBtn.classList.toggle('active', mode === 'email');
        this.agentModeBtn.classList.toggle('active', mode === 'agent');
        
        // Update labels and placeholders
        if (mode === 'translate') {
            this.inputLabel.textContent = 'Afrikaans';
            this.outputLabel.textContent = 'English';
            this.inputText.placeholder = "Enter Afrikaans text here...\n\nExamples:\n• Hoe gaan dit met jou?\n• Ek is lief vir jou\n• Baie dankie vir jou hulp";
            document.querySelector('.translate-btn .btn-text').textContent = 'Translate';
            this.outputArea.innerHTML = '<div class="placeholder-text">Translation will appear here...</div>';
            // Hide other sections
            this.enhancementSection.classList.remove('visible');
            this.emailSection.classList.remove('visible');
            this.agentSection.classList.remove('visible');
            this.hideEnhancement();
            this.hideEmail();
            this.hideAgent();
        } else if (mode === 'enhance') {
            this.inputLabel.textContent = 'Your Text';
            this.outputLabel.textContent = 'Enhanced';
            this.inputText.placeholder = "Enter text to enhance...\n\nPaste any text and get:\n• Improved sentence structure\n• Suggested additions\n• Ideas to enhance information\n• Alternative versions";
            document.querySelector('.translate-btn .btn-text').textContent = 'Enhance';
            this.outputArea.innerHTML = '<div class="placeholder-text">Enhanced text will appear here...</div>';
            // Hide other sections
            this.emailSection.classList.remove('visible');
            this.agentSection.classList.remove('visible');
            this.hideDetails();
            this.hideEmail();
            this.hideAgent();
        } else if (mode === 'email') {
            this.inputLabel.textContent = 'Afrikaans Email';
            this.outputLabel.textContent = 'English Email';
            this.inputText.placeholder = "Enter Afrikaans email text here...\n\nThe translator will:\n• Translate to English\n• Format for email\n• Suggest subject line\n• Provide greeting/closing options";
            document.querySelector('.translate-btn .btn-text').textContent = 'Translate Email';
            this.outputArea.innerHTML = '<div class="placeholder-text">Translated email will appear here...</div>';
            // Hide other sections
            this.enhancementSection.classList.remove('visible');
            this.agentSection.classList.remove('visible');
            this.hideDetails();
            this.hideEnhancement();
            this.hideAgent();
        } else if (mode === 'agent') {
            this.inputLabel.textContent = 'Your Question / Context';
            this.outputLabel.textContent = 'AI Analysis';
            this.inputText.placeholder = "Ask a question or provide context for AI analysis...\n\nExamples:\n• Help me with budget strategy ideas for 2026\n• Analyze this business plan and expand on it\n• What are the key considerations for fleet optimization?\n• Expand on these points: [paste your notes]";
            document.querySelector('.translate-btn .btn-text').textContent = 'Ask AI Agent';
            this.outputArea.innerHTML = '<div class="placeholder-text">AI analysis will appear here...</div>';
            // Hide other sections
            this.enhancementSection.classList.remove('visible');
            this.emailSection.classList.remove('visible');
            this.hideDetails();
            this.hideEnhancement();
            this.hideEmail();
        }
        
        // Clear current data
        this.currentTranslation = null;
        this.currentEnhancement = null;
        this.currentEmail = null;
        this.currentAgentResponse = null;
    }
    
    handleAction() {
        if (this.currentMode === 'translate') {
            this.translate();
        } else if (this.currentMode === 'enhance') {
            this.enhance();
        } else if (this.currentMode === 'email') {
            this.translateEmail();
        } else if (this.currentMode === 'agent') {
            this.askAgent();
        }
    }
    
    initSpeechRecognition() {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'af-ZA'; // Afrikaans
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            
            this.recognition.onstart = () => {
                this.isRecording = true;
                this.micBtn.classList.add('recording');
                this.recordingIndicator.classList.add('visible');
            };
            
            this.recognition.onend = () => {
                this.isRecording = false;
                this.micBtn.classList.remove('recording');
                this.recordingIndicator.classList.remove('visible');
            };
            
            this.recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                this.inputText.value = transcript;
                this.updateCharCount();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isRecording = false;
                this.micBtn.classList.remove('recording');
                this.recordingIndicator.classList.remove('visible');
                
                if (event.error === 'not-allowed') {
                    this.showToast('Microphone access denied. Please enable it in your browser settings.', 'error');
                } else {
                    this.showToast('Speech recognition error. Please try again.', 'error');
                }
            };
        } else {
            this.micBtn.style.display = 'none';
            console.log('Speech recognition not supported');
        }
    }
    
    toggleSpeechRecognition() {
        if (!this.recognition) {
            this.showToast('Speech recognition is not supported in your browser.', 'error');
            return;
        }
        
        if (this.isRecording) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    updateCharCount() {
        const count = this.inputText.value.length;
        this.charCount.textContent = count;
        
        if (count > 5000) {
            this.charCount.style.color = 'var(--error-color)';
        } else {
            this.charCount.style.color = '';
        }
    }
    
    clearInput() {
        this.inputText.value = '';
        this.updateCharCount();
        this.inputText.focus();
    }
    
    async copyTranslation() {
        if (!this.currentTranslation) {
            this.showToast('No translation to copy.', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(this.currentTranslation.translation);
            this.showToast('Translation copied to clipboard!', 'success');
        } catch (err) {
            this.showToast('Failed to copy. Please select and copy manually.', 'error');
        }
    }
    
    speakTranslation() {
        if (!this.currentTranslation) {
            this.showToast('No translation to speak.', 'error');
            return;
        }
        
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(this.currentTranslation.translation);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            
            window.speechSynthesis.speak(utterance);
        } else {
            this.showToast('Text-to-speech is not supported in your browser.', 'error');
        }
    }
    
    showModal() {
        this.apiKeyInput.value = this.apiKey;
        this.apiKeyModal.classList.add('visible');
        this.apiKeyInput.focus();
    }
    
    hideModal() {
        this.apiKeyModal.classList.remove('visible');
    }
    
    saveApiKey() {
        const key = this.apiKeyInput.value.trim();
        if (!key) {
            this.showToast('Please enter a valid API key.', 'error');
            return;
        }
        
        this.apiKey = key;
        localStorage.setItem('openrouter_api_key', key);
        this.hideModal();
        this.showToast('API key saved successfully!', 'success');
    }
    
    async translate() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showToast('Please enter some Afrikaans text to translate.', 'error');
            return;
        }
        
        if (!this.apiKey) {
            this.showModal();
            return;
        }
        
        if (text.length > 5000) {
            this.showToast('Text is too long. Maximum 5000 characters allowed.', 'error');
            return;
        }
        
        this.setLoading(true);
        this.hideDetails();
        
        try {
            const result = await this.callTranslationAPI(text);
            this.displayTranslation(result);
        } catch (error) {
            console.error('Translation error:', error);
            this.showToast(error.message || 'Translation failed. Please try again.', 'error');
            this.outputArea.innerHTML = '<div class="placeholder-text">Translation failed. Please try again.</div>';
        } finally {
            this.setLoading(false);
        }
    }
    
    async callTranslationAPI(text) {
        // Build context from translation history for ML improvement
        const recentTranslations = this.translationHistory.slice(-5);
        const historyContext = recentTranslations.length > 0 
            ? `\nRecent translation patterns from this user (for consistency):\n${recentTranslations.map(t => `- "${t.input}" → "${t.output}"`).join('\n')}\n`
            : '';

        const systemPrompt = `You are an expert Afrikaans to English translator AND a knowledgeable domain analyst with expertise across many fields including business, technology, transport, healthcare, education, law, finance, and more.

Your dual role:
1. Provide accurate, culturally-sensitive Afrikaans to English translations
2. Analyze the content's domain/topic and provide intelligent, well-researched insights

Knowledge areas for translation:
- Afrikaans grammar, vocabulary, and syntax
- Idiomatic expressions and their English equivalents
- Cultural context and nuances specific to South African culture
- Regional dialects and variations (Cape Afrikaans, Namibian Afrikaans, etc.)
- Formal vs informal registers
- Historical and modern usage patterns
${historyContext}

When translating AND analyzing content, provide a comprehensive JSON response:
{
    "translation": "The main English translation - natural and fluent",
    "formality": "formal" | "informal" | "neutral",
    "alternatives": [
        {"text": "Alternative translation 1", "context": "When/why to use this variant", "type": "clarity|fluency|formal|natural"},
        {"text": "Alternative translation 2", "context": "Usage scenario", "type": "clarity|fluency|formal|natural"}
    ],
    "sentenceSuggestions": [
        {"text": "Enhanced version of the translation", "reason": "Why this is better", "type": "clarity|fluency|formal|natural"},
        {"text": "More concise version", "reason": "Explanation", "type": "clarity|fluency|formal|natural"}
    ],
    "grammarAnalysis": {
        "tense": "Present/Past/Future/etc.",
        "mood": "Indicative/Subjunctive/Imperative/etc.",
        "voice": "Active/Passive",
        "structure": "Simple/Compound/Complex sentence",
        "notes": "Any interesting grammatical observations"
    },
    "toneAnalysis": {
        "sentiment": "positive|negative|neutral",
        "emotions": ["friendly", "professional", "casual", etc.],
        "intensity": "mild|moderate|strong"
    },
    "improvements": [
        {"title": "Improvement title", "description": "How this improves the translation", "example": "Example"}
    ],
    "relatedPhrases": [
        {"afrikaans": "Related Afrikaans phrase", "english": "English translation"}
    ],
    "culturalNote": "Cultural context (or null)",
    "idiomExplanation": "Idiom explanation (or null)",
    "confidence": 0.0-1.0,
    
    "contentIntelligence": {
        "detectedDomains": ["Primary domain", "Secondary domain"],
        "domainConfidence": 0.0-1.0,
        "strategicRecommendations": [
            {
                "title": "Strategic recommendation title",
                "description": "Detailed explanation of this recommendation",
                "impact": "high|medium|low",
                "rationale": "Why this is recommended based on the content"
            }
        ],
        "alternativeApproaches": [
            {
                "name": "Alternative approach name",
                "description": "Description of this alternative approach",
                "pros": ["Advantage 1", "Advantage 2"],
                "cons": ["Disadvantage 1"]
            }
        ],
        "keyConcepts": [
            {
                "term": "Key term from the content",
                "definition": "Clear explanation of this concept"
            }
        ],
        "industryContext": "Relevant industry/sector context and current trends that relate to this content",
        "bestPractices": [
            "Best practice or tip relevant to the content's domain",
            "Another actionable best practice"
        ],
        "suggestedResearch": ["Topic to research further", "Related area to explore"],
        "questionsToConsider": [
            "Strategic question the reader should consider",
            "Another thought-provoking question"
        ]
    },
    
    "expandedContext": {
        "practicalExamples": [
            {
                "title": "Example title describing the use case",
                "context": "Specific context where this applies",
                "application": "How to apply the concept from the translation",
                "result": "Expected outcome or result"
            }
        ],
        "realWorldScenarios": [
            {
                "title": "Scenario title",
                "situation": "Description of the real-world situation",
                "solution": "How concepts from the content apply",
                "outcome": "Measurable or observable outcome"
            }
        ],
        "calculations": [
            {
                "name": "Calculation or formula name",
                "formula": "The actual formula or calculation method",
                "example": "Worked example with real numbers"
            }
        ],
        "industryBenchmarks": [
            {
                "metric": "Metric name (e.g., IPK, utilization rate)",
                "value": "Typical target value or range",
                "range": "Industry standard range",
                "note": "Additional context or how to achieve it"
            }
        ],
        "implementationSteps": [
            {
                "step": 1,
                "title": "Step title",
                "description": "What to do in this step",
                "tip": "Helpful tip for this step"
            }
        ],
        "caseStudies": [
            {
                "title": "Case study title",
                "industry": "Industry or sector",
                "challenge": "The problem or challenge faced",
                "solution": "How it was solved",
                "results": ["Result 1", "Result 2", "Result 3"]
            }
        ],
        "commonPitfalls": [
            "Common mistake or pitfall to avoid with explanation"
        ],
        "keyMetrics": [
            {
                "name": "Metric name",
                "value": "Target or example value",
                "description": "What this metric measures",
                "target": "Target to aim for"
            }
        ],
        "templatesAndTools": [
            {
                "name": "Template or tool name",
                "description": "What it's used for",
                "type": "Template|Checklist|Tool|Framework"
            }
        ]
    }
}

Content Intelligence Guidelines:
1. ALWAYS detect the domain/topic of the content (e.g., transport, business, technology, health)
2. Provide 2-4 strategic recommendations specific to the content's subject matter
3. Suggest 2-3 alternative approaches or strategies relevant to the topic
4. Explain key technical or domain-specific concepts mentioned
5. Add relevant industry context and current trends
6. Include actionable best practices for the specific domain
7. Suggest related topics for further research
8. Pose thought-provoking questions to help the reader think deeper

Expanded Context Guidelines (IMPORTANT - provide practical, usable information):
1. Provide 2-3 practical examples showing how concepts apply in real situations
2. Include 2-3 real-world scenarios with specific situations, solutions, and outcomes
3. Add relevant calculations/formulas with worked examples using realistic numbers
4. Include industry benchmarks with actual target values (e.g., IPK 1.2-1.5, utilization 85%+)
5. Provide step-by-step implementation guidance with actionable tips
6. Include a brief case study example showing successful application
7. List 3-5 common pitfalls or mistakes to avoid
8. Define key metrics/KPIs with target values and descriptions
9. Suggest useful templates, tools, or frameworks relevant to the content

Example domains to detect and analyze:
- Transport/Logistics: route optimization, fleet management, sustainability, modal shifts
- Business Strategy: market positioning, competitive analysis, growth strategies
- Technology: digital transformation, automation, data analytics, AI applications
- Finance: budgeting, investment, risk management, cost optimization
- Healthcare: patient care, operational efficiency, compliance
- Education: curriculum design, assessment methods, student engagement
- Law: compliance, regulatory considerations, risk mitigation
- Marketing: audience targeting, channel strategies, brand positioning

Always respond with valid JSON only, no additional text.`;

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Afrikaans to English Translator'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Translate the following Afrikaans text to English, provide comprehensive linguistic analysis, AND analyze the content's domain to provide intelligent insights, strategic recommendations, and alternative approaches:\n\n"${text}"` }
                ],
                temperature: 0.3,
                max_tokens: 4000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenRouter API key.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else {
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }
        }
        
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error('No translation received from API');
        }
        
        // Parse the JSON response
        try {
            // Extract JSON from the response (in case there's extra text)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                
                // Store in translation history for ML learning
                this.translationHistory.push({
                    input: text,
                    output: result.translation,
                    timestamp: new Date().toISOString()
                });
                // Keep only last 50 translations
                this.translationHistory = this.translationHistory.slice(-50);
                localStorage.setItem('translation_history', JSON.stringify(this.translationHistory));
                
                return result;
            }
            throw new Error('Invalid response format');
        } catch (parseError) {
            console.error('Parse error:', parseError, 'Content:', content);
            // Fallback: return a simple translation object
            return {
                translation: content.replace(/[{}"]/g, '').trim(),
                formality: 'neutral',
                alternatives: [],
                sentenceSuggestions: [],
                grammarAnalysis: null,
                toneAnalysis: null,
                improvements: [],
                relatedPhrases: [],
                culturalNote: null,
                idiomExplanation: null,
                confidence: 0.7,
                contentIntelligence: null,
                expandedContext: null
            };
        }
    }
    
    displayTranslation(result) {
        this.currentTranslation = result;
        
        // Display main translation
        this.outputArea.innerHTML = `<div class="translation-text">${this.escapeHtml(result.translation)}</div>`;
        
        // Show details section
        this.detailsSection.classList.add('visible');
        
        // Display formality
        if (result.formality) {
            this.formalitySection.classList.add('visible');
            this.formalityBadge.textContent = result.formality.charAt(0).toUpperCase() + result.formality.slice(1);
            this.formalityBadge.className = `formality-badge ${result.formality}`;
        } else {
            this.formalitySection.classList.remove('visible');
        }
        
        // Display alternatives with enhanced styling
        if (result.alternatives && result.alternatives.length > 0) {
            this.alternativesSection.classList.add('visible');
            this.alternativesList.innerHTML = result.alternatives.map(alt => `
                <li>
                    <span class="alt-translation">${this.escapeHtml(alt.text)}</span>
                    ${alt.context ? `<span class="alt-context">${this.escapeHtml(alt.context)}</span>` : ''}
                    ${alt.type ? `<span class="suggestion-type ${alt.type}">${alt.type}</span>` : ''}
                </li>
            `).join('');
        } else {
            this.alternativesSection.classList.remove('visible');
        }
        
        // Display cultural note
        if (result.culturalNote) {
            this.culturalSection.classList.add('visible');
            this.culturalNote.textContent = result.culturalNote;
        } else {
            this.culturalSection.classList.remove('visible');
        }
        
        // Display idiom explanation
        if (result.idiomExplanation) {
            this.idiomSection.classList.add('visible');
            this.idiomNote.textContent = result.idiomExplanation;
        } else {
            this.idiomSection.classList.remove('visible');
        }
        
        // Display ML-powered sentence suggestions
        if (result.sentenceSuggestions && result.sentenceSuggestions.length > 0) {
            this.suggestionsSection.classList.add('visible');
            this.suggestionsList.innerHTML = result.sentenceSuggestions.map(sug => `
                <div class="suggestion-card" onclick="navigator.clipboard.writeText('${this.escapeHtml(sug.text).replace(/'/g, "\\'")}'); window.translator.showToast('Copied to clipboard!', 'success');">
                    <div class="suggestion-text">
                        ${this.escapeHtml(sug.text)}
                        ${sug.type ? `<span class="suggestion-type ${sug.type}">${sug.type}</span>` : ''}
                    </div>
                    <div class="suggestion-reason">${this.escapeHtml(sug.reason)}</div>
                </div>
            `).join('');
        } else {
            this.suggestionsSection.classList.remove('visible');
        }
        
        // Display grammar analysis
        if (result.grammarAnalysis) {
            this.grammarSection.classList.add('visible');
            const ga = result.grammarAnalysis;
            let grammarHtml = '';
            
            if (ga.tense) {
                grammarHtml += `<div class="grammar-item"><div><span class="grammar-label">Tense:</span> <span class="grammar-value">${this.escapeHtml(ga.tense)}</span></div></div>`;
            }
            if (ga.mood) {
                grammarHtml += `<div class="grammar-item"><div><span class="grammar-label">Mood:</span> <span class="grammar-value">${this.escapeHtml(ga.mood)}</span></div></div>`;
            }
            if (ga.voice) {
                grammarHtml += `<div class="grammar-item"><div><span class="grammar-label">Voice:</span> <span class="grammar-value">${this.escapeHtml(ga.voice)}</span></div></div>`;
            }
            if (ga.structure) {
                grammarHtml += `<div class="grammar-item"><div><span class="grammar-label">Structure:</span> <span class="grammar-value">${this.escapeHtml(ga.structure)}</span></div></div>`;
            }
            if (ga.notes) {
                grammarHtml += `<div class="grammar-item"><div><span class="grammar-label">Notes:</span> <span class="grammar-value">${this.escapeHtml(ga.notes)}</span></div></div>`;
            }
            
            this.grammarAnalysis.innerHTML = grammarHtml || '<p>No grammar details available.</p>';
        } else {
            this.grammarSection.classList.remove('visible');
        }
        
        // Display tone analysis
        if (result.toneAnalysis) {
            this.toneSection.classList.add('visible');
            const ta = result.toneAnalysis;
            let toneHtml = '';
            
            // Sentiment badge
            if (ta.sentiment) {
                toneHtml += `<span class="tone-badge ${ta.sentiment}">${ta.sentiment}</span>`;
            }
            
            // Emotion badges
            if (ta.emotions && ta.emotions.length > 0) {
                ta.emotions.forEach(emotion => {
                    toneHtml += `<span class="tone-badge ${emotion.toLowerCase()}">${emotion}</span>`;
                });
            }
            
            // Intensity badge
            if (ta.intensity) {
                const intensityColors = { mild: 'neutral', moderate: 'friendly', strong: 'emotional' };
                toneHtml += `<span class="tone-badge ${intensityColors[ta.intensity] || 'neutral'}">Intensity: ${ta.intensity}</span>`;
            }
            
            this.toneBadges.innerHTML = toneHtml || '<span class="tone-badge neutral">Unable to analyze tone</span>';
        } else {
            this.toneSection.classList.remove('visible');
        }
        
        // Display improvements
        if (result.improvements && result.improvements.length > 0) {
            this.improvementsSection.classList.add('visible');
            this.improvementsList.innerHTML = result.improvements.map(imp => `
                <li>
                    <div class="improvement-title">${this.escapeHtml(imp.title)}</div>
                    <div class="improvement-desc">${this.escapeHtml(imp.description)}</div>
                    ${imp.example ? `<div class="improvement-example">"${this.escapeHtml(imp.example)}"</div>` : ''}
                </li>
            `).join('');
        } else {
            this.improvementsSection.classList.remove('visible');
        }
        
        // Display related phrases
        if (result.relatedPhrases && result.relatedPhrases.length > 0) {
            this.relatedSection.classList.add('visible');
            this.relatedPhrases.innerHTML = result.relatedPhrases.map(phrase => `
                <div class="related-phrase" onclick="document.getElementById('inputText').value = '${this.escapeHtml(phrase.afrikaans).replace(/'/g, "\\'")}'; window.translator.updateCharCount();">
                    <span class="phrase-afr">${this.escapeHtml(phrase.afrikaans)}</span>
                    <span class="phrase-arrow">→</span>
                    <span class="phrase-eng">${this.escapeHtml(phrase.english)}</span>
                </div>
            `).join('');
        } else {
            this.relatedSection.classList.remove('visible');
        }
        
        // Display confidence score
        if (result.confidence !== undefined && result.confidence !== null) {
            this.confidenceSection.classList.add('visible');
            const confidence = Math.round(result.confidence * 100);
            const confidenceClass = confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low';
            
            this.confidenceFill.style.width = `${confidence}%`;
            this.confidenceFill.className = `confidence-fill ${confidenceClass}`;
            this.confidenceValue.textContent = `${confidence}%`;
            this.confidenceValue.className = `confidence-value ${confidenceClass}`;
        } else {
            this.confidenceSection.classList.remove('visible');
        }
        
        // Display Content Intelligence section
        this.displayContentIntelligence(result.contentIntelligence);
        
        // Display Expanded Context section
        this.displayExpandedContext(result.expandedContext);
        
        // Show feedback section
        this.feedbackSection.classList.add('visible');
        this.feedbackGood.classList.remove('selected');
        this.feedbackBad.classList.remove('selected');
        this.feedbackThanks.classList.remove('visible');
    }
    
    displayContentIntelligence(ci) {
        if (!ci) {
            this.insightsSection.classList.remove('visible');
            return;
        }
        
        this.insightsSection.classList.add('visible');
        
        // Display detected domains
        if (ci.detectedDomains && ci.detectedDomains.length > 0) {
            this.topicSection.classList.add('visible');
            this.topicBadges.innerHTML = ci.detectedDomains.map((domain, i) => `
                <span class="topic-badge ${i > 0 ? 'secondary' : ''}">${this.escapeHtml(domain)}</span>
            `).join('');
        } else {
            this.topicSection.classList.remove('visible');
        }
        
        // Display strategic recommendations
        if (ci.strategicRecommendations && ci.strategicRecommendations.length > 0) {
            this.strategicSection.classList.add('visible');
            this.strategicList.innerHTML = ci.strategicRecommendations.map(rec => `
                <div class="strategic-item">
                    <div class="strategic-title">${this.escapeHtml(rec.title)}</div>
                    <div class="strategic-desc">${this.escapeHtml(rec.description)}</div>
                    ${rec.rationale ? `<div class="strategic-desc" style="font-style: italic; margin-top: 4px;"><strong>Rationale:</strong> ${this.escapeHtml(rec.rationale)}</div>` : ''}
                    ${rec.impact ? `<span class="strategic-impact ${rec.impact}">Impact: ${rec.impact}</span>` : ''}
                </div>
            `).join('');
        } else {
            this.strategicSection.classList.remove('visible');
        }
        
        // Display alternative approaches
        if (ci.alternativeApproaches && ci.alternativeApproaches.length > 0) {
            this.alternativeApproachesSection.classList.add('visible');
            this.approachesContainer.innerHTML = ci.alternativeApproaches.map(approach => `
                <div class="approach-card">
                    <div class="approach-name">
                        ${this.escapeHtml(approach.name)}
                    </div>
                    <div class="approach-desc">${this.escapeHtml(approach.description)}</div>
                    <div class="approach-pros-cons">
                        ${(approach.pros || []).map(pro => `<div class="approach-pro">${this.escapeHtml(pro)}</div>`).join('')}
                        ${(approach.cons || []).map(con => `<div class="approach-con">${this.escapeHtml(con)}</div>`).join('')}
                    </div>
                </div>
            `).join('');
        } else {
            this.alternativeApproachesSection.classList.remove('visible');
        }
        
        // Display key concepts
        if (ci.keyConcepts && ci.keyConcepts.length > 0) {
            this.conceptsSection.classList.add('visible');
            this.conceptsGrid.innerHTML = ci.keyConcepts.map(concept => `
                <div class="concept-card">
                    <div class="concept-term">${this.escapeHtml(concept.term)}</div>
                    <div class="concept-definition">${this.escapeHtml(concept.definition)}</div>
                </div>
            `).join('');
        } else {
            this.conceptsSection.classList.remove('visible');
        }
        
        // Display industry context
        if (ci.industryContext) {
            this.industryContextSection.classList.add('visible');
            this.industryContext.textContent = ci.industryContext;
        } else {
            this.industryContextSection.classList.remove('visible');
        }
        
        // Display best practices
        if (ci.bestPractices && ci.bestPractices.length > 0) {
            this.bestPracticesSection.classList.add('visible');
            this.bestPracticesList.innerHTML = ci.bestPractices.map(practice => `
                <li>${this.escapeHtml(practice)}</li>
            `).join('');
        } else {
            this.bestPracticesSection.classList.remove('visible');
        }
        
        // Display research suggestions
        if (ci.suggestedResearch && ci.suggestedResearch.length > 0) {
            this.researchSection.classList.add('visible');
            this.researchTopics.innerHTML = ci.suggestedResearch.map(topic => `
                <span class="research-topic">${this.escapeHtml(topic)}</span>
            `).join('');
        } else {
            this.researchSection.classList.remove('visible');
        }
        
        // Display questions to consider
        if (ci.questionsToConsider && ci.questionsToConsider.length > 0) {
            this.questionsSection.classList.add('visible');
            this.questionsList.innerHTML = ci.questionsToConsider.map(question => `
                <li>${this.escapeHtml(question)}</li>
            `).join('');
        } else {
            this.questionsSection.classList.remove('visible');
        }
    }
    
    displayExpandedContext(ec) {
        if (!ec) {
            this.expandedSection.classList.remove('visible');
            return;
        }
        
        this.expandedSection.classList.add('visible');
        
        // Display practical examples
        if (ec.practicalExamples && ec.practicalExamples.length > 0) {
            this.practicalExamplesSection.classList.add('visible');
            this.examplesContainer.innerHTML = ec.practicalExamples.map((ex, i) => `
                <div class="example-card">
                    <div class="example-title">
                        <span class="example-number">${i + 1}</span>
                        ${this.escapeHtml(ex.title)}
                    </div>
                    <div class="example-context">${this.escapeHtml(ex.context)}</div>
                    <div class="example-result">
                        <strong>Application:</strong> ${this.escapeHtml(ex.application)}
                        ${ex.result ? `<br><strong>Result:</strong> ${this.escapeHtml(ex.result)}` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            this.practicalExamplesSection.classList.remove('visible');
        }
        
        // Display real-world scenarios
        if (ec.realWorldScenarios && ec.realWorldScenarios.length > 0) {
            this.scenariosSection.classList.add('visible');
            this.scenariosContainer.innerHTML = ec.realWorldScenarios.map(scenario => `
                <div class="scenario-card">
                    <div class="scenario-header">
                        <span class="scenario-title">${this.escapeHtml(scenario.title)}</span>
                    </div>
                    <div class="scenario-situation">${this.escapeHtml(scenario.situation)}</div>
                    <div class="scenario-solution">${this.escapeHtml(scenario.solution)}</div>
                    ${scenario.outcome ? `<div class="scenario-outcome">${this.escapeHtml(scenario.outcome)}</div>` : ''}
                </div>
            `).join('');
        } else {
            this.scenariosSection.classList.remove('visible');
        }
        
        // Display calculations and formulas
        if (ec.calculations && ec.calculations.length > 0) {
            this.calculationsSection.classList.add('visible');
            this.calculationsContainer.innerHTML = ec.calculations.map(calc => `
                <div class="calculation-card">
                    <div class="calc-name">${this.escapeHtml(calc.name)}</div>
                    <div class="calc-formula">${this.escapeHtml(calc.formula)}</div>
                    ${calc.example ? `<div class="calc-example"><strong>Example:</strong> ${this.escapeHtml(calc.example)}</div>` : ''}
                </div>
            `).join('');
        } else {
            this.calculationsSection.classList.remove('visible');
        }
        
        // Display industry benchmarks
        if (ec.industryBenchmarks && ec.industryBenchmarks.length > 0) {
            this.benchmarksSection.classList.add('visible');
            this.benchmarksContainer.innerHTML = ec.industryBenchmarks.map(bench => `
                <div class="benchmark-card">
                    <div class="benchmark-metric">${this.escapeHtml(bench.metric)}</div>
                    <div class="benchmark-value">${this.escapeHtml(bench.value)}</div>
                    ${bench.range ? `<div class="benchmark-range">${this.escapeHtml(bench.range)}</div>` : ''}
                    ${bench.note ? `<div class="benchmark-note">${this.escapeHtml(bench.note)}</div>` : ''}
                </div>
            `).join('');
        } else {
            this.benchmarksSection.classList.remove('visible');
        }
        
        // Display implementation steps
        if (ec.implementationSteps && ec.implementationSteps.length > 0) {
            this.implementationSection.classList.add('visible');
            this.implementationSteps.innerHTML = ec.implementationSteps.map(step => `
                <div class="step-card">
                    <div class="step-number">${step.step}</div>
                    <div class="step-content">
                        <div class="step-title">${this.escapeHtml(step.title)}</div>
                        <div class="step-description">${this.escapeHtml(step.description)}</div>
                        ${step.tip ? `<div class="step-tips">${this.escapeHtml(step.tip)}</div>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            this.implementationSection.classList.remove('visible');
        }
        
        // Display case studies
        if (ec.caseStudies && ec.caseStudies.length > 0) {
            this.caseStudySection.classList.add('visible');
            this.caseStudiesContainer.innerHTML = ec.caseStudies.map(cs => `
                <div class="case-study-card">
                    <div class="case-header">
                        <div class="case-title">${this.escapeHtml(cs.title)}</div>
                        ${cs.industry ? `<span class="case-industry">${this.escapeHtml(cs.industry)}</span>` : ''}
                    </div>
                    <div class="case-challenge">${this.escapeHtml(cs.challenge)}</div>
                    <div class="case-solution">${this.escapeHtml(cs.solution)}</div>
                    ${cs.results && cs.results.length > 0 ? `
                        <div class="case-results">
                            ${cs.results.map(r => `<span class="case-result">${this.escapeHtml(r)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        } else {
            this.caseStudySection.classList.remove('visible');
        }
        
        // Display common pitfalls
        if (ec.commonPitfalls && ec.commonPitfalls.length > 0) {
            this.pitfallsSection.classList.add('visible');
            this.pitfallsList.innerHTML = ec.commonPitfalls.map(pitfall => `
                <li>${this.escapeHtml(pitfall)}</li>
            `).join('');
        } else {
            this.pitfallsSection.classList.remove('visible');
        }
        
        // Display key metrics
        if (ec.keyMetrics && ec.keyMetrics.length > 0) {
            this.metricsSection.classList.add('visible');
            this.metricsGrid.innerHTML = ec.keyMetrics.map(metric => `
                <div class="metric-card">
                    <div class="metric-name">${this.escapeHtml(metric.name)}</div>
                    <div class="metric-value">${this.escapeHtml(metric.value)}</div>
                    ${metric.description ? `<div class="metric-description">${this.escapeHtml(metric.description)}</div>` : ''}
                    ${metric.target ? `<span class="metric-target">Target: ${this.escapeHtml(metric.target)}</span>` : ''}
                </div>
            `).join('');
        } else {
            this.metricsSection.classList.remove('visible');
        }
        
        // Display templates and tools
        if (ec.templatesAndTools && ec.templatesAndTools.length > 0) {
            this.templatesSection.classList.add('visible');
            this.templatesContainer.innerHTML = ec.templatesAndTools.map(template => `
                <div class="template-card">
                    <div class="template-name">${this.escapeHtml(template.name)}</div>
                    <div class="template-description">${this.escapeHtml(template.description)}</div>
                    ${template.type ? `<span class="template-type">${this.escapeHtml(template.type)}</span>` : ''}
                </div>
            `).join('');
        } else {
            this.templatesSection.classList.remove('visible');
        }
    }
    
    hideDetails() {
        this.detailsSection.classList.remove('visible');
        this.feedbackSection.classList.remove('visible');
        this.formalitySection.classList.remove('visible');
        this.alternativesSection.classList.remove('visible');
        this.culturalSection.classList.remove('visible');
        this.idiomSection.classList.remove('visible');
        this.suggestionsSection.classList.remove('visible');
        this.grammarSection.classList.remove('visible');
        this.toneSection.classList.remove('visible');
        this.improvementsSection.classList.remove('visible');
        this.relatedSection.classList.remove('visible');
        this.confidenceSection.classList.remove('visible');
        
        // Hide content intelligence section
        this.insightsSection.classList.remove('visible');
        this.topicSection.classList.remove('visible');
        this.strategicSection.classList.remove('visible');
        this.alternativeApproachesSection.classList.remove('visible');
        this.conceptsSection.classList.remove('visible');
        this.industryContextSection.classList.remove('visible');
        this.bestPracticesSection.classList.remove('visible');
        this.researchSection.classList.remove('visible');
        this.questionsSection.classList.remove('visible');
        
        // Hide expanded context section
        this.expandedSection.classList.remove('visible');
        this.practicalExamplesSection.classList.remove('visible');
        this.scenariosSection.classList.remove('visible');
        this.calculationsSection.classList.remove('visible');
        this.benchmarksSection.classList.remove('visible');
        this.implementationSection.classList.remove('visible');
        this.caseStudySection.classList.remove('visible');
        this.pitfallsSection.classList.remove('visible');
        this.metricsSection.classList.remove('visible');
        this.templatesSection.classList.remove('visible');
    }
    
    // Text Enhancement Methods
    async enhance() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showToast('Please enter some text to enhance.', 'error');
            return;
        }
        
        if (!this.apiKey) {
            this.showModal();
            return;
        }
        
        if (text.length > 5000) {
            this.showToast('Text is too long. Maximum 5000 characters allowed.', 'error');
            return;
        }
        
        this.setLoading(true);
        this.hideEnhancement();
        
        try {
            const result = await this.callEnhancementAPI(text);
            this.displayEnhancement(result);
        } catch (error) {
            console.error('Enhancement error:', error);
            this.showToast(error.message || 'Enhancement failed. Please try again.', 'error');
            this.outputArea.innerHTML = '<div class="placeholder-text">Enhancement failed. Please try again.</div>';
        } finally {
            this.setLoading(false);
        }
    }
    
    async callEnhancementAPI(text) {
        const systemPrompt = `You are an expert writing assistant and content enhancement specialist. Your role is to take any text and provide comprehensive improvements, suggestions, and ideas to make it better.

Your expertise includes:
- Sentence structure and flow improvement
- Clarity and readability enhancement
- Content expansion and enrichment
- Tone and style adjustments
- Grammar and punctuation (but go beyond just corrections)
- Adding depth and supporting information
- Restructuring for better impact

When enhancing text, provide a comprehensive JSON response:
{
    "enhancedText": "The improved version of the text with better sentence structure, clarity, and flow. This should be a complete rewrite that the user can directly use.",
    
    "structureImprovements": [
        {
            "issue": "What was problematic in the original",
            "improvement": "What was changed and why",
            "example": "Before → After example if applicable"
        }
    ],
    
    "suggestedAdditions": [
        {
            "title": "Title of what to add",
            "content": "Detailed description of what content to add",
            "example": "Example of how to incorporate this addition",
            "benefit": "Why this addition would improve the text"
        }
    ],
    
    "enhancementIdeas": [
        {
            "title": "Enhancement idea title",
            "description": "Detailed description of this enhancement idea",
            "benefit": "How this would improve the overall message/impact"
        }
    ],
    
    "alternativeVersions": [
        {
            "type": "formal|casual|concise|detailed|persuasive|technical",
            "text": "The text rewritten in this alternative style",
            "useCase": "When this version would be most appropriate"
        }
    ],
    
    "toneSuggestions": [
        {
            "currentTone": "Description of the current tone",
            "suggestion": "How the tone could be adjusted",
            "example": "Example of the adjusted tone"
        }
    ],
    
    "clarityScore": 0.0-1.0,
    "clarityNote": "Assessment of the text's clarity and suggestions for improvement"
}

Guidelines:
1. The enhanced text should be significantly better than the original - not just minor edits
2. Provide at least 3-4 structure improvements with specific examples
3. Suggest at least 3 additions that would enrich the content (data, examples, context, etc.)
4. Offer at least 3 creative ideas to enhance the information's impact
5. Provide 2-3 alternative versions in different tones/styles
6. Give actionable tone suggestions
7. Be specific and provide concrete examples throughout
8. Focus on making the text more engaging, informative, and impactful

Types of additions to suggest:
- Statistics or data to support claims
- Real-world examples or case studies
- Expert quotes or citations
- Visual descriptions or analogies
- Counter-arguments and rebuttals
- Action items or next steps
- Context or background information
- Definitions of key terms

Always respond with valid JSON only, no additional text.`;

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Text Enhancement Tool'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Please enhance the following text. Provide improved sentence structure, suggestions for additions, and ideas to enhance the information:\n\n"${text}"` }
                ],
                temperature: 0.4,
                max_tokens: 4000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenRouter API key.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else {
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }
        }
        
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error('No enhancement received from API');
        }
        
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('Invalid response format');
        } catch (parseError) {
            console.error('Parse error:', parseError, 'Content:', content);
            return {
                enhancedText: content.replace(/[{}"]/g, '').trim(),
                structureImprovements: [],
                suggestedAdditions: [],
                enhancementIdeas: [],
                alternativeVersions: [],
                toneSuggestions: [],
                clarityScore: 0.7,
                clarityNote: 'Unable to provide detailed analysis.'
            };
        }
    }
    
    displayEnhancement(result) {
        this.currentEnhancement = result;
        
        // Display enhanced text in output area
        this.outputArea.innerHTML = `<div class="translation-text">${this.escapeHtml(result.enhancedText)}</div>`;
        
        // Show enhancement section
        this.enhancementSection.classList.add('visible');
        
        // Display enhanced text in enhancement card
        if (result.enhancedText) {
            this.enhancedTextSection.classList.add('visible');
            this.enhancedText.innerHTML = this.escapeHtml(result.enhancedText);
        } else {
            this.enhancedTextSection.classList.remove('visible');
        }
        
        // Display structure improvements
        if (result.structureImprovements && result.structureImprovements.length > 0) {
            this.structureSection.classList.add('visible');
            this.structureList.innerHTML = result.structureImprovements.map(item => `
                <li>
                    <strong>${this.escapeHtml(item.issue)}</strong>
                    ${this.escapeHtml(item.improvement)}
                    ${item.example ? `<br><em>${this.escapeHtml(item.example)}</em>` : ''}
                </li>
            `).join('');
        } else {
            this.structureSection.classList.remove('visible');
        }
        
        // Display suggested additions
        if (result.suggestedAdditions && result.suggestedAdditions.length > 0) {
            this.additionsSection.classList.add('visible');
            this.additionsList.innerHTML = result.suggestedAdditions.map(addition => `
                <div class="addition-card">
                    <div class="addition-title">${this.escapeHtml(addition.title)}</div>
                    <div class="addition-content">${this.escapeHtml(addition.content)}</div>
                    ${addition.example ? `<div class="addition-example">${this.escapeHtml(addition.example)}</div>` : ''}
                </div>
            `).join('');
        } else {
            this.additionsSection.classList.remove('visible');
        }
        
        // Display enhancement ideas
        if (result.enhancementIdeas && result.enhancementIdeas.length > 0) {
            this.ideasSection.classList.add('visible');
            this.ideasList.innerHTML = result.enhancementIdeas.map(idea => `
                <div class="idea-card">
                    <div class="idea-title">${this.escapeHtml(idea.title)}</div>
                    <div class="idea-description">${this.escapeHtml(idea.description)}</div>
                    ${idea.benefit ? `<div class="idea-benefit">Benefit: ${this.escapeHtml(idea.benefit)}</div>` : ''}
                </div>
            `).join('');
        } else {
            this.ideasSection.classList.remove('visible');
        }
        
        // Display alternative versions
        if (result.alternativeVersions && result.alternativeVersions.length > 0) {
            this.versionsSection.classList.add('visible');
            this.versionsList.innerHTML = result.alternativeVersions.map(version => `
                <div class="version-card">
                    <span class="version-type">${this.escapeHtml(version.type)}</span>
                    <div class="version-text">${this.escapeHtml(version.text)}</div>
                    ${version.useCase ? `<div class="version-use-case">${this.escapeHtml(version.useCase)}</div>` : ''}
                </div>
            `).join('');
        } else {
            this.versionsSection.classList.remove('visible');
        }
        
        // Display tone suggestions
        if (result.toneSuggestions && result.toneSuggestions.length > 0) {
            this.toneEnhanceSection.classList.add('visible');
            this.toneEnhanceList.innerHTML = result.toneSuggestions.map(tone => `
                <div class="tone-suggestion-card">
                    <div class="tone-type">${this.escapeHtml(tone.suggestion)}</div>
                    ${tone.example ? `<div class="tone-example">${this.escapeHtml(tone.example)}</div>` : ''}
                </div>
            `).join('');
        } else {
            this.toneEnhanceSection.classList.remove('visible');
        }
        
        // Display clarity score
        if (result.clarityScore !== undefined) {
            this.claritySection.classList.add('visible');
            const percentage = Math.round(result.clarityScore * 100);
            this.clarityFill.style.width = `${percentage}%`;
            this.clarityValue.textContent = `${percentage}%`;
            this.clarityNote.textContent = result.clarityNote || '';
        } else {
            this.claritySection.classList.remove('visible');
        }
    }
    
    hideEnhancement() {
        this.enhancementSection.classList.remove('visible');
        this.enhancedTextSection.classList.remove('visible');
        this.structureSection.classList.remove('visible');
        this.additionsSection.classList.remove('visible');
        this.ideasSection.classList.remove('visible');
        this.versionsSection.classList.remove('visible');
        this.toneEnhanceSection.classList.remove('visible');
        this.claritySection.classList.remove('visible');
    }
    
    async copyEnhancedText() {
        if (!this.currentEnhancement || !this.currentEnhancement.enhancedText) {
            this.showToast('No enhanced text to copy.', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(this.currentEnhancement.enhancedText);
            this.showToast('Enhanced text copied to clipboard!', 'success');
        } catch (err) {
            this.showToast('Failed to copy. Please select and copy manually.', 'error');
        }
    }
    
    // Email Translation Methods
    async translateEmail() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showToast('Please enter some Afrikaans email text to translate.', 'error');
            return;
        }
        
        if (!this.apiKey) {
            this.showModal();
            return;
        }
        
        if (text.length > 5000) {
            this.showToast('Text is too long. Maximum 5000 characters allowed.', 'error');
            return;
        }
        
        this.setLoading(true);
        this.hideEmail();
        
        try {
            const result = await this.callEmailTranslationAPI(text);
            this.displayEmailTranslation(result);
        } catch (error) {
            console.error('Email translation error:', error);
            this.showToast(error.message || 'Email translation failed. Please try again.', 'error');
            this.outputArea.innerHTML = '<div class="placeholder-text">Email translation failed. Please try again.</div>';
        } finally {
            this.setLoading(false);
        }
    }
    
    async callEmailTranslationAPI(text) {
        const systemPrompt = `You are an expert Afrikaans to English translator specializing in professional email communication. Your role is to translate Afrikaans emails into well-formatted, professional English emails ready for copy-pasting.

Your expertise includes:
- Afrikaans to English translation with cultural sensitivity
- Professional email formatting and etiquette
- Appropriate greetings and closings for different contexts
- Maintaining the original tone while making it natural in English

When translating email content, provide a comprehensive JSON response:
{
    "subject": "Suggested email subject line in English",
    
    "greeting": "Appropriate greeting (e.g., 'Dear Mr. Smith,' or 'Hi Team,')",
    
    "body": "The translated email body with proper paragraph breaks. Use \\n\\n for paragraph breaks.",
    
    "closing": "Appropriate closing (e.g., 'Kind regards,' or 'Best wishes,')",
    
    "signature": "[Your Name]",
    
    "fullEmail": "The complete formatted email ready to copy-paste, including greeting, body, closing, and signature placeholder. Use actual line breaks.",
    
    "alternativeGreetings": [
        {"text": "Alternative greeting option", "tone": "formal|friendly|casual"},
        {"text": "Another greeting", "tone": "formal|friendly|casual"}
    ],
    
    "alternativeClosings": [
        {"text": "Alternative closing option", "tone": "formal|friendly|casual"},
        {"text": "Another closing", "tone": "formal|friendly|casual"}
    ],
    
    "emailTone": {
        "detected": ["formal", "professional", "friendly", etc.],
        "suggestions": "Any tone adjustments recommended"
    },
    
    "alternativeVersions": [
        {
            "type": "formal|concise|friendly|detailed",
            "fullEmail": "Complete alternative version of the email",
            "description": "When to use this version"
        }
    ]
}

Email Formatting Guidelines:
1. ALWAYS detect if the input is an email or general text and format accordingly
2. Suggest an appropriate subject line based on the content
3. Choose greetings based on detected formality (Dear/Hi/Hello)
4. Format the body with proper paragraph breaks for readability
5. Choose appropriate professional closings
6. Provide 2-3 alternative greeting options
7. Provide 2-3 alternative closing options
8. Include at least 2 alternative versions (formal/concise/friendly)

For the fullEmail field, format it exactly like this (with actual line breaks, not escaped):
Greeting

Body paragraph 1

Body paragraph 2

Closing
[Your Name]

Always respond with valid JSON only, no additional text.`;

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Email Translation Tool'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Translate the following Afrikaans email text to English and format it as a professional email ready for copy-pasting:\n\n"${text}"` }
                ],
                temperature: 0.3,
                max_tokens: 3000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenRouter API key.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else {
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }
        }
        
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error('No translation received from API');
        }
        
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('Invalid response format');
        } catch (parseError) {
            console.error('Parse error:', parseError, 'Content:', content);
            return {
                subject: 'Email',
                greeting: 'Hello,',
                body: content.replace(/[{}"]/g, '').trim(),
                closing: 'Kind regards,',
                signature: '[Your Name]',
                fullEmail: `Hello,\n\n${content.replace(/[{}"]/g, '').trim()}\n\nKind regards,\n[Your Name]`,
                alternativeGreetings: [],
                alternativeClosings: [],
                emailTone: { detected: ['neutral'], suggestions: '' },
                alternativeVersions: []
            };
        }
    }
    
    displayEmailTranslation(result) {
        this.currentEmail = result;
        
        // Format the full email for display
        const formattedEmail = result.fullEmail || `${result.greeting}\n\n${result.body}\n\n${result.closing}\n${result.signature}`;
        
        // Display in output area
        this.outputArea.innerHTML = `<div class="translation-text" style="white-space: pre-wrap;">${this.escapeHtml(formattedEmail)}</div>`;
        
        // Show email section
        this.emailSection.classList.add('visible');
        
        // Display subject
        if (result.subject) {
            this.subjectSection.classList.add('visible');
            this.emailSubject.textContent = result.subject;
            
            // Add copy functionality to subject button
            const subjectCopyBtn = this.subjectSection.querySelector('.copy-section-btn');
            if (subjectCopyBtn) {
                subjectCopyBtn.onclick = async () => {
                    try {
                        await navigator.clipboard.writeText(result.subject);
                        this.showToast('Subject copied!', 'success');
                    } catch (err) {
                        this.showToast('Failed to copy subject.', 'error');
                    }
                };
            }
        } else {
            this.subjectSection.classList.remove('visible');
        }
        
        // Display email preview
        this.emailPreviewSection.classList.add('visible');
        this.emailPreview.innerHTML = this.escapeHtml(formattedEmail);
        
        // Display greeting options
        if (result.alternativeGreetings && result.alternativeGreetings.length > 0) {
            this.greetingSection.classList.add('visible');
            this.greetingOptions.innerHTML = result.alternativeGreetings.map((g, i) => `
                <button class="greeting-option ${i === 0 ? 'selected' : ''}" data-greeting="${this.escapeHtml(g.text)}">${this.escapeHtml(g.text)}</button>
            `).join('');
            
            // Add click handlers for greeting options
            this.greetingOptions.querySelectorAll('.greeting-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.greetingOptions.querySelectorAll('.greeting-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.updateEmailPreview(btn.dataset.greeting, null);
                });
            });
        } else {
            this.greetingSection.classList.remove('visible');
        }
        
        // Display closing options
        if (result.alternativeClosings && result.alternativeClosings.length > 0) {
            this.closingSection.classList.add('visible');
            this.closingOptions.innerHTML = result.alternativeClosings.map((c, i) => `
                <button class="closing-option ${i === 0 ? 'selected' : ''}" data-closing="${this.escapeHtml(c.text)}">${this.escapeHtml(c.text)}</button>
            `).join('');
            
            // Add click handlers for closing options
            this.closingOptions.querySelectorAll('.closing-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.closingOptions.querySelectorAll('.closing-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.updateEmailPreview(null, btn.dataset.closing);
                });
            });
        } else {
            this.closingSection.classList.remove('visible');
        }
        
        // Display email tone
        if (result.emailTone && result.emailTone.detected) {
            this.emailToneSection.classList.add('visible');
            this.emailToneBadges.innerHTML = result.emailTone.detected.map(tone => `
                <span class="email-tone-badge ${tone.toLowerCase()}">${tone}</span>
            `).join('');
        } else {
            this.emailToneSection.classList.remove('visible');
        }
        
        // Display alternative versions
        if (result.alternativeVersions && result.alternativeVersions.length > 0) {
            this.emailVersionsSection.classList.add('visible');
            this.emailVersionsList.innerHTML = result.alternativeVersions.map((version, i) => `
                <div class="email-version-card" data-version="${i}">
                    <div class="version-header">
                        <span class="version-type">${this.escapeHtml(version.type)}</span>
                        <button class="version-copy-btn" data-email="${this.escapeHtml(version.fullEmail)}">Copy</button>
                    </div>
                    <div class="version-preview">${this.escapeHtml(version.fullEmail)}</div>
                </div>
            `).join('');
            
            // Add copy handlers for version buttons
            this.emailVersionsList.querySelectorAll('.version-copy-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        await navigator.clipboard.writeText(btn.dataset.email);
                        this.showToast('Email version copied!', 'success');
                    } catch (err) {
                        this.showToast('Failed to copy.', 'error');
                    }
                });
            });
        } else {
            this.emailVersionsSection.classList.remove('visible');
        }
    }
    
    updateEmailPreview(newGreeting, newClosing) {
        if (!this.currentEmail) return;
        
        let greeting = newGreeting || this.currentEmail.greeting;
        let closing = newClosing || this.currentEmail.closing;
        
        // Get currently selected greeting/closing if not provided
        if (!newGreeting) {
            const selectedGreeting = this.greetingOptions.querySelector('.greeting-option.selected');
            if (selectedGreeting) greeting = selectedGreeting.dataset.greeting;
        }
        if (!newClosing) {
            const selectedClosing = this.closingOptions.querySelector('.closing-option.selected');
            if (selectedClosing) closing = selectedClosing.dataset.closing;
        }
        
        const updatedEmail = `${greeting}\n\n${this.currentEmail.body}\n\n${closing}\n${this.currentEmail.signature}`;
        this.emailPreview.innerHTML = this.escapeHtml(updatedEmail);
        this.outputArea.innerHTML = `<div class="translation-text" style="white-space: pre-wrap;">${this.escapeHtml(updatedEmail)}</div>`;
    }
    
    hideEmail() {
        this.emailSection.classList.remove('visible');
        this.subjectSection.classList.remove('visible');
        this.emailPreviewSection.classList.remove('visible');
        this.greetingSection.classList.remove('visible');
        this.closingSection.classList.remove('visible');
        this.emailToneSection.classList.remove('visible');
        this.emailVersionsSection.classList.remove('visible');
    }
    
    // AI Agent Methods
    async askAgent() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showToast('Please enter a question or context for the AI Agent.', 'error');
            return;
        }
        
        if (!this.apiKey) {
            this.showModal();
            return;
        }
        
        if (text.length > 10000) {
            this.showToast('Text is too long. Maximum 10000 characters allowed for agent mode.', 'error');
            return;
        }
        
        this.setLoading(true);
        this.hideAgent();
        
        try {
            const result = await this.callAgentAPI(text);
            this.displayAgentResponse(result);
        } catch (error) {
            console.error('Agent error:', error);
            this.showToast(error.message || 'AI Agent failed. Please try again.', 'error');
            this.outputArea.innerHTML = '<div class="placeholder-text">AI Agent analysis failed. Please try again.</div>';
        } finally {
            this.setLoading(false);
        }
    }
    
    async callAgentAPI(text) {
        const systemPrompt = `You are an expert AI business strategist and analyst assistant. Your role is to analyze questions, contexts, and data provided by the user and deliver comprehensive, actionable insights.

Your expertise spans:
- Business Strategy & Planning
- Budget & Financial Analysis
- Operations & Process Optimization
- Market Analysis & Competitive Intelligence
- Project Management & Implementation
- Risk Assessment & Mitigation
- Innovation & Growth Strategies
- Team & Resource Management

When responding to user queries, provide a comprehensive JSON response:
{
    "summary": "A clear, concise summary answering the user's question or analyzing their context (2-3 paragraphs)",
    
    "keyInsights": [
        "Key insight or finding #1 - specific and actionable",
        "Key insight or finding #2 - with supporting rationale",
        "Key insight or finding #3 - practical and implementable",
        "Key insight or finding #4 - strategic perspective"
    ],
    
    "expandedIdeas": [
        {
            "title": "Strategic Idea Title",
            "description": "Detailed expansion of this idea with specific implementation guidance",
            "impact": "high|medium|low",
            "effort": "high|medium|low",
            "timeline": "short-term (1-3 months)|medium-term (3-6 months)|long-term (6-12 months)",
            "keyActions": ["Action 1", "Action 2", "Action 3"]
        }
    ],
    
    "actionItems": [
        {
            "priority": 1,
            "task": "Specific actionable task",
            "details": "Detailed explanation of what needs to be done",
            "owner": "Suggested responsibility (e.g., Finance Team, Management)",
            "deadline": "Suggested timeframe"
        }
    ],
    
    "followUpQuestions": [
        "Strategic question to explore further",
        "Question to deepen analysis",
        "Question to consider alternatives"
    ],
    
    "resources": [
        {
            "type": "Framework|Tool|Template|Methodology|Best Practice",
            "name": "Resource name",
            "description": "How this resource can help",
            "application": "How to apply it to the current context"
        }
    ],
    
    "risks": [
        {
            "risk": "Potential risk or challenge",
            "mitigation": "How to mitigate or address it"
        }
    ],
    
    "metrics": [
        {
            "kpi": "Key Performance Indicator name",
            "target": "Suggested target value",
            "rationale": "Why this metric matters"
        }
    ]
}

Guidelines for Budget Strategy Analysis:
1. Focus on practical, implementable recommendations
2. Consider both short-term quick wins and long-term strategic initiatives
3. Provide specific numbers, percentages, and benchmarks where applicable
4. Address resource allocation and prioritization
5. Include risk considerations and contingency planning
6. Suggest measurement frameworks and success criteria
7. Consider stakeholder perspectives and change management
8. Reference industry best practices and proven methodologies

For any question or context, always:
- Break down complex topics into manageable components
- Provide specific examples and case scenarios
- Offer multiple strategic options with pros/cons
- Include implementation roadmaps where applicable
- Highlight critical success factors
- Address potential obstacles proactively

Always respond with valid JSON only, no additional text.`;

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'AI Strategy Agent'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Please analyze the following question/context and provide comprehensive strategic insights, expanded ideas, and actionable recommendations:\n\n"${text}"` }
                ],
                temperature: 0.5,
                max_tokens: 6000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenRouter API key.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else {
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }
        }
        
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error('No response received from AI Agent');
        }
        
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('Invalid response format');
        } catch (e) {
            console.error('JSON parse error:', e);
            throw new Error('Failed to parse AI Agent response');
        }
    }
    
    displayAgentResponse(result) {
        this.currentAgentResponse = result;
        
        // Display summary in output area
        if (result.summary) {
            this.outputArea.innerHTML = `<div class="translation-text" style="white-space: pre-wrap; line-height: 1.6;">${this.escapeHtml(result.summary)}</div>`;
        }
        
        // Show agent section
        this.agentSection.classList.add('visible');
        
        // Display answer/summary
        if (result.summary) {
            this.answerSection.classList.add('visible');
            this.agentAnswer.innerHTML = `<div style="line-height: 1.7;">${this.escapeHtml(result.summary)}</div>`;
        }
        
        // Display key insights
        if (result.keyInsights && result.keyInsights.length > 0) {
            this.keyInsightsSection.classList.add('visible');
            this.keyInsightsList.innerHTML = result.keyInsights.map(insight => `
                <li class="key-insight-item">${this.escapeHtml(insight)}</li>
            `).join('');
        } else {
            this.keyInsightsSection.classList.remove('visible');
        }
        
        // Display expanded ideas
        if (result.expandedIdeas && result.expandedIdeas.length > 0) {
            this.expandedIdeasSection.classList.add('visible');
            this.expandedIdeasList.innerHTML = result.expandedIdeas.map(idea => `
                <div class="expanded-idea-card">
                    <div class="idea-header">
                        <span class="idea-title">${this.escapeHtml(idea.title)}</span>
                        <div class="idea-badges">
                            ${idea.impact ? `<span class="impact-badge ${idea.impact}">${idea.impact} impact</span>` : ''}
                            ${idea.timeline ? `<span class="timeline-badge">${idea.timeline}</span>` : ''}
                        </div>
                    </div>
                    <div class="idea-description">${this.escapeHtml(idea.description)}</div>
                    ${idea.keyActions && idea.keyActions.length > 0 ? `
                        <div class="idea-actions">
                            <strong>Key Actions:</strong>
                            <ul>${idea.keyActions.map(a => `<li>${this.escapeHtml(a)}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        } else {
            this.expandedIdeasSection.classList.remove('visible');
        }
        
        // Display action items
        if (result.actionItems && result.actionItems.length > 0) {
            this.actionItemsSection.classList.add('visible');
            this.actionItemsList.innerHTML = result.actionItems.map(item => `
                <div class="action-item-card">
                    <div class="action-priority">Priority ${item.priority}</div>
                    <div class="action-task">${this.escapeHtml(item.task)}</div>
                    <div class="action-details">${this.escapeHtml(item.details)}</div>
                    <div class="action-meta">
                        ${item.owner ? `<span class="action-owner">👤 ${this.escapeHtml(item.owner)}</span>` : ''}
                        ${item.deadline ? `<span class="action-deadline">📅 ${this.escapeHtml(item.deadline)}</span>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            this.actionItemsSection.classList.remove('visible');
        }
        
        // Display follow-up questions
        if (result.followUpQuestions && result.followUpQuestions.length > 0) {
            this.relatedQuestionsSection.classList.add('visible');
            this.relatedQuestionsList.innerHTML = result.followUpQuestions.map(q => `
                <div class="follow-up-question" onclick="document.getElementById('inputText').value = '${this.escapeHtml(q).replace(/'/g, "\\'")}'; document.getElementById('inputText').focus();">
                    <span class="question-icon">❓</span>
                    <span class="question-text">${this.escapeHtml(q)}</span>
                </div>
            `).join('');
        } else {
            this.relatedQuestionsSection.classList.remove('visible');
        }
        
        // Display resources
        if (result.resources && result.resources.length > 0) {
            this.resourcesSection.classList.add('visible');
            this.resourcesList.innerHTML = result.resources.map(res => `
                <div class="resource-card">
                    <span class="resource-type">${this.escapeHtml(res.type)}</span>
                    <div class="resource-name">${this.escapeHtml(res.name)}</div>
                    <div class="resource-desc">${this.escapeHtml(res.description)}</div>
                    ${res.application ? `<div class="resource-application"><strong>Application:</strong> ${this.escapeHtml(res.application)}</div>` : ''}
                </div>
            `).join('');
        } else {
            this.resourcesSection.classList.remove('visible');
        }
        
        // Bind copy agent button
        this.copyAgentBtn.onclick = () => this.copyAgentResponse();
    }
    
    hideAgent() {
        this.agentSection.classList.remove('visible');
        this.answerSection.classList.remove('visible');
        this.keyInsightsSection.classList.remove('visible');
        this.expandedIdeasSection.classList.remove('visible');
        this.actionItemsSection.classList.remove('visible');
        this.relatedQuestionsSection.classList.remove('visible');
        this.resourcesSection.classList.remove('visible');
    }
    
    async copyAgentResponse() {
        if (!this.currentAgentResponse) {
            this.showToast('No analysis to copy.', 'error');
            return;
        }
        
        // Format the response as readable text
        let text = '';
        
        if (this.currentAgentResponse.summary) {
            text += `ANALYSIS SUMMARY\n${'='.repeat(50)}\n${this.currentAgentResponse.summary}\n\n`;
        }
        
        if (this.currentAgentResponse.keyInsights && this.currentAgentResponse.keyInsights.length > 0) {
            text += `KEY INSIGHTS\n${'='.repeat(50)}\n`;
            this.currentAgentResponse.keyInsights.forEach((insight, i) => {
                text += `${i + 1}. ${insight}\n`;
            });
            text += '\n';
        }
        
        if (this.currentAgentResponse.expandedIdeas && this.currentAgentResponse.expandedIdeas.length > 0) {
            text += `EXPANDED IDEAS & RECOMMENDATIONS\n${'='.repeat(50)}\n`;
            this.currentAgentResponse.expandedIdeas.forEach((idea, i) => {
                text += `\n${i + 1}. ${idea.title}\n`;
                text += `   Impact: ${idea.impact || 'N/A'} | Timeline: ${idea.timeline || 'N/A'}\n`;
                text += `   ${idea.description}\n`;
                if (idea.keyActions && idea.keyActions.length > 0) {
                    text += `   Key Actions:\n`;
                    idea.keyActions.forEach(a => text += `   • ${a}\n`);
                }
            });
            text += '\n';
        }
        
        if (this.currentAgentResponse.actionItems && this.currentAgentResponse.actionItems.length > 0) {
            text += `ACTION ITEMS\n${'='.repeat(50)}\n`;
            this.currentAgentResponse.actionItems.forEach(item => {
                text += `[Priority ${item.priority}] ${item.task}\n`;
                text += `   ${item.details}\n`;
                if (item.owner) text += `   Owner: ${item.owner}\n`;
                if (item.deadline) text += `   Deadline: ${item.deadline}\n`;
                text += '\n';
            });
        }
        
        if (this.currentAgentResponse.followUpQuestions && this.currentAgentResponse.followUpQuestions.length > 0) {
            text += `FOLLOW-UP QUESTIONS\n${'='.repeat(50)}\n`;
            this.currentAgentResponse.followUpQuestions.forEach((q, i) => {
                text += `${i + 1}. ${q}\n`;
            });
            text += '\n';
        }
        
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Full analysis copied to clipboard!', 'success');
        } catch (err) {
            this.showToast('Failed to copy. Please select and copy manually.', 'error');
        }
    }
    
    async copyEmail() {
        if (!this.currentEmail) {
            this.showToast('No email to copy.', 'error');
            return;
        }
        
        // Get the current email preview content
        const emailText = this.emailPreview.innerText || this.emailPreview.textContent;
        
        try {
            await navigator.clipboard.writeText(emailText);
            this.showToast('Email copied to clipboard!', 'success');
        } catch (err) {
            this.showToast('Failed to copy. Please select and copy manually.', 'error');
        }
    }
    
    submitFeedback(rating) {
        // Store feedback for ML improvement
        const feedback = {
            timestamp: new Date().toISOString(),
            inputText: this.inputText.value,
            translation: this.currentTranslation,
            rating: rating
        };
        
        // Store in localStorage for now (in production, send to backend)
        const feedbackHistory = JSON.parse(localStorage.getItem('translation_feedback') || '[]');
        feedbackHistory.push(feedback);
        localStorage.setItem('translation_feedback', JSON.stringify(feedbackHistory.slice(-100))); // Keep last 100
        
        // Update UI
        if (rating === 'good') {
            this.feedbackGood.classList.add('selected');
            this.feedbackBad.classList.remove('selected');
        } else {
            this.feedbackBad.classList.add('selected');
            this.feedbackGood.classList.remove('selected');
        }
        
        this.feedbackThanks.classList.add('visible');
    }
    
    setLoading(isLoading) {
        this.translateBtn.disabled = isLoading;
        this.translateBtn.classList.toggle('loading', isLoading);
        
        if (isLoading) {
            this.outputArea.innerHTML = '<div class="placeholder-text">Translating...</div>';
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the translator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.translator = new AfrikaansTranslator();
});
