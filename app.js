/**
 * Afrikaans to English Translator
 * AI-powered translation using OpenRouter API
 */

class AfrikaansTranslator {
    constructor() {
        // Email signature (plain text version for email body)
        this.emailSignaturePlainText = `Heinrich Nel
General Manager Transport
Matanuska

Email: Heinrich@matanuska.co.za
Web: matanuska.co.zw
Phone: +27 66 273 1270`;
        
        // HTML signature for rich copy
        this.emailSignatureHTML = `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 550px; padding: 20px; background-color: #ffffff; color: #002d8b;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2px;">
        <div style="background-color: #002d8b; padding: 10px 25px; color: #ffbf00; font-family: 'Georgia', serif; font-size: 32px; font-weight: bold; line-height: 1;">Matanuska</div>
        <div style="font-size: 20px; font-weight: bold; padding-bottom: 5px;">Heinrich Nel</div>
    </div>
    <div style="height: 3px; background-color: #ffbf00; width: 100%; margin-bottom: 10px;"></div>
    <div style="display: flex; justify-content: space-between; font-size: 14px; line-height: 1.6;">
        <div>
            <a href="mailto:Heinrich@matanuska.co.za" style="color: #002d8b; text-decoration: none;">Heinrich@matanuska.co.za</a><br>
            <a href="http://matanuska.co.zw" target="_blank" style="color: #002d8b; text-decoration: none;">matanuska.co.zw</a>
        </div>
        <div style="text-align: right;">
            <div style="font-style: italic;">General Manager Transport</div>
            <div>+27 66 273 1270</div>
        </div>
    </div>
</div>`;
        
        // API Keys
        this.openrouterApiKey = localStorage.getItem('openrouter_api_key') || '';
        this.openaiApiKey = localStorage.getItem('openai_api_key') || '';
        this.deepseekApiKey = localStorage.getItem('deepseek_api_key') || '';
        
        // Model and endpoint will be set dynamically
        this.model = localStorage.getItem('openrouter_model') || 'anthropic/claude-3.5-sonnet';
        
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
        this.openaiKeyInput = document.getElementById('openaiKeyInput');
        this.deepseekKeyInput = document.getElementById('deepseekKeyInput');
        this.openrouterKeySection = document.getElementById('openrouterKeySection');
        this.openaiKeySection = document.getElementById('openaiKeySection');
        this.deepseekKeySection = document.getElementById('deepseekKeySection');
        this.modelSelect = document.getElementById('modelSelect');
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
        
        // Improved Version section elements
        this.improvedVersionSection = document.getElementById('improvedVersionSection');
        this.improvedVersionContent = document.getElementById('improvedVersionContent');
        this.copyImprovedBtn = document.getElementById('copyImprovedBtn');
        
        // New enhanced AI Agent elements
        this.confidenceSection = document.getElementById('agentConfidenceSection');
        this.confidenceFillAgent = document.getElementById('confidenceFillAgent');
        this.confidenceValueAgent = document.getElementById('confidenceValueAgent');
        this.confidenceExplanation = document.getElementById('confidenceExplanation');
        this.sourcesSection = document.getElementById('sourcesSection');
        this.sourcesList = document.getElementById('sourcesList');
        this.practicalSection = document.getElementById('practicalSection');
        this.practicalContent = document.getElementById('practicalContent');
        this.nuancesSection = document.getElementById('nuancesSection');
        this.nuancesList = document.getElementById('nuancesList');
        this.quickFactsSection = document.getElementById('quickFactsSection');
        this.quickFactsList = document.getElementById('quickFactsList');
        this.misconceptionsSection = document.getElementById('misconceptionsSection');
        this.misconceptionsList = document.getElementById('misconceptionsList');
        this.expertSection = document.getElementById('expertSection');
        this.expertContent = document.getElementById('expertContent');
        this.clearHistoryBtn = document.getElementById('clearAgentHistory');
        
        // Current enhancement/email/agent data
        this.currentEnhancement = null;
        this.currentEmail = null;
        this.currentAgentResponse = null;
        
        // Agent conversation history for context-aware responses
        this.agentConversationHistory = JSON.parse(localStorage.getItem('agent_conversation_history') || '[]');
        
        // Speech recognition
        this.recognition = null;
        this.isRecording = false;
        
        // Text-to-speech state - enhanced for multi-sentence processing
        this.speechState = 'idle'; // 'idle', 'speaking', 'paused'
        this.currentUtterance = null;
        this.speechQueue = []; // Queue of sentences to speak
        this.currentSentenceIndex = 0; // Track position for resume
        this.speechPauseBetweenSentences = 400; // ms pause between sentences
        
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
        this.speakBtn.addEventListener('dblclick', () => this.stopSpeech()); // Double-click to stop completely
        this.micBtn.addEventListener('click', () => this.toggleSpeechRecognition());
        
        // Copy enhanced text
        this.copyEnhancedBtn.addEventListener('click', () => this.copyEnhancedText());
        
        // Copy email
        this.copyEmailBtn.addEventListener('click', () => this.copyEmail());
        
        // Copy agent response
        this.copyAgentBtn.addEventListener('click', () => this.copyAgentResponse());
        
        // Clear agent history
        if (this.clearHistoryBtn) {
            this.clearHistoryBtn.addEventListener('click', () => this.clearAgentHistory());
        }
        
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
        
        // Model selection change to toggle API key sections
        this.modelSelect.addEventListener('change', () => this.updateApiKeyVisibility());
        
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
            this.inputLabel.textContent = 'Enter Your Idea or Question';
            this.outputLabel.textContent = 'Strategic Analysis';
            this.inputText.placeholder = "Describe your business idea, strategy, or question for strategic analysis...\n\nExamples:\n• Enhanced Availability: Increase service coverage by expanding the fleet with 10 additional vehicles...\n• Launch a subscription model for our SaaS product with tiered pricing...\n• Implement an AI-powered customer support system to reduce response times...\n• Open a second location to capture the growing suburban market demand...";
            document.querySelector('.translate-btn .btn-text').textContent = 'Analyze';
            this.outputArea.innerHTML = '<div class="placeholder-text">Strategic analysis with enhancement ideas and follow-up questions will appear here...</div>';
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
        // Stop any ongoing speech
        this.stopSpeech();
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
            const synth = window.speechSynthesis;
            
            // Handle different states
            if (this.speechState === 'speaking') {
                // Currently speaking - pause it
                synth.pause();
                this.speechState = 'paused';
                this.updateSpeakButtonIcon('paused');
                this.showToast('Speech paused. Click to resume.', 'info');
            } else if (this.speechState === 'paused') {
                // Currently paused - resume it
                synth.resume();
                this.speechState = 'speaking';
                this.updateSpeakButtonIcon('speaking');
                this.showToast('Speech resumed.', 'info');
            } else {
                // Idle - start new speech with sentence processing
                synth.cancel();
                
                // Split text into sentences for better processing
                this.speechQueue = this.splitIntoSentences(this.currentTranslation.translation);
                this.currentSentenceIndex = 0;
                
                if (this.speechQueue.length === 0) {
                    this.showToast('No text to speak.', 'error');
                    return;
                }
                
                this.speechState = 'speaking';
                this.updateSpeakButtonIcon('speaking');
                this.speakNextSentence();
            }
        } else {
            this.showToast('Text-to-speech is not supported in your browser.', 'error');
        }
    }
    
    /**
     * Split text into sentences with intelligent handling of:
     * - Standard punctuation (. ! ?)
     * - Afrikaans abbreviations (mnr., mev., dr., prof., etc.)
     * - Numbers with decimals (3.14, R100.50)
     * - Ellipsis (...)
     * - Quoted speech
     * - Multiple punctuation marks
     */
    splitIntoSentences(text) {
        if (!text || typeof text !== 'string') return [];
        
        // Afrikaans and common abbreviations that shouldn't split sentences
        const abbreviations = [
            'mnr', 'mev', 'mej', 'dr', 'prof', 'ds', 'adv', 'me', 'sr', 'jr',
            'mr', 'mrs', 'ms', 'dr', 'prof', 'rev', 'hon', 'gen', 'col', 'lt',
            'st', 'vs', 'etc', 'eg', 'ie', 'no', 'nr', 'tel', 'fax', 'ref',
            'dept', 'govt', 'corp', 'inc', 'ltd', 'co', 'bpk', 'edms', 'pty'
        ];
        
        // Create regex pattern for abbreviations
        const abbrPattern = abbreviations.join('|');
        
        // Protect abbreviations by replacing periods temporarily
        let processed = text;
        const protectedItems = [];
        let protectIndex = 0;
        
        // Protect abbreviations (case insensitive)
        const abbrRegex = new RegExp(`\\b(${abbrPattern})\\.`, 'gi');
        processed = processed.replace(abbrRegex, (match) => {
            const placeholder = `__ABBR${protectIndex}__`;
            protectedItems.push({ placeholder, original: match });
            protectIndex++;
            return placeholder;
        });
        
        // Protect numbers with decimals (e.g., 3.14, R100.50, $99.99)
        processed = processed.replace(/(\d+)\.(\d+)/g, (match) => {
            const placeholder = `__NUM${protectIndex}__`;
            protectedItems.push({ placeholder, original: match });
            protectIndex++;
            return placeholder;
        });
        
        // Protect ellipsis
        processed = processed.replace(/\.{3,}/g, (match) => {
            const placeholder = `__ELL${protectIndex}__`;
            protectedItems.push({ placeholder, original: match });
            protectIndex++;
            return placeholder;
        });
        
        // Protect email addresses and URLs
        processed = processed.replace(/\S+@\S+\.\S+/g, (match) => {
            const placeholder = `__EMAIL${protectIndex}__`;
            protectedItems.push({ placeholder, original: match });
            protectIndex++;
            return placeholder;
        });
        
        processed = processed.replace(/https?:\/\/[^\s]+/g, (match) => {
            const placeholder = `__URL${protectIndex}__`;
            protectedItems.push({ placeholder, original: match });
            protectIndex++;
            return placeholder;
        });
        
        // Split on sentence-ending punctuation followed by space and capital letter or end
        // Also handle multiple punctuation (e.g., "What?!" or "Wow!!!")
        const sentenceEnders = /([.!?]+)(\s+|$)/g;
        const rawSentences = processed.split(sentenceEnders);
        
        // Reconstruct sentences (split creates groups)
        const sentences = [];
        let currentSentence = '';
        
        for (let i = 0; i < rawSentences.length; i++) {
            const part = rawSentences[i];
            if (!part) continue;
            
            // Check if this part is punctuation
            if (/^[.!?]+$/.test(part)) {
                currentSentence += part;
            } else if (/^\s+$/.test(part)) {
                // Whitespace after punctuation - sentence complete
                if (currentSentence.trim()) {
                    sentences.push(currentSentence.trim());
                    currentSentence = '';
                }
            } else {
                currentSentence += part;
            }
        }
        
        // Don't forget the last sentence
        if (currentSentence.trim()) {
            sentences.push(currentSentence.trim());
        }
        
        // Restore protected items in all sentences
        const restoredSentences = sentences.map(sentence => {
            let restored = sentence;
            protectedItems.forEach(item => {
                restored = restored.replace(item.placeholder, item.original);
            });
            return restored;
        });
        
        // Filter out empty sentences and very short fragments
        return restoredSentences.filter(s => s && s.length > 1);
    }
    
    /**
     * Speak the next sentence in the queue with natural pacing
     */
    speakNextSentence() {
        const synth = window.speechSynthesis;
        
        // Check if we've been stopped or completed
        if (this.speechState === 'idle' || this.currentSentenceIndex >= this.speechQueue.length) {
            this.completeSpeech();
            return;
        }
        
        const sentence = this.speechQueue[this.currentSentenceIndex];
        const utterance = new SpeechSynthesisUtterance(sentence);
        
        // Configure voice settings for natural speech
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Try to select a high-quality voice
        const voices = synth.getVoices();
        const preferredVoice = voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Natural'))
        ) || voices.find(v => v.lang.startsWith('en'));
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Handle sentence completion
        utterance.onend = () => {
            if (this.speechState !== 'idle') {
                this.currentSentenceIndex++;
                
                // Add natural pause between sentences
                if (this.currentSentenceIndex < this.speechQueue.length) {
                    setTimeout(() => {
                        if (this.speechState === 'speaking') {
                            this.speakNextSentence();
                        }
                    }, this.getPauseDuration(sentence));
                } else {
                    this.completeSpeech();
                }
            }
        };
        
        // Handle errors
        utterance.onerror = (event) => {
            if (event.error !== 'interrupted' && event.error !== 'canceled') {
                console.error('Speech synthesis error:', event.error);
                // Try to continue with next sentence
                this.currentSentenceIndex++;
                if (this.currentSentenceIndex < this.speechQueue.length && this.speechState === 'speaking') {
                    setTimeout(() => this.speakNextSentence(), 100);
                } else {
                    this.completeSpeech();
                }
            }
        };
        
        this.currentUtterance = utterance;
        synth.speak(utterance);
    }
    
    /**
     * Calculate appropriate pause duration based on sentence characteristics
     */
    getPauseDuration(sentence) {
        let pause = this.speechPauseBetweenSentences;
        
        // Longer pause after questions
        if (sentence.endsWith('?')) {
            pause += 150;
        }
        
        // Longer pause after exclamations
        if (sentence.endsWith('!')) {
            pause += 100;
        }
        
        // Longer pause after longer sentences
        if (sentence.length > 100) {
            pause += 150;
        }
        
        // Shorter pause for very short sentences
        if (sentence.length < 30) {
            pause -= 100;
        }
        
        // Ensure minimum pause
        return Math.max(pause, 200);
    }
    
    /**
     * Complete the speech and reset state
     */
    completeSpeech() {
        this.speechState = 'idle';
        this.currentUtterance = null;
        this.speechQueue = [];
        this.currentSentenceIndex = 0;
        this.updateSpeakButtonIcon('idle');
    }

    updateSpeakButtonIcon(state) {
        const speakBtn = this.speakBtn;
        if (!speakBtn) return;
        
        let iconPath;
        let title;
        
        // Remove all state classes
        speakBtn.classList.remove('speaking', 'paused');
        
        switch (state) {
            case 'speaking':
                // Pause icon
                iconPath = 'M6 19h4V5H6v14zm8-14v14h4V5h-4z';
                title = 'Pause speech';
                speakBtn.classList.add('speaking');
                break;
            case 'paused':
                // Play/Resume icon
                iconPath = 'M8 5v14l11-7z';
                title = 'Resume speech';
                speakBtn.classList.add('paused');
                break;
            default:
                // Speaker icon (idle)
                iconPath = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
                title = 'Listen to translation';
        }
        
        speakBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${iconPath}" fill="currentColor"/></svg>`;
        speakBtn.title = title;
    }
    
    stopSpeech() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            this.speechState = 'idle';
            this.currentUtterance = null;
            this.speechQueue = [];
            this.currentSentenceIndex = 0;
            this.updateSpeakButtonIcon('idle');
        }
    }
    
    showModal() {
        this.apiKeyInput.value = this.openrouterApiKey;
        this.openaiKeyInput.value = this.openaiApiKey;
        this.deepseekKeyInput.value = this.deepseekApiKey;
        this.modelSelect.value = this.model;
        this.updateApiKeyVisibility();
        this.apiKeyModal.classList.add('visible');
        this.apiKeyInput.focus();
    }
    
    updateApiKeyVisibility() {
        const model = this.modelSelect.value;
        
        // Hide all sections first
        this.openrouterKeySection.style.display = 'none';
        this.openaiKeySection.style.display = 'none';
        this.deepseekKeySection.style.display = 'none';
        
        // Show relevant section based on model
        if (model.startsWith('openai/')) {
            this.openaiKeySection.style.display = 'block';
        } else if (model.startsWith('deepseek/')) {
            this.deepseekKeySection.style.display = 'block';
        } else {
            this.openrouterKeySection.style.display = 'block';
        }
    }
    
    hideModal() {
        this.apiKeyModal.classList.remove('visible');
    }
    
    saveApiKey() {
        this.model = this.modelSelect.value;
        
        // Save all API keys
        const openrouterKey = this.apiKeyInput.value.trim();
        const openaiKey = this.openaiKeyInput.value.trim();
        const deepseekKey = this.deepseekKeyInput.value.trim();
        
        // Validate that the required key for selected model is provided
        if (this.model.startsWith('openai/') && !openaiKey) {
            this.showToast('Please enter your OpenAI API key.', 'error');
            return;
        }
        if (this.model.startsWith('deepseek/') && !deepseekKey) {
            this.showToast('Please enter your DeepSeek API key.', 'error');
            return;
        }
        if (this.model.startsWith('anthropic/') && !openrouterKey) {
            this.showToast('Please enter your OpenRouter API key.', 'error');
            return;
        }
        
        this.openrouterApiKey = openrouterKey;
        this.openaiApiKey = openaiKey;
        this.deepseekApiKey = deepseekKey;
        
        localStorage.setItem('openrouter_api_key', openrouterKey);
        localStorage.setItem('openai_api_key', openaiKey);
        localStorage.setItem('deepseek_api_key', deepseekKey);
        localStorage.setItem('openrouter_model', this.model);
        
        this.hideModal();
        this.showToast('Settings saved successfully!', 'success');
    }
    
    getApiConfig() {
        const model = this.model;
        
        if (model.startsWith('openai/')) {
            // OpenAI direct API
            const modelName = model.replace('openai/', '');
            
            // Check if it's an O1 model which has special requirements
            const isO1Model = modelName.startsWith('o1');
            
            return {
                endpoint: 'https://api.openai.com/v1/chat/completions',
                apiKey: this.openaiApiKey,
                model: modelName,
                isO1Model: isO1Model,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiApiKey}`
                }
            };
        } else if (model.startsWith('deepseek/')) {
            // DeepSeek direct API
            const modelName = model.replace('deepseek/', '');
            return {
                endpoint: 'https://api.deepseek.com/v1/chat/completions',
                apiKey: this.deepseekApiKey,
                model: modelName,
                isO1Model: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.deepseekApiKey}`
                }
            };
        } else {
            // OpenRouter API
            return {
                endpoint: 'https://openrouter.ai/api/v1/chat/completions',
                apiKey: this.openrouterApiKey,
                model: model,
                isO1Model: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openrouterApiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Afrikaans to English Translator'
                }
            };
        }
    }
    
    async handleApiError(response, apiConfig) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            model: apiConfig.model,
            endpoint: apiConfig.endpoint,
            isO1Model: apiConfig.isO1Model
        });
        
        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your API key in settings.');
        } else if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 400) {
            const errorMsg = errorData.error?.message || 'Bad request. Model may not exist or parameters invalid.';
            throw new Error(errorMsg);
        } else if (response.status === 404) {
            throw new Error('Model not found. The model name may be incorrect.');
        } else {
            throw new Error(errorData.error?.message || `API error: ${response.status} - ${response.statusText}`);
        }
    }
    
    async translate() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showToast('Please enter some Afrikaans text to translate.', 'error');
            return;
        }
        
        // Stop any ongoing speech before starting new translation
        this.stopSpeech();
        
        // Validate API key for selected model
        const apiConfig = this.getApiConfig();
        if (!apiConfig.apiKey) {
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

        const apiConfig = this.getApiConfig();
        
        // O1 models don't support system messages, so we need to combine them into user message
        const messages = apiConfig.isO1Model 
            ? [{ role: 'user', content: `${systemPrompt}\n\n---\n\nTranslate the following Afrikaans text to English, provide comprehensive linguistic analysis, AND analyze the content's domain to provide intelligent insights, strategic recommendations, and alternative approaches:\n\n"${text}"` }]
            : [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Translate the following Afrikaans text to English, provide comprehensive linguistic analysis, AND analyze the content's domain to provide intelligent insights, strategic recommendations, and alternative approaches:\n\n"${text}"` }
            ];
        
        const requestBody = {
            model: apiConfig.model,
            messages: messages,
            max_tokens: 4000
        };
        
        // O1 models don't support temperature parameter
        if (!apiConfig.isO1Model) {
            requestBody.temperature = 0.3;
        }
        
        console.log('Translation API Call:', { endpoint: apiConfig.endpoint, model: apiConfig.model, isO1: apiConfig.isO1Model });
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            await this.handleApiError(response, apiConfig);
        }
        
        const data = await response.json();
        console.log('Translation Response OK');
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
        
        // Validate API key for selected model
        const apiConfig = this.getApiConfig();
        if (!apiConfig.apiKey) {
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

        const apiConfig = this.getApiConfig();
        
        const messages = apiConfig.isO1Model 
            ? [{ role: 'user', content: `${systemPrompt}\n\n---\n\nPlease enhance the following text. Provide improved sentence structure, suggestions for additions, and ideas to enhance the information:\n\n"${text}"` }]
            : [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Please enhance the following text. Provide improved sentence structure, suggestions for additions, and ideas to enhance the information:\n\n"${text}"` }
            ];
        
        const requestBody = {
            model: apiConfig.model,
            messages: messages,
            max_tokens: 4000
        };
        
        if (!apiConfig.isO1Model) {
            requestBody.temperature = 0.4;
        }
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
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
        
        // Validate API key for selected model
        const apiConfig = this.getApiConfig();
        if (!apiConfig.apiKey) {
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

        const apiConfig = this.getApiConfig();
        
        const messages = apiConfig.isO1Model 
            ? [{ role: 'user', content: `${systemPrompt}\n\n---\n\nTranslate the following Afrikaans email text to English and format it as a professional email ready for copy-pasting:\n\n"${text}"` }]
            : [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Translate the following Afrikaans email text to English and format it as a professional email ready for copy-pasting:\n\n"${text}"` }
            ];
        
        const requestBody = {
            model: apiConfig.model,
            messages: messages,
            max_tokens: 3000
        };
        
        if (!apiConfig.isO1Model) {
            requestBody.temperature = 0.3;
        }
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
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
        
        // Override the signature with Heinrich's signature
        this.currentEmail.signature = this.emailSignaturePlainText;
        
        // Format the full email for display with the proper signature
        const formattedEmail = `${result.greeting}\n\n${result.body}\n\n${result.closing}\n\n${this.emailSignaturePlainText}`;
        
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
        
        const updatedEmail = `${greeting}\n\n${this.currentEmail.body}\n\n${closing}\n\n${this.emailSignaturePlainText}`;
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
        
        // Validate API key for selected model
        const apiConfig = this.getApiConfig();
        if (!apiConfig.apiKey) {
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
        // Build conversation history context
        const historyContext = this.agentConversationHistory.length > 0 
            ? `\n\nPrevious conversation context:\n${this.agentConversationHistory.slice(-5).map((h, i) => `Q${i+1}: ${h.question}\nA${i+1}: ${h.summary}`).join('\n\n')}\n\n---\nContinuing the conversation:`
            : '';
        
        const systemPrompt = `You are an expert AI Strategic Advisor. Your role is to analyze input, provide strategic insights, and most importantly provide an IMPROVED VERSION of the content that can be copied and used directly.

CORE PRINCIPLES:
1. IMPROVED VERSION FIRST: Always provide an enhanced, polished version of the input that can be copy-pasted
2. STRUCTURED RESPONSES: Organize analysis under clear headings with bullet points
3. STRATEGIC THINKING: Analyze from multiple angles - operational, financial, customer, competitive
4. ACTIONABLE INSIGHTS: Every suggestion should be implementable
5. CONTINUOUS DIALOGUE: End with questions users can ask AND suggested questions about the content

RESPONSE FORMAT - Always use this exact JSON structure:
{
    "summary": "A 2-3 sentence executive summary of your analysis",
    
    "improvedVersion": {
        "title": "Enhanced/Improved Version",
        "content": "The complete improved version of their content. This should be a polished, enhanced version that incorporates your suggestions and can be directly copied and used. Format it professionally with proper headings and bullet points using markdown. Make it comprehensive and ready-to-use."
    },
    
    "strategicAnalysis": {
        "strengths": [
            "• Strength point 1 with explanation",
            "• Strength point 2 with explanation"
        ],
        "gaps": [
            "• Gap or weakness 1 - what's missing",
            "• Gap or weakness 2 - potential risk"
        ],
        "opportunities": [
            "• Opportunity 1 - how to capitalize",
            "• Opportunity 2 - growth potential"
        ]
    },
    
    "enhancementIdeas": [
        {
            "heading": "Clear Heading for Enhancement Area",
            "points": [
                "• Specific improvement suggestion 1",
                "• Specific improvement suggestion 2",
                "• Implementation consideration"
            ],
            "impact": "high|medium|low",
            "effort": "high|medium|low"
        }
    ],
    
    "strategicFramework": {
        "shortTerm": [
            "• Quick win action 1 (0-3 months)",
            "• Quick win action 2"
        ],
        "mediumTerm": [
            "• Strategic initiative 1 (3-6 months)",
            "• Strategic initiative 2"
        ],
        "longTerm": [
            "• Transformational goal 1 (6-12+ months)",
            "• Transformational goal 2"
        ]
    },
    
    "keyMetrics": [
        {
            "metric": "KPI name",
            "target": "Suggested target",
            "rationale": "Why this matters"
        }
    ],
    
    "riskConsiderations": [
        {
            "risk": "Potential risk",
            "mitigation": "How to address it",
            "severity": "high|medium|low"
        }
    ],
    
    "implementationChecklist": [
        "☐ Action item 1 - with owner suggestion",
        "☐ Action item 2 - with timeline",
        "☐ Action item 3 - with dependencies"
    ],
    
    "suggestedQuestions": [
        {
            "question": "Question user can ask to explore deeper",
            "purpose": "What asking this would reveal",
            "category": "operational|financial|customer|competitive|growth|clarification"
        },
        {
            "question": "Question about specific aspect of the content",
            "purpose": "Why this is worth exploring",
            "category": "operational|financial|customer|competitive|growth|clarification"
        },
        {
            "question": "Question to challenge or refine the strategy",
            "purpose": "How this helps improve the thinking",
            "category": "operational|financial|customer|competitive|growth|clarification"
        },
        {
            "question": "Question about implementation or next steps",
            "purpose": "Practical value of this question",
            "category": "operational|financial|customer|competitive|growth|clarification"
        },
        {
            "question": "Question about measuring success",
            "purpose": "Importance of metrics/tracking",
            "category": "operational|financial|customer|competitive|growth|clarification"
        }
    ],
    
    "additionalConsiderations": [
        "• Important factor not mentioned in original input",
        "• Industry trend to consider",
        "• Stakeholder perspective to account for"
    ],
    
    "confidence": {
        "level": "high|medium|low",
        "score": 0.0-1.0,
        "explanation": "Basis for confidence level"
    }
}

IMPROVED VERSION GUIDELINES:
1. Make it comprehensive and complete - user should be able to copy and use directly
2. Incorporate the enhancements you suggest into the improved version
3. Use professional formatting with clear headings and bullet points
4. Expand on brief points to make them more impactful
5. Add any missing elements that would strengthen the content
6. Keep the original intent while elevating the quality

SUGGESTED QUESTIONS MUST:
- Be directly relevant to the content provided
- Help user think deeper about their strategy
- Include questions they might not have thought to ask
- Cover different aspects: implementation, measurement, risks, alternatives
- Be phrased in first person ("How can I..." "What should I consider...")

Always respond with valid JSON only, no additional text.`;

        const apiConfig = this.getApiConfig();
        
        const messages = apiConfig.isO1Model 
            ? [{ role: 'user', content: `${systemPrompt}\n\n---\n\n${historyContext}Analyze the following input strategically. Provide structured improvement ideas under clear headings with bullet points. Then ask probing questions to continue exploring this topic:\n\n"${text}"` }]
            : [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `${historyContext}Analyze the following input strategically. Provide structured improvement ideas under clear headings with bullet points. Then ask probing questions to continue exploring this topic:\n\n"${text}"` }
            ];
        
        const requestBody = {
            model: apiConfig.model,
            messages: messages,
            max_tokens: 6000
        };
        
        if (!apiConfig.isO1Model) {
            requestBody.temperature = 0.4;
        }
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
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
        
        // Save to conversation history
        const historyEntry = {
            question: this.inputText.value.trim(),
            summary: result.summary || '',
            timestamp: new Date().toISOString()
        };
        this.agentConversationHistory.push(historyEntry);
        if (this.agentConversationHistory.length > 10) {
            this.agentConversationHistory = this.agentConversationHistory.slice(-10);
        }
        localStorage.setItem('agent_conversation_history', JSON.stringify(this.agentConversationHistory));
        
        // Display summary in output area
        if (result.summary) {
            this.outputArea.innerHTML = `
                <div class="translation-text" style="white-space: pre-wrap; line-height: 1.6;">
                    <div class="direct-answer">${this.escapeHtml(result.summary)}</div>
                    ${result.confidence ? `
                        <div class="inline-confidence ${result.confidence.level}">
                            <span class="confidence-indicator"></span>
                            <span>${Math.round(result.confidence.score * 100)}% confidence</span>
                        </div>
                    ` : ''}
                </div>`;
        }
        
        // Show agent section
        this.agentSection.classList.add('visible');
        
        // Display summary/answer
        if (result.summary) {
            this.answerSection.classList.add('visible');
            this.agentAnswer.innerHTML = `<div class="direct-answer-main">${this.escapeHtml(result.summary)}</div>`;
        }
        
        // Display Improved Version (THE KEY FEATURE - copy-ready content)
        if (result.improvedVersion && this.improvedVersionSection) {
            this.improvedVersionSection.classList.add('visible');
            const improvedContent = result.improvedVersion.content || '';
            this.improvedVersionContent.innerHTML = `
                <div class="improved-version-text">${this.formatMarkdown(improvedContent)}</div>
            `;
            
            // Set up copy button for improved version
            if (this.copyImprovedBtn) {
                this.copyImprovedBtn.onclick = () => this.copyImprovedVersion();
            }
        } else if (this.improvedVersionSection) {
            this.improvedVersionSection.classList.remove('visible');
        }
        
        // Display confidence score
        if (result.confidence && this.confidenceSection) {
            this.confidenceSection.classList.add('visible');
            const percentage = Math.round(result.confidence.score * 100);
            if (this.confidenceFillAgent) {
                this.confidenceFillAgent.style.width = `${percentage}%`;
                this.confidenceFillAgent.className = `confidence-fill ${result.confidence.level}`;
            }
            if (this.confidenceValueAgent) {
                this.confidenceValueAgent.textContent = `${percentage}%`;
            }
            if (this.confidenceExplanation) {
                this.confidenceExplanation.textContent = result.confidence.explanation || '';
            }
        } else if (this.confidenceSection) {
            this.confidenceSection.classList.remove('visible');
        }
        
        // Display Strategic Analysis (Strengths, Gaps, Opportunities)
        if (result.strategicAnalysis && this.keyInsightsSection) {
            this.keyInsightsSection.classList.add('visible');
            let analysisHtml = '';
            
            if (result.strategicAnalysis.strengths && result.strategicAnalysis.strengths.length > 0) {
                analysisHtml += `<div class="analysis-group strengths">
                    <h4>💪 Strengths</h4>
                    <ul>${result.strategicAnalysis.strengths.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}</ul>
                </div>`;
            }
            if (result.strategicAnalysis.gaps && result.strategicAnalysis.gaps.length > 0) {
                analysisHtml += `<div class="analysis-group gaps">
                    <h4>⚠️ Gaps & Weaknesses</h4>
                    <ul>${result.strategicAnalysis.gaps.map(g => `<li>${this.escapeHtml(g)}</li>`).join('')}</ul>
                </div>`;
            }
            if (result.strategicAnalysis.opportunities && result.strategicAnalysis.opportunities.length > 0) {
                analysisHtml += `<div class="analysis-group opportunities">
                    <h4>🚀 Opportunities</h4>
                    <ul>${result.strategicAnalysis.opportunities.map(o => `<li>${this.escapeHtml(o)}</li>`).join('')}</ul>
                </div>`;
            }
            this.keyInsightsList.innerHTML = analysisHtml;
        } else {
            this.keyInsightsSection?.classList.remove('visible');
        }
        
        // Display Enhancement Ideas
        if (result.enhancementIdeas && result.enhancementIdeas.length > 0 && this.practicalSection) {
            this.practicalSection.classList.add('visible');
            this.practicalContent.innerHTML = result.enhancementIdeas.map(idea => `
                <div class="enhancement-card">
                    <div class="enhancement-header">
                        <h4>${this.escapeHtml(idea.heading)}</h4>
                        <div class="enhancement-badges">
                            ${idea.impact ? `<span class="impact-badge ${idea.impact}">${idea.impact} impact</span>` : ''}
                            ${idea.effort ? `<span class="effort-badge ${idea.effort}">${idea.effort} effort</span>` : ''}
                        </div>
                    </div>
                    <ul class="enhancement-points">
                        ${idea.points.map(p => `<li>${this.escapeHtml(p)}</li>`).join('')}
                    </ul>
                </div>
            `).join('');
        } else if (this.practicalSection) {
            this.practicalSection.classList.remove('visible');
        }
        
        // Display Strategic Framework (Short/Medium/Long Term)
        if (result.strategicFramework && this.quickFactsSection) {
            this.quickFactsSection.classList.add('visible');
            let frameworkHtml = '';
            
            if (result.strategicFramework.shortTerm && result.strategicFramework.shortTerm.length > 0) {
                frameworkHtml += `<div class="timeline-section short-term">
                    <h4>⚡ Short Term (0-3 months)</h4>
                    <ul>${result.strategicFramework.shortTerm.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}</ul>
                </div>`;
            }
            if (result.strategicFramework.mediumTerm && result.strategicFramework.mediumTerm.length > 0) {
                frameworkHtml += `<div class="timeline-section medium-term">
                    <h4>📈 Medium Term (3-6 months)</h4>
                    <ul>${result.strategicFramework.mediumTerm.map(m => `<li>${this.escapeHtml(m)}</li>`).join('')}</ul>
                </div>`;
            }
            if (result.strategicFramework.longTerm && result.strategicFramework.longTerm.length > 0) {
                frameworkHtml += `<div class="timeline-section long-term">
                    <h4>🎯 Long Term (6-12+ months)</h4>
                    <ul>${result.strategicFramework.longTerm.map(l => `<li>${this.escapeHtml(l)}</li>`).join('')}</ul>
                </div>`;
            }
            this.quickFactsList.innerHTML = frameworkHtml;
        } else if (this.quickFactsSection) {
            this.quickFactsSection.classList.remove('visible');
        }
        
        // Display Risk Considerations
        if (result.riskConsiderations && result.riskConsiderations.length > 0 && this.nuancesSection) {
            this.nuancesSection.classList.add('visible');
            this.nuancesList.innerHTML = result.riskConsiderations.map(risk => `
                <div class="risk-card ${risk.severity}">
                    <div class="risk-header">
                        <span class="risk-icon">${risk.severity === 'high' ? '🔴' : risk.severity === 'medium' ? '🟡' : '🟢'}</span>
                        <span class="risk-text">${this.escapeHtml(risk.risk)}</span>
                    </div>
                    <div class="risk-mitigation">
                        <strong>Mitigation:</strong> ${this.escapeHtml(risk.mitigation)}
                    </div>
                </div>
            `).join('');
        } else if (this.nuancesSection) {
            this.nuancesSection.classList.remove('visible');
        }
        
        // Display Key Metrics
        if (result.keyMetrics && result.keyMetrics.length > 0 && this.sourcesSection) {
            this.sourcesSection.classList.add('visible');
            this.sourcesList.innerHTML = `<div class="metrics-container">${result.keyMetrics.map(metric => `
                <div class="metric-card">
                    <div class="metric-name">${this.escapeHtml(metric.metric)}</div>
                    <div class="metric-target">Target: ${this.escapeHtml(metric.target)}</div>
                    <div class="metric-rationale">${this.escapeHtml(metric.rationale)}</div>
                </div>
            `).join('')}</div>`;
        } else if (this.sourcesSection) {
            this.sourcesSection.classList.remove('visible');
        }
        
        // Display Implementation Checklist
        if (result.implementationChecklist && result.implementationChecklist.length > 0 && this.misconceptionsSection) {
            this.misconceptionsSection.classList.add('visible');
            this.misconceptionsList.innerHTML = `<div class="checklist-container">
                ${result.implementationChecklist.map(item => `
                    <div class="checklist-item">${this.escapeHtml(item)}</div>
                `).join('')}
            </div>`;
        } else if (this.misconceptionsSection) {
            this.misconceptionsSection.classList.remove('visible');
        }
        
        // Display Additional Considerations
        if (result.additionalConsiderations && result.additionalConsiderations.length > 0 && this.expertSection) {
            this.expertSection.classList.add('visible');
            this.expertContent.innerHTML = `
                <div class="considerations-list">
                    <ul>${result.additionalConsiderations.map(c => `<li>${this.escapeHtml(c)}</li>`).join('')}</ul>
                </div>
            `;
        } else if (this.expertSection) {
            this.expertSection.classList.remove('visible');
        }
        
        // Display Suggested Questions - clickable questions user can ask
        if (result.suggestedQuestions && result.suggestedQuestions.length > 0) {
            this.relatedQuestionsSection.classList.add('visible');
            this.relatedQuestionsList.innerHTML = `
                <div class="suggested-questions-intro">
                    <span class="intro-icon">💬</span>
                    <span>Click any question to ask, or type your own question below:</span>
                </div>
                <div class="suggested-questions-grid">
                    ${result.suggestedQuestions.map(q => `
                        <div class="suggested-question-card" onclick="document.getElementById('followUpInput').value = '${this.escapeHtml(q.question).replace(/'/g, "\\'")}'; document.getElementById('followUpInput').focus();">
                            <span class="question-category-icon">${this.getCategoryIcon(q.category)}</span>
                            <div class="question-details">
                                <span class="question-text">${this.escapeHtml(q.question)}</span>
                                <span class="question-purpose">${this.escapeHtml(q.purpose)}</span>
                            </div>
                            <span class="question-category-tag ${q.category}">${this.escapeHtml(q.category)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="follow-up-input-container">
                    <input type="text" id="followUpInput" class="follow-up-input" placeholder="Type your question about this content..." />
                    <button class="follow-up-submit-btn" id="followUpSubmitBtn" title="Ask question">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            `;
            
            // Bind follow-up input events
            const followUpInput = document.getElementById('followUpInput');
            const followUpSubmitBtn = document.getElementById('followUpSubmitBtn');
            
            if (followUpInput && followUpSubmitBtn) {
                followUpSubmitBtn.onclick = () => this.askFollowUpQuestion();
                followUpInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.askFollowUpQuestion();
                    }
                });
            }
        } else {
            this.relatedQuestionsSection?.classList.remove('visible');
        }
        
        // Hide unused sections
        this.expandedIdeasSection?.classList.remove('visible');
        this.actionItemsSection?.classList.remove('visible');
        this.resourcesSection?.classList.remove('visible');
        
        // Bind copy agent button
        this.copyAgentBtn.onclick = () => this.copyAgentResponse();
    }
    
    formatMarkdown(text) {
        // Simple markdown formatting
        let formatted = this.escapeHtml(text);
        // Bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Headers
        formatted = formatted.replace(/^### (.*$)/gim, '<h5>$1</h5>');
        formatted = formatted.replace(/^## (.*$)/gim, '<h4>$1</h4>');
        formatted = formatted.replace(/^# (.*$)/gim, '<h3>$1</h3>');
        // Bullet points
        formatted = formatted.replace(/^[•\-\*] (.*$)/gim, '<li>$1</li>');
        // Wrap consecutive li elements in ul
        formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        // Line breaks
        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        return `<p>${formatted}</p>`;
    }
    
    async askFollowUpQuestion() {
        const followUpInput = document.getElementById('followUpInput');
        if (!followUpInput) return;
        
        const question = followUpInput.value.trim();
        if (!question) {
            this.showToast('Please enter a question', 'error');
            return;
        }
        
        // Add context about what we're asking about
        const contextualQuestion = `Regarding the previous analysis, I have a follow-up question: ${question}`;
        
        // Set the main input and trigger the agent
        this.inputText.value = contextualQuestion;
        followUpInput.value = '';
        
        // Scroll to top and trigger analysis
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.askAgent();
    }
    
    async copyImprovedVersion() {
        if (!this.currentAgentResponse || !this.currentAgentResponse.improvedVersion) {
            this.showToast('No improved version to copy.', 'error');
            return;
        }
        
        const content = this.currentAgentResponse.improvedVersion.content;
        
        try {
            await navigator.clipboard.writeText(content);
            this.showToast('Improved version copied to clipboard!', 'success');
        } catch (err) {
            this.showToast('Failed to copy. Please select and copy manually.', 'error');
        }
    }
    
    getCategoryIcon(category) {
        const icons = {
            'operational': '⚙️',
            'financial': '💰',
            'customer': '👥',
            'competitive': '🏆',
            'growth': '📈',
            'clarification': '❓'
        };
        return icons[category] || '💭';
    }
    
    hideAgent() {
        this.agentSection.classList.remove('visible');
        this.answerSection.classList.remove('visible');
        this.improvedVersionSection?.classList.remove('visible');
        this.keyInsightsSection.classList.remove('visible');
        this.expandedIdeasSection?.classList.remove('visible');
        this.actionItemsSection?.classList.remove('visible');
        this.relatedQuestionsSection.classList.remove('visible');
        this.resourcesSection?.classList.remove('visible');
        this.confidenceSection?.classList.remove('visible');
        this.sourcesSection?.classList.remove('visible');
        this.practicalSection?.classList.remove('visible');
        this.nuancesSection?.classList.remove('visible');
        this.quickFactsSection?.classList.remove('visible');
        this.misconceptionsSection?.classList.remove('visible');
        this.expertSection?.classList.remove('visible');
    }
    
    clearAgentHistory() {
        this.agentConversationHistory = [];
        localStorage.removeItem('agent_conversation_history');
        this.showToast('Conversation history cleared', 'success');
    }
    
    async copyAgentResponse() {
        if (!this.currentAgentResponse) {
            this.showToast('No analysis to copy.', 'error');
            return;
        }
        
        // Format the response as readable text for the new strategic format
        let text = '';
        const r = this.currentAgentResponse;
        
        if (r.summary) {
            text += `EXECUTIVE SUMMARY\n${'='.repeat(50)}\n${r.summary}\n\n`;
        }
        
        if (r.confidence) {
            text += `Confidence: ${Math.round(r.confidence.score * 100)}% (${r.confidence.level})\n`;
            if (r.confidence.explanation) text += `${r.confidence.explanation}\n`;
            text += '\n';
        }
        
        if (r.strategicAnalysis) {
            text += `STRATEGIC ANALYSIS\n${'='.repeat(50)}\n`;
            if (r.strategicAnalysis.strengths?.length > 0) {
                text += `\n💪 STRENGTHS:\n`;
                r.strategicAnalysis.strengths.forEach(s => text += `${s}\n`);
            }
            if (r.strategicAnalysis.gaps?.length > 0) {
                text += `\n⚠️ GAPS & WEAKNESSES:\n`;
                r.strategicAnalysis.gaps.forEach(g => text += `${g}\n`);
            }
            if (r.strategicAnalysis.opportunities?.length > 0) {
                text += `\n🚀 OPPORTUNITIES:\n`;
                r.strategicAnalysis.opportunities.forEach(o => text += `${o}\n`);
            }
            text += '\n';
        }
        
        // Add Improved Version section - Copy Ready
        if (r.improvedVersion) {
            text += `\n${'='.repeat(50)}\n`;
            text += `✨ ${r.improvedVersion.title || 'IMPROVED VERSION'}\n`;
            text += `${'='.repeat(50)}\n`;
            text += `${r.improvedVersion.content}\n\n`;
        }
        
        if (r.enhancementIdeas?.length > 0) {
            text += `ENHANCEMENT IDEAS\n${'='.repeat(50)}\n`;
            r.enhancementIdeas.forEach(idea => {
                text += `\n📌 ${idea.heading}\n`;
                text += `   Impact: ${idea.impact || 'N/A'} | Effort: ${idea.effort || 'N/A'}\n`;
                idea.points.forEach(p => text += `   ${p}\n`);
            });
            text += '\n';
        }
        
        if (r.strategicFramework) {
            text += `STRATEGIC TIMELINE\n${'='.repeat(50)}\n`;
            if (r.strategicFramework.shortTerm?.length > 0) {
                text += `\n⚡ SHORT TERM (0-3 months):\n`;
                r.strategicFramework.shortTerm.forEach(s => text += `${s}\n`);
            }
            if (r.strategicFramework.mediumTerm?.length > 0) {
                text += `\n📈 MEDIUM TERM (3-6 months):\n`;
                r.strategicFramework.mediumTerm.forEach(m => text += `${m}\n`);
            }
            if (r.strategicFramework.longTerm?.length > 0) {
                text += `\n🎯 LONG TERM (6-12+ months):\n`;
                r.strategicFramework.longTerm.forEach(l => text += `${l}\n`);
            }
            text += '\n';
        }
        
        if (r.keyMetrics?.length > 0) {
            text += `KEY METRICS & KPIs\n${'='.repeat(50)}\n`;
            r.keyMetrics.forEach(m => {
                text += `• ${m.metric}: ${m.target}\n  ${m.rationale}\n`;
            });
            text += '\n';
        }
        
        if (r.riskConsiderations?.length > 0) {
            text += `RISK CONSIDERATIONS\n${'='.repeat(50)}\n`;
            r.riskConsiderations.forEach(risk => {
                text += `• [${risk.severity?.toUpperCase() || 'MEDIUM'}] ${risk.risk}\n`;
                text += `  Mitigation: ${risk.mitigation}\n`;
            });
            text += '\n';
        }
        
        if (r.implementationChecklist?.length > 0) {
            text += `IMPLEMENTATION CHECKLIST\n${'='.repeat(50)}\n`;
            r.implementationChecklist.forEach(item => text += `${item}\n`);
            text += '\n';
        }
        
        if (r.additionalConsiderations?.length > 0) {
            text += `ADDITIONAL CONSIDERATIONS\n${'='.repeat(50)}\n`;
            r.additionalConsiderations.forEach(c => text += `${c}\n`);
            text += '\n';
        }
        
        // Updated to use suggestedQuestions instead of probingQuestions
        if (r.suggestedQuestions?.length > 0) {
            text += `SUGGESTED QUESTIONS\n${'='.repeat(50)}\n`;
            r.suggestedQuestions.forEach((q, i) => {
                text += `${i + 1}. ${q.question}\n`;
                text += `   Purpose: ${q.purpose}\n`;
                text += `   Category: ${q.category}\n\n`;
            });
        } else if (r.probingQuestions?.length > 0) {
            text += `CONTINUE THE CONVERSATION\n${'='.repeat(50)}\n`;
            r.probingQuestions.forEach((q, i) => {
                text += `${i + 1}. ${q.question}\n`;
                text += `   Purpose: ${q.purpose}\n`;
                text += `   Category: ${q.category}\n\n`;
            });
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
        
        // Get the current greeting and closing
        let greeting = this.currentEmail.greeting;
        let closing = this.currentEmail.closing;
        
        const selectedGreeting = this.greetingOptions.querySelector('.greeting-option.selected');
        if (selectedGreeting) greeting = selectedGreeting.dataset.greeting;
        
        const selectedClosing = this.closingOptions.querySelector('.closing-option.selected');
        if (selectedClosing) closing = selectedClosing.dataset.closing;
        
        // Build plain text version
        const plainTextEmail = `${greeting}\n\n${this.currentEmail.body}\n\n${closing}\n\n${this.emailSignaturePlainText}`;
        
        // Build HTML version with rich signature
        const htmlEmail = `<div>${greeting.replace(/\n/g, '<br>')}</div>
<br>
<div>${this.currentEmail.body.replace(/\n\n/g, '</div><br><div>').replace(/\n/g, '<br>')}</div>
<br>
<div>${closing.replace(/\n/g, '<br>')}</div>
<br>
${this.emailSignatureHTML}`;
        
        try {
            // Try to copy both plain text and HTML for rich paste support
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([plainTextEmail], { type: 'text/plain' }),
                'text/html': new Blob([htmlEmail], { type: 'text/html' })
            });
            await navigator.clipboard.write([clipboardItem]);
            this.showToast('Email with signature copied! Paste in email client for formatted signature.', 'success');
        } catch (err) {
            // Fallback to plain text copy
            try {
                await navigator.clipboard.writeText(plainTextEmail);
                this.showToast('Email copied to clipboard!', 'success');
            } catch (err2) {
                this.showToast('Failed to copy. Please select and copy manually.', 'error');
            }
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
