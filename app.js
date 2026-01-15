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
        this.anthropicApiKey = localStorage.getItem('anthropic_api_key') || '';
        this.googleApiKey = localStorage.getItem('google_api_key') || '';
        this.grokApiKey = localStorage.getItem('grok_api_key') || '';
        this.morphApiKey = localStorage.getItem('morph_api_key') || '';
        this.groqApiKey = localStorage.getItem('groq_api_key') || '';
        this.togetherApiKey = localStorage.getItem('together_api_key') || '';
        this.ollamaUrl = localStorage.getItem('ollama_url') || 'http://localhost:11434';
        
        // Current provider and model
        this.currentProvider = localStorage.getItem('current_provider') || 'openrouter';
        
        // Load model based on current provider
        this.model = this.getModelForProvider(this.currentProvider);
        
        // Model Fallback & Retry Configuration
        this.fallbackEnabled = localStorage.getItem('fallback_enabled') !== 'false'; // Default enabled
        this.maxRetries = 3;
        this.retryDelayMs = 1000; // Base delay for exponential backoff
        
        // Model health tracking (stored in memory, reset on page load)
        this.modelHealth = {}; // { modelId: { failures: 0, lastFailure: timestamp, available: true } }
        
        // Fallback model chains - ordered by priority (most reliable first)
        // These are OpenRouter models that typically have higher rate limits
        this.fallbackChains = {
            openrouter: [
                'anthropic/claude-3.5-sonnet',
                'anthropic/claude-3-haiku',
                'openai/gpt-4o-mini',
                'openai/gpt-4o',
                'google/gemini-1.5-flash',
                'google/gemini-1.5-pro',
                'meta-llama/llama-3.1-70b-instruct',
                'mistralai/mistral-large',
                'deepseek/deepseek-chat'
            ],
            anthropic: [
                'claude-3-5-sonnet-20241022',
                'claude-3-haiku-20240307',
                'claude-3-opus-20240229'
            ],
            openai: [
                'gpt-4o-mini',
                'gpt-4o',
                'gpt-4-turbo',
                'gpt-3.5-turbo'
            ],
            google: [
                'gemini-1.5-flash',
                'gemini-1.5-pro',
                'gemini-pro'
            ],
            deepseek: [
                'deepseek-chat',
                'deepseek-coder'
            ],
            grok: [
                'grok-beta'
            ],
            morph: [
                'morph-v1'
            ],
            groq: [
                'llama-3.3-70b-versatile',
                'llama-3.1-8b-instant',
                'qwen/qwen3-32b',
                'deepseek-r1-distill-llama-70b'
            ],
            together: [
                'meta-llama/Llama-3.3-70B-Instruct-Turbo',
                'meta-llama/Llama-3.2-3B-Instruct-Turbo',
                'mistralai/Mixtral-8x7B-Instruct-v0.1',
                'Qwen/Qwen2.5-7B-Instruct-Turbo'
            ],
            ollama: [
                'llama3.2',
                'llama3.1',
                'mistral',
                'qwen2.5'
            ]
        };
        
        // Cross-provider fallback order (when all models in a provider fail)
        this.providerFallbackOrder = ['openrouter', 'groq', 'ollama', 'together', 'openai', 'anthropic', 'google', 'deepseek', 'grok', 'morph'];
        
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
        this.anthropicKeyInput = document.getElementById('anthropicKeyInput');
        this.googleKeyInput = document.getElementById('googleKeyInput');
        this.grokKeyInput = document.getElementById('grokKeyInput');
        this.morphKeyInput = document.getElementById('morphKeyInput');
        this.groqKeyInput = document.getElementById('groqKeyInput');
        this.togetherKeyInput = document.getElementById('togetherKeyInput');
        this.ollamaUrlInput = document.getElementById('ollamaUrlInput');
        
        // Provider tabs and sections
        this.providerTabs = document.getElementById('providerTabs');
        this.openrouterSection = document.getElementById('openrouterSection');
        this.anthropicSection = document.getElementById('anthropicSection');
        this.openaiSection = document.getElementById('openaiSection');
        this.googleSection = document.getElementById('googleSection');
        this.deepseekSection = document.getElementById('deepseekSection');
        this.grokSection = document.getElementById('grokSection');
        this.morphSection = document.getElementById('morphSection');
        this.groqSection = document.getElementById('groqSection');
        this.togetherSection = document.getElementById('togetherSection');
        this.ollamaSection = document.getElementById('ollamaSection');
        
        // Model selects for each provider
        this.openrouterModelSelect = document.getElementById('openrouterModelSelect');
        this.anthropicModelSelect = document.getElementById('anthropicModelSelect');
        this.openaiModelSelect = document.getElementById('openaiModelSelect');
        this.googleModelSelect = document.getElementById('googleModelSelect');
        this.deepseekModelSelect = document.getElementById('deepseekModelSelect');
        this.grokModelSelect = document.getElementById('grokModelSelect');
        this.morphModelSelect = document.getElementById('morphModelSelect');
        this.groqModelSelect = document.getElementById('groqModelSelect');
        this.togetherModelSelect = document.getElementById('togetherModelSelect');
        this.ollamaModelSelect = document.getElementById('ollamaModelSelect');
        
        // Selection display
        this.selectionDisplay = document.getElementById('selectionDisplay');
        
        // Legacy reference for compatibility
        this.modelSelect = this.openrouterModelSelect;
        this.openrouterKeySection = this.openrouterSection;
        this.openaiKeySection = this.openaiSection;
        this.deepseekKeySection = this.deepseekSection;
        
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
        this.strategyModeBtn = document.getElementById('strategyMode');
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
        
        // Strategy AI Agent section elements
        this.strategySection = document.getElementById('strategySection');
        this.strategySummarySection = document.getElementById('strategySummarySection');
        this.strategySummary = document.getElementById('strategySummary');
        this.refinedStrategySection = document.getElementById('refinedStrategySection');
        this.refinedStrategyContent = document.getElementById('refinedStrategyContent');
        this.copyRefinedBtn = document.getElementById('copyRefinedBtn');
        this.comparisonSection = document.getElementById('comparisonSection');
        this.comparisonContainer = document.getElementById('comparisonContainer');
        this.objectivesAnalysisSection = document.getElementById('objectivesAnalysisSection');
        this.objectivesAnalysis = document.getElementById('objectivesAnalysis');
        this.clarityImprovementsSection = document.getElementById('clarityImprovementsSection');
        this.clarityImprovements = document.getElementById('clarityImprovements');
        this.industryAlignmentSection = document.getElementById('industryAlignmentSection');
        this.industryAlignment = document.getElementById('industryAlignment');
        this.budgetImplicationsSection = document.getElementById('budgetImplicationsSection');
        this.budgetImplications = document.getElementById('budgetImplications');
        this.regionalSection = document.getElementById('regionalSection');
        this.regionalConsiderations = document.getElementById('regionalConsiderations');
        this.strategyActionsSection = document.getElementById('strategyActionsSection');
        this.strategyActions = document.getElementById('strategyActions');
        this.strategyQuestionsSection = document.getElementById('strategyQuestionsSection');
        this.strategyQuestionsList = document.getElementById('strategyQuestionsList');
        this.copyStrategyBtn = document.getElementById('copyStrategyBtn');
        this.clearStrategyHistoryBtn = document.getElementById('clearStrategyHistory');
        
        // Current strategy data
        this.currentStrategyResponse = null;
        
        // Strategy conversation history
        this.strategyConversationHistory = JSON.parse(localStorage.getItem('strategy_conversation_history') || '[]');
        
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
        
        // ==================== CHAT MODE PROPERTIES ====================
        // Chat DOM Elements
        this.chatModeBtn = document.getElementById('chatMode');
        this.chatContainer = document.getElementById('chatContainer');
        this.translationContainer = document.getElementById('translationContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSendBtn = document.getElementById('chatSendBtn');
        this.chatMicBtn = document.getElementById('chatMicBtn');
        this.chatImageBtn = document.getElementById('chatImageBtn');
        this.chatImageInput = document.getElementById('chatImageInput');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        this.imagePreview = document.getElementById('imagePreview');
        this.removeImageBtn = document.getElementById('removeImageBtn');
        this.stopGenerationBtn = document.getElementById('stopGenerationBtn');
        this.tokenCounter = document.getElementById('tokenCounter');
        this.chatWelcome = document.getElementById('chatWelcome');
        
        // System prompt elements
        this.systemPromptPanel = document.getElementById('systemPromptPanel');
        this.systemPromptInput = document.getElementById('systemPromptInput');
        this.systemPromptContent = document.getElementById('systemPromptContent');
        this.togglePromptBtn = document.getElementById('togglePromptBtn');
        
        // Sidebar elements
        this.chatSidebar = document.getElementById('chatSidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.conversationsList = document.getElementById('conversationsList');
        this.chatSearchInput = document.getElementById('chatSearchInput');
        this.exportChatsBtn = document.getElementById('exportChatsBtn');
        this.importChatsBtn = document.getElementById('importChatsBtn');
        
        // Chat state
        this.chatConversations = JSON.parse(localStorage.getItem('chat_conversations') || '[]');
        this.currentChatId = localStorage.getItem('current_chat_id') || null;
        this.currentChatMessages = [];
        this.pendingImage = null;
        this.isStreaming = false;
        this.streamController = null;
        this.systemPrompt = localStorage.getItem('chat_system_prompt') || '';
        
        // System prompt templates
        this.promptTemplates = {
            general: 'You are a helpful, friendly AI assistant. Provide clear, accurate, and thoughtful responses. Be concise but thorough.',
            coder: 'You are an expert software engineer and coding assistant. Help with code review, debugging, optimization, and explaining complex concepts. Provide working code examples with clear explanations.',
            writer: 'You are a creative writing assistant with expertise in various writing styles. Help with storytelling, editing, improving prose, and generating creative content. Offer constructive feedback and suggestions.',
            analyst: 'You are a data analysis expert. Help interpret data, suggest analytical approaches, explain statistical concepts, and provide insights. Use clear visualizations and examples when helpful.',
            translator: 'You are an expert translator with deep knowledge of languages and cultures. Translate accurately while preserving meaning, tone, and cultural context. Explain nuances when relevant.'
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initSpeechRecognition();
        this.initChatFeatures();
        this.initAdvancedFeatures();
        this.updateCharCount();
        
        // API keys are saved in localStorage - no need to auto-show settings
        // User can access settings from the sidebar when needed
    }
    
    // ==================== CHAT INITIALIZATION ====================
    initChatFeatures() {
        // Load system prompt
        if (this.systemPromptInput && this.systemPrompt) {
            this.systemPromptInput.value = this.systemPrompt;
        }
        
        // Load current chat if exists
        if (this.currentChatId) {
            this.loadChat(this.currentChatId);
        }
        
        // Render conversations list
        this.renderConversationsList();
        
        // Auto-resize chat input
        if (this.chatInput) {
            this.chatInput.addEventListener('input', () => {
                this.chatInput.style.height = 'auto';
                this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 150) + 'px';
                this.updateTokenCount();
            });
        }
    }
    
    bindEvents() {
        // Mode sidebar buttons - bind all mode buttons
        document.querySelectorAll('.mode-sidebar-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setMode(btn.dataset.mode));
        });
        
        // Settings button in sidebar
        const settingsBtnSidebar = document.getElementById('settingsBtnSidebar');
        if (settingsBtnSidebar) {
            settingsBtnSidebar.addEventListener('click', () => this.showModal());
        }
        
        // Theme toggle in sidebar
        const themeToggleSidebar = document.getElementById('themeToggleSidebar');
        if (themeToggleSidebar) {
            themeToggleSidebar.addEventListener('click', () => this.toggleTheme());
        }
        
        // Chat mode toggle (legacy support)
        if (this.chatModeBtn) {
            this.chatModeBtn.addEventListener('click', () => this.setMode('chat'));
        }
        
        // Chat input events
        if (this.chatInput) {
            this.chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
        }
        
        // Chat send button
        if (this.chatSendBtn) {
            this.chatSendBtn.addEventListener('click', () => this.sendChatMessage());
        }
        
        // Chat mic button
        if (this.chatMicBtn) {
            this.chatMicBtn.addEventListener('click', () => this.toggleChatSpeechRecognition());
        }
        
        // Chat image upload
        if (this.chatImageBtn) {
            this.chatImageBtn.addEventListener('click', () => this.chatImageInput?.click());
        }
        if (this.chatImageInput) {
            this.chatImageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }
        if (this.removeImageBtn) {
            this.removeImageBtn.addEventListener('click', () => this.removeUploadedImage());
        }
        
        // Stop generation
        if (this.stopGenerationBtn) {
            this.stopGenerationBtn.addEventListener('click', () => this.stopStreaming());
        }
        
        // System prompt toggle
        if (this.togglePromptBtn) {
            this.togglePromptBtn.addEventListener('click', () => this.toggleSystemPrompt());
        }
        if (this.systemPromptInput) {
            this.systemPromptInput.addEventListener('change', () => this.saveSystemPrompt());
            this.systemPromptInput.addEventListener('blur', () => this.saveSystemPrompt());
        }
        
        // Prompt templates
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const template = btn.dataset.template;
                if (this.promptTemplates[template]) {
                    this.systemPromptInput.value = this.promptTemplates[template];
                    this.saveSystemPrompt();
                    this.showToast('Template applied!', 'success');
                }
            });
        });
        
        // Suggested prompts
        document.querySelectorAll('.suggested-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.dataset.prompt;
                if (this.chatInput) {
                    this.chatInput.value = prompt;
                    this.chatInput.focus();
                }
            });
        });
        
        // Sidebar toggle
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // New chat button
        if (this.newChatBtn) {
            this.newChatBtn.addEventListener('click', () => this.createNewChat());
        }
        
        // Search conversations
        if (this.chatSearchInput) {
            this.chatSearchInput.addEventListener('input', () => this.filterConversations());
        }
        
        // Export/Import chats
        if (this.exportChatsBtn) {
            this.exportChatsBtn.addEventListener('click', () => this.exportChats());
        }
        if (this.importChatsBtn) {
            this.importChatsBtn.addEventListener('click', () => this.importChats());
        }
        
        // Mode toggle
        // Mode toggle
        this.translateModeBtn.addEventListener('click', () => this.setMode('translate'));
        this.enhanceModeBtn.addEventListener('click', () => this.setMode('enhance'));
        this.emailModeBtn.addEventListener('click', () => this.setMode('email'));
        this.agentModeBtn.addEventListener('click', () => this.setMode('agent'));
        this.strategyModeBtn.addEventListener('click', () => this.setMode('strategy'));
        
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
        this.apiKeyInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });
        
        // Provider tabs click handlers
        this.providerTabs?.querySelectorAll('.provider-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchProvider(tab.dataset.provider);
            });
        });
        
        // Model selection change handlers for each provider
        this.openrouterModelSelect?.addEventListener('change', () => {
            this.updateModelFromProvider();
            this.updateSelectionDisplay();
        });
        this.anthropicModelSelect?.addEventListener('change', () => {
            this.updateModelFromProvider();
            this.updateSelectionDisplay();
        });
        this.openaiModelSelect?.addEventListener('change', () => {
            this.updateModelFromProvider();
            this.updateSelectionDisplay();
        });
        this.googleModelSelect?.addEventListener('change', () => {
            this.updateModelFromProvider();
            this.updateSelectionDisplay();
        });
        this.deepseekModelSelect?.addEventListener('change', () => {
            this.updateModelFromProvider();
            this.updateSelectionDisplay();
        });
        this.grokModelSelect?.addEventListener('change', () => {
        this.morphModelSelect?.addEventListener('change', () => {
            this.updateModelFromProvider();
            this.updateSelectionDisplay();
        });
            this.updateModelFromProvider();
            this.updateSelectionDisplay();
        });
        
        // Toggle visibility buttons for API keys
        document.querySelectorAll('.toggle-visibility-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                if (input) {
                    input.type = input.type === 'password' ? 'text' : 'password';
                    btn.textContent = input.type === 'password' ? '👁️' : '🙈';
                }
            });
        });
        
        // Fallback toggle and reset health button
        const fallbackToggle = document.getElementById('fallbackToggle');
        const resetHealthBtn = document.getElementById('resetHealthBtn');
        
        if (fallbackToggle) {
            fallbackToggle.checked = this.fallbackEnabled;
            fallbackToggle.addEventListener('change', () => {
                this.toggleFallbackMode(fallbackToggle.checked);
            });
        }
        
        if (resetHealthBtn) {
            resetHealthBtn.addEventListener('click', () => {
                this.resetModelHealth();
                this.updateModelHealthDisplay();
            });
        }
        
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
        
        // Update sidebar button states
        document.querySelectorAll('.mode-sidebar-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Update legacy button states (if they exist)
        if (this.chatModeBtn) this.chatModeBtn.classList.toggle('active', mode === 'chat');
        if (this.translateModeBtn) this.translateModeBtn.classList.toggle('active', mode === 'translate');
        if (this.enhanceModeBtn) this.enhanceModeBtn.classList.toggle('active', mode === 'enhance');
        if (this.emailModeBtn) this.emailModeBtn.classList.toggle('active', mode === 'email');
        if (this.agentModeBtn) this.agentModeBtn.classList.toggle('active', mode === 'agent');
        if (this.strategyModeBtn) this.strategyModeBtn.classList.toggle('active', mode === 'strategy');
        
        // Show/hide chat container vs translation container
        if (mode === 'chat') {
            if (this.chatContainer) this.chatContainer.style.display = 'flex';
            if (this.translationContainer) this.translationContainer.style.display = 'none';
            // Hide all other sections
            this.enhancementSection?.classList.remove('visible');
            this.emailSection?.classList.remove('visible');
            this.agentSection?.classList.remove('visible');
            this.strategySection?.classList.remove('visible');
            this.detailsSection?.classList.remove('visible');
            this.insightsSection?.classList.remove('visible');
            this.expandedSection?.classList.remove('visible');
            // Focus chat input
            setTimeout(() => this.chatInput?.focus(), 100);
            return;
        } else {
            if (this.chatContainer) this.chatContainer.style.display = 'none';
            if (this.translationContainer) this.translationContainer.style.display = 'grid';
        }
        
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
            this.strategySection?.classList.remove('visible');
            this.hideEnhancement();
            this.hideEmail();
            this.hideAgent();
            this.hideStrategy();
        } else if (mode === 'enhance') {
            this.inputLabel.textContent = 'Your Text';
            this.outputLabel.textContent = 'Enhanced';
            this.inputText.placeholder = "Enter text to enhance...\n\nPaste any text and get:\n• Improved sentence structure\n• Suggested additions\n• Ideas to enhance information\n• Alternative versions";
            document.querySelector('.translate-btn .btn-text').textContent = 'Enhance';
            this.outputArea.innerHTML = '<div class="placeholder-text">Enhanced text will appear here...</div>';
            // Hide other sections
            this.emailSection.classList.remove('visible');
            this.agentSection.classList.remove('visible');
            this.strategySection?.classList.remove('visible');
            this.hideDetails();
            this.hideEmail();
            this.hideAgent();
            this.hideStrategy();
        } else if (mode === 'email') {
            this.inputLabel.textContent = 'Afrikaans Email';
            this.outputLabel.textContent = 'English Email';
            this.inputText.placeholder = "Enter Afrikaans email text here...\n\nThe translator will:\n• Translate to English\n• Format for email\n• Suggest subject line\n• Provide greeting/closing options";
            document.querySelector('.translate-btn .btn-text').textContent = 'Translate Email';
            this.outputArea.innerHTML = '<div class="placeholder-text">Translated email will appear here...</div>';
            // Hide other sections
            this.enhancementSection.classList.remove('visible');
            this.agentSection.classList.remove('visible');
            this.strategySection?.classList.remove('visible');
            this.hideDetails();
            this.hideEnhancement();
            this.hideAgent();
            this.hideStrategy();
        } else if (mode === 'agent') {
            this.inputLabel.textContent = 'Enter Your Idea or Question';
            this.outputLabel.textContent = 'Strategic Analysis';
            this.inputText.placeholder = "Describe your business idea, strategy, or question for strategic analysis...\n\nExamples:\n• Enhanced Availability: Increase service coverage by expanding the fleet with 10 additional vehicles...\n• Launch a subscription model for our SaaS product with tiered pricing...\n• Implement an AI-powered customer support system to reduce response times...\n• Open a second location to capture the growing suburban market demand...";
            document.querySelector('.translate-btn .btn-text').textContent = 'Analyze';
            this.outputArea.innerHTML = '<div class="placeholder-text">Strategic analysis with enhancement ideas and follow-up questions will appear here...</div>';
            // Hide other sections
            this.enhancementSection.classList.remove('visible');
            this.emailSection.classList.remove('visible');
            this.strategySection?.classList.remove('visible');
            this.hideDetails();
            this.hideEnhancement();
            this.hideEmail();
            this.hideStrategy();
        } else if (mode === 'strategy') {
            this.inputLabel.textContent = 'Strategic Objective / Action Plan';
            this.outputLabel.textContent = 'Refined Strategy';
            this.inputText.placeholder = "Paste your annual strategy plan, strategic objectives, or action items here...\n\nThe Strategy Agent will:\n• Simplify and shorten objectives for clarity\n• Ensure alignment with transport industry best practices\n• Consider South Africa/Zimbabwe operational context\n• Provide budget-aligned recommendations\n\nExample:\n• Enhanced Availability: Increase service coverage in the Northern region by acquiring 10 additional heavy-duty vehicles and establishing 3 new maintenance depots to reduce downtime and improve delivery schedules for cross-border operations...";
            document.querySelector('.translate-btn .btn-text').textContent = 'Refine Strategy';
            this.outputArea.innerHTML = '<div class="placeholder-text">Refined strategy objectives with improved clarity and conciseness will appear here...</div>';
            // Hide other sections
            this.enhancementSection.classList.remove('visible');
            this.emailSection.classList.remove('visible');
            this.agentSection.classList.remove('visible');
            this.hideDetails();
            this.hideEnhancement();
            this.hideEmail();
            this.hideAgent();
        }
        
        // Clear current data
        this.currentTranslation = null;
        this.currentEnhancement = null;
        this.currentEmail = null;
        this.currentAgentResponse = null;
        this.currentStrategyResponse = null;
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
        } else if (this.currentMode === 'strategy') {
            this.refineStrategy();
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
    
    // Helper method to get the saved model for a specific provider
    getModelForProvider(provider) {
        const defaults = {
            openrouter: 'anthropic/claude-3.5-sonnet',
            anthropic: 'claude-3-5-sonnet-20241022',
            openai: 'gpt-4o',
            google: 'gemini-1.5-pro',
            deepseek: 'deepseek-chat',
            grok: 'grok-beta',
            morph: 'morph-v1',
            groq: 'llama-3.3-70b-versatile',
            together: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
            ollama: 'llama3.2'
        };
        
        const storageKeys = {
            openrouter: 'openrouter_model',
            anthropic: 'anthropic_model',
            openai: 'openai_model',
            google: 'google_model',
            deepseek: 'deepseek_model',
            grok: 'grok_model',
            morph: 'morph_model',
            groq: 'groq_model',
            together: 'together_model',
            ollama: 'ollama_model'
        };
        
        const key = storageKeys[provider] || 'openrouter_model';
        const defaultModel = defaults[provider] || defaults.openrouter;
        return localStorage.getItem(key) || defaultModel;
    }
    
    // Helper method to get the API key for a specific provider
    getApiKeyForProvider(provider) {
        switch (provider) {
            case 'openrouter': return this.openrouterApiKey;
            case 'anthropic': return this.anthropicApiKey;
            case 'openai': return this.openaiApiKey;
            case 'google': return this.googleApiKey;
            case 'deepseek': return this.deepseekApiKey;
            case 'grok': return this.grokApiKey;
            case 'morph': return this.morphApiKey;
            case 'groq': return this.groqApiKey;
            case 'together': return this.togetherApiKey;
            case 'ollama': return this.ollamaUrl; // Ollama uses URL, not API key
            default: return this.openrouterApiKey;
        }
    }
    
    showModal() {
        // Populate API key inputs
        this.apiKeyInput.value = this.openrouterApiKey;
        this.openaiKeyInput.value = this.openaiApiKey;
        this.deepseekKeyInput.value = this.deepseekApiKey;
        if (this.anthropicKeyInput) this.anthropicKeyInput.value = this.anthropicApiKey;
        if (this.googleKeyInput) this.googleKeyInput.value = this.googleApiKey;
        if (this.grokKeyInput) this.grokKeyInput.value = this.grokApiKey;
        if (this.morphKeyInput) this.morphKeyInput.value = this.morphApiKey;
        if (this.groqKeyInput) this.groqKeyInput.value = this.groqApiKey;
        if (this.togetherKeyInput) this.togetherKeyInput.value = this.togetherApiKey;
        if (this.ollamaUrlInput) this.ollamaUrlInput.value = this.ollamaUrl;
        
        // Set model selects to saved values
        this.loadSavedModelSelections();
        
        // Activate the current provider tab
        this.switchProvider(this.currentProvider);
        
        // Update selection display
        this.updateSelectionDisplay();
        
        // Update fallback toggle state and health display
        const fallbackToggle = document.getElementById('fallbackToggle');
        if (fallbackToggle) fallbackToggle.checked = this.fallbackEnabled;
        this.updateModelHealthDisplay();
        
        this.apiKeyModal.classList.add('visible');
    }
    
    loadSavedModelSelections() {
        // Load saved model selections for each provider
        const savedOpenrouterModel = localStorage.getItem('openrouter_model') || 'anthropic/claude-3.5-sonnet';
        const savedAnthropicModel = localStorage.getItem('anthropic_model') || 'claude-3-5-sonnet-20241022';
        const savedOpenaiModel = localStorage.getItem('openai_model') || 'gpt-5';
        const savedGoogleModel = localStorage.getItem('google_model') || 'gemini-2.0-flash';
        const savedDeepseekModel = localStorage.getItem('deepseek_model') || 'deepseek-reasoner';
        const savedGrokModel = localStorage.getItem('grok_model') || 'grok-3-latest';
        const savedMorphModel = localStorage.getItem('morph_model') || 'morph-v2';
        const savedGroqModel = localStorage.getItem('groq_model') || 'llama-3.3-70b-versatile';
        const savedTogetherModel = localStorage.getItem('together_model') || 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
        const savedOllamaModel = localStorage.getItem('ollama_model') || 'llama3.2';
        
        if (this.openrouterModelSelect) this.openrouterModelSelect.value = savedOpenrouterModel;
        if (this.anthropicModelSelect) this.anthropicModelSelect.value = savedAnthropicModel;
        if (this.openaiModelSelect) this.openaiModelSelect.value = savedOpenaiModel;
        if (this.googleModelSelect) this.googleModelSelect.value = savedGoogleModel;
        if (this.deepseekModelSelect) this.deepseekModelSelect.value = savedDeepseekModel;
        if (this.grokModelSelect) this.grokModelSelect.value = savedGrokModel;
        if (this.morphModelSelect) this.morphModelSelect.value = savedMorphModel;
        if (this.groqModelSelect) this.groqModelSelect.value = savedGroqModel;
        if (this.togetherModelSelect) this.togetherModelSelect.value = savedTogetherModel;
        if (this.ollamaModelSelect) this.ollamaModelSelect.value = savedOllamaModel;
    }
    
    switchProvider(provider) {
        this.currentProvider = provider;
        
        // Update tab styles
        const tabs = this.providerTabs?.querySelectorAll('.provider-tab');
        tabs?.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.provider === provider);
        });
        
        // Hide all provider content sections
        const sections = document.querySelectorAll('.provider-content');
        sections.forEach(section => section.classList.remove('active'));
        
        // Show the selected provider section
        const activeSection = document.getElementById(`${provider}Section`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        
        // Update the model based on current provider selection
        this.updateModelFromProvider();
        this.updateSelectionDisplay();
    }
    
    updateModelFromProvider() {
        switch (this.currentProvider) {
            case 'openrouter':
                this.model = this.openrouterModelSelect?.value || 'anthropic/claude-3.5-sonnet';
                break;
            case 'anthropic':
                this.model = `anthropic-direct/${this.anthropicModelSelect?.value || 'claude-3-5-sonnet-20241022'}`;
                break;
            case 'openai':
                this.model = `openai/${this.openaiModelSelect?.value || 'gpt-5'}`;
                break;
            case 'google':
                this.model = `google/${this.googleModelSelect?.value || 'gemini-2.0-flash'}`;
                break;
            case 'deepseek':
                this.model = `deepseek/${this.deepseekModelSelect?.value || 'deepseek-reasoner'}`;
                break;
            case 'grok':
                this.model = `grok/${this.grokModelSelect?.value || 'grok-3-latest'}`;
                break;
            case 'morph':
                this.model = `morph/${this.morphModelSelect?.value || 'morph-v2'}`;
                break;
            case 'groq':
                this.model = `groq/${this.groqModelSelect?.value || 'llama-3.3-70b-versatile'}`;
                break;
            case 'together':
                this.model = `together/${this.togetherModelSelect?.value || 'meta-llama/Llama-3.3-70B-Instruct-Turbo'}`;
                break;
            case 'ollama':
                this.model = `ollama/${this.ollamaModelSelect?.value || 'llama3.2'}`;
                break;
        }
    }
    
    updateSelectionDisplay() {
        if (!this.selectionDisplay) return;
        
        const providerNames = {
            'openrouter': 'OpenRouter',
            'anthropic': 'Anthropic',
            'openai': 'OpenAI',
            'google': 'Google Gemini',
            'deepseek': 'DeepSeek',
            'grok': 'Grok (xAI)',
            'morph': 'Morph AI',
            'groq': 'Groq (Free)',
            'together': 'Together AI (Free)',
            'ollama': 'Ollama (Local)'
        };
        
        let modelName = '';
        switch (this.currentProvider) {
            case 'openrouter':
                modelName = this.openrouterModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'anthropic':
                modelName = this.anthropicModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'openai':
                modelName = this.openaiModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'google':
                modelName = this.googleModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'deepseek':
                modelName = this.deepseekModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'grok':
                modelName = this.grokModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'morph':
                modelName = this.morphModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'groq':
                modelName = this.groqModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'together':
                modelName = this.togetherModelSelect?.selectedOptions[0]?.text || this.model;
                break;
            case 'ollama':
                modelName = this.ollamaModelSelect?.selectedOptions[0]?.text || this.model;
                break;
        }
        
        this.selectionDisplay.textContent = `${providerNames[this.currentProvider]} - ${modelName}`;
    }
    
    updateApiKeyVisibility() {
        // Legacy function - now handled by switchProvider
        this.switchProvider(this.currentProvider);
    }
    
    hideModal() {
        this.apiKeyModal.classList.remove('visible');
    }
    
    saveApiKey() {
        // Update model from current provider selection
        this.updateModelFromProvider();
        
        // Save all API keys
        const openrouterKey = this.apiKeyInput?.value.trim() || '';
        const openaiKey = this.openaiKeyInput?.value.trim() || '';
        const deepseekKey = this.deepseekKeyInput?.value.trim() || '';
        const anthropicKey = this.anthropicKeyInput?.value.trim() || '';
        const googleKey = this.googleKeyInput?.value.trim() || '';
        const grokKey = this.grokKeyInput?.value.trim() || '';
        const morphKey = this.morphKeyInput?.value.trim() || '';
        const groqKey = this.groqKeyInput?.value.trim() || '';
        const togetherKey = this.togetherKeyInput?.value.trim() || '';
        const ollamaUrl = this.ollamaUrlInput?.value.trim() || 'http://localhost:11434';
        
        // Validate that the required key for selected provider is provided
        if (this.currentProvider === 'openai' && !openaiKey) {
            this.showToast('Please enter your OpenAI API key.', 'error');
            return;
        }
        if (this.currentProvider === 'deepseek' && !deepseekKey) {
            this.showToast('Please enter your DeepSeek API key.', 'error');
            return;
        }
        if (this.currentProvider === 'anthropic' && !anthropicKey) {
            this.showToast('Please enter your Anthropic API key.', 'error');
            return;
        }
        if (this.currentProvider === 'google' && !googleKey) {
            this.showToast('Please enter your Google AI API key.', 'error');
            return;
        }
        if (this.currentProvider === 'grok' && !grokKey) {
            this.showToast('Please enter your xAI API key.', 'error');
            return;
        }
        if (this.currentProvider === 'morph' && !morphKey) {
            this.showToast('Please enter your Morph AI API key.', 'error');
            return;
        }
        if (this.currentProvider === 'groq' && !groqKey) {
            this.showToast('Please enter your Groq API key.', 'error');
            return;
        }
        if (this.currentProvider === 'together' && !togetherKey) {
            this.showToast('Please enter your Together AI API key.', 'error');
            return;
        }
        if (this.currentProvider === 'openrouter' && !openrouterKey) {
            this.showToast('Please enter your OpenRouter API key.', 'error');
            return;
        }
        
        // Update instance variables
        this.openrouterApiKey = openrouterKey;
        this.openaiApiKey = openaiKey;
        this.deepseekApiKey = deepseekKey;
        this.anthropicApiKey = anthropicKey;
        this.googleApiKey = googleKey;
        this.grokApiKey = grokKey;
        this.morphApiKey = morphKey;
        this.groqApiKey = groqKey;
        this.togetherApiKey = togetherKey;
        this.ollamaUrl = ollamaUrl;
        
        // Save to localStorage
        localStorage.setItem('openrouter_api_key', openrouterKey);
        localStorage.setItem('openai_api_key', openaiKey);
        localStorage.setItem('deepseek_api_key', deepseekKey);
        localStorage.setItem('anthropic_api_key', anthropicKey);
        localStorage.setItem('google_api_key', googleKey);
        localStorage.setItem('grok_api_key', grokKey);
        localStorage.setItem('morph_api_key', morphKey);
        localStorage.setItem('groq_api_key', groqKey);
        localStorage.setItem('together_api_key', togetherKey);
        localStorage.setItem('ollama_url', ollamaUrl);
        localStorage.setItem('current_provider', this.currentProvider);
        
        // Save model selections for each provider
        if (this.openrouterModelSelect) localStorage.setItem('openrouter_model', this.openrouterModelSelect.value);
        if (this.anthropicModelSelect) localStorage.setItem('anthropic_model', this.anthropicModelSelect.value);
        if (this.openaiModelSelect) localStorage.setItem('openai_model', this.openaiModelSelect.value);
        if (this.googleModelSelect) localStorage.setItem('google_model', this.googleModelSelect.value);
        if (this.deepseekModelSelect) localStorage.setItem('deepseek_model', this.deepseekModelSelect.value);
        if (this.grokModelSelect) localStorage.setItem('grok_model', this.grokModelSelect.value);
        if (this.morphModelSelect) localStorage.setItem('morph_model', this.morphModelSelect.value);
        if (this.groqModelSelect) localStorage.setItem('groq_model', this.groqModelSelect.value);
        if (this.togetherModelSelect) localStorage.setItem('together_model', this.togetherModelSelect.value);
        if (this.ollamaModelSelect) localStorage.setItem('ollama_model', this.ollamaModelSelect.value);
        
        this.hideModal();
        this.showToast('Settings saved successfully!', 'success');
    }
    
    // Sanitize header values to ensure they only contain ISO-8859-1 characters
    sanitizeHeaderValue(value) {
        if (!value) return '';
        // Remove any non-ASCII characters that could cause fetch to fail
        return String(value).replace(/[^\x00-\xFF]/g, '');
    }
    
    getApiConfig() {
        const model = this.model;
        
        if (model.startsWith('anthropic-direct/')) {
            // Anthropic direct API
            const modelName = model.replace('anthropic-direct/', '');
            return {
                endpoint: 'https://api.anthropic.com/v1/messages',
                apiKey: this.anthropicApiKey,
                model: modelName,
                isO1Model: false,
                isAnthropicDirect: true,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.sanitizeHeaderValue(this.anthropicApiKey),
                    'anthropic-version': '2023-06-01'
                }
            };
        } else if (model.startsWith('google/')) {
            // Google Gemini API
            const modelName = model.replace('google/', '');
            return {
                endpoint: `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.sanitizeHeaderValue(this.googleApiKey)}`,
                apiKey: this.googleApiKey,
                model: modelName,
                isO1Model: false,
                isGoogleGemini: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } else if (model.startsWith('openai/')) {
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
                    'Authorization': `Bearer ${this.sanitizeHeaderValue(this.openaiApiKey)}`
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
                    'Authorization': `Bearer ${this.sanitizeHeaderValue(this.deepseekApiKey)}`
                }
            };
        } else if (model.startsWith('grok/')) {
            // xAI Grok API (OpenAI-compatible)
            const modelName = model.replace('grok/', '');
            return {
                endpoint: 'https://api.x.ai/v1/chat/completions',
                apiKey: this.grokApiKey,
                model: modelName,
                isO1Model: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.sanitizeHeaderValue(this.grokApiKey)}`
                }
            };
        } else if (model.startsWith('morph/')) {
            // Morph AI API (OpenAI-compatible)
            const modelName = model.replace('morph/', '');
            return {
                endpoint: 'https://api.morphllm.com/v1/chat/completions',
                apiKey: this.morphApiKey,
                model: modelName,
                isO1Model: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.sanitizeHeaderValue(this.morphApiKey)}`
                }
            };
        } else if (model.startsWith('groq/')) {
            // Groq API (FREE - OpenAI-compatible)
            const modelName = model.replace('groq/', '');
            return {
                endpoint: 'https://api.groq.com/openai/v1/chat/completions',
                apiKey: this.groqApiKey,
                model: modelName,
                isO1Model: false,
                isFreeProvider: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.sanitizeHeaderValue(this.groqApiKey)}`
                }
            };
        } else if (model.startsWith('together/')) {
            // Together AI API (FREE tier - OpenAI-compatible)
            const modelName = model.replace('together/', '');
            return {
                endpoint: 'https://api.together.xyz/v1/chat/completions',
                apiKey: this.togetherApiKey,
                model: modelName,
                isO1Model: false,
                isFreeProvider: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.sanitizeHeaderValue(this.togetherApiKey)}`
                }
            };
        } else if (model.startsWith('ollama/')) {
            // Ollama Local API (FREE - runs locally, OpenAI-compatible)
            const modelName = model.replace('ollama/', '');
            return {
                endpoint: `${this.ollamaUrl}/v1/chat/completions`,
                apiKey: 'ollama', // Ollama doesn't need a real API key
                model: modelName,
                isO1Model: false,
                isFreeProvider: true,
                isLocalProvider: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } else {
            // OpenRouter API (default)
            return {
                endpoint: 'https://openrouter.ai/api/v1/chat/completions',
                apiKey: this.openrouterApiKey,
                model: model,
                isO1Model: model.includes('o1-') || model.includes('/o1'),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.sanitizeHeaderValue(this.openrouterApiKey)}`,
                    'HTTP-Referer': this.sanitizeHeaderValue(window.location.origin),
                    'X-Title': 'Afrikaans to English Translator'
                }
            };
        }
    }
    
    // Get max tokens limit based on model
    getMaxTokensForModel(model, requestedTokens) {
        // Models with specific completion token limits
        const modelName = model.toLowerCase();
        
        // GPT-5 series: very high output limits
        if (modelName.includes('gpt-5')) {
            return Math.min(requestedTokens, 32000);
        }
        
        // GPT-4.1 series: high output limits
        if (modelName.includes('gpt-4.1')) {
            return Math.min(requestedTokens, 32000);
        }
        
        // O3 models: high reasoning output
        if (modelName.includes('o3-')) {
            return Math.min(requestedTokens, 65000);
        }
        
        // GPT-3.5-turbo variants: 4096 max output tokens
        if (modelName.includes('gpt-3.5-turbo')) {
            return Math.min(requestedTokens, 4000);
        }
        
        // GPT-4o-mini: 16384 max output tokens
        if (modelName.includes('gpt-4o-mini')) {
            return Math.min(requestedTokens, 16000);
        }
        
        // O1 models: 100000 max output tokens (very high limit)
        if (modelName.includes('o1-mini') || modelName.includes('o1-preview') || modelName.includes('o1-pro')) {
            return Math.min(requestedTokens, 65000);
        }
        
        // GPT-4o: 16384 max output tokens
        if (modelName.includes('gpt-4o')) {
            return Math.min(requestedTokens, 16000);
        }
        
        // GPT-4-turbo: 4096 max output tokens
        if (modelName.includes('gpt-4-turbo')) {
            return Math.min(requestedTokens, 4000);
        }
        
        // Claude 3.5 Sonnet/Opus/Haiku: 8192 max output tokens (standard), but can be higher with extended thinking
        if (modelName.includes('claude-3')) {
            return Math.min(requestedTokens, 8192);
        }
        
        // Claude 4 / Claude Sonnet 4: up to 64000 with extended thinking
        if (modelName.includes('claude-4') || modelName.includes('claude-sonnet-4')) {
            return Math.min(requestedTokens, 16000);
        }
        
        // Gemini 1.5 Pro/Flash: 8192 max output tokens
        if (modelName.includes('gemini-1.5') || modelName.includes('gemini-2')) {
            return Math.min(requestedTokens, 8192);
        }
        
        // DeepSeek models: 8192 max output tokens
        if (modelName.includes('deepseek')) {
            return Math.min(requestedTokens, 8192);
        }
        
        // Grok models: 131072 context, generous output
        if (modelName.includes('grok')) {
            return Math.min(requestedTokens, 16000);
        }
        
        // Morph models: default to generous limit
        if (modelName.includes('morph')) {
            return Math.min(requestedTokens, 16000);
        }
        
        // Default: allow the requested tokens up to 16000
        return Math.min(requestedTokens, 16000);
    }
    
    // Format request body based on API provider
    formatRequestBody(apiConfig, messages, maxTokens = 16000, temperature = 0.3) {
        // Adjust max tokens based on model limits
        const adjustedMaxTokens = this.getMaxTokensForModel(apiConfig.model, maxTokens);
        
        if (apiConfig.isAnthropicDirect) {
            // Anthropic uses a different message format
            const systemMessage = messages.find(m => m.role === 'system');
            const userMessages = messages.filter(m => m.role !== 'system');
            
            return {
                model: apiConfig.model,
                max_tokens: adjustedMaxTokens,
                system: systemMessage?.content || '',
                messages: userMessages.map(m => ({
                    role: m.role,
                    content: m.content
                }))
            };
        } else if (apiConfig.isGoogleGemini) {
            // Google Gemini uses a different format
            const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
            const userContent = messages.filter(m => m.role !== 'system')
                .map(m => m.content).join('\n\n');
            
            return {
                contents: [{
                    parts: [{
                        text: systemInstruction ? `${systemInstruction}\n\n${userContent}` : userContent
                    }]
                }],
                generationConfig: {
                    temperature: temperature,
                    maxOutputTokens: adjustedMaxTokens
                }
            };
        } else {
            // OpenAI-compatible format (OpenAI, DeepSeek, OpenRouter)
            const requestBody = {
                model: apiConfig.model,
                messages: messages,
                max_tokens: adjustedMaxTokens
            };
            
            // O1 models don't support temperature
            if (!apiConfig.isO1Model) {
                requestBody.temperature = temperature;
            }
            
            return requestBody;
        }
    }
    
    // Parse response based on API provider
    parseApiResponse(data, apiConfig) {
        if (apiConfig.isAnthropicDirect) {
            return data.content?.[0]?.text || '';
        } else if (apiConfig.isGoogleGemini) {
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
            return data.choices?.[0]?.message?.content || '';
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
        
        // Create error with status code attached for fallback system
        const createApiError = (message, statusCode) => {
            const error = new Error(message);
            error.statusCode = statusCode;
            return error;
        };
        
        if (response.status === 401) {
            throw createApiError('Invalid API key. Please check your API key in settings.', 401);
        } else if (response.status === 429) {
            throw createApiError('Rate limit exceeded. Please wait a moment and try again.', 429);
        } else if (response.status === 400) {
            const errorMsg = errorData.error?.message || 'Bad request. Model may not exist or parameters invalid.';
            throw createApiError(errorMsg, 400);
        } else if (response.status === 404) {
            throw createApiError('Model not found. The model name may be incorrect.', 404);
        } else if (response.status === 503) {
            throw createApiError('Model temporarily unavailable. Trying fallback...', 503);
        } else if (response.status === 502 || response.status === 504) {
            throw createApiError('Gateway error. The model may be overloaded.', response.status);
        } else {
            throw createApiError(errorData.error?.message || `API error: ${response.status} - ${response.statusText}`, response.status);
        }
    }
    
    // ==================== MODEL FALLBACK & RETRY SYSTEM ====================
    
    /**
     * Check if an error is retryable (rate limit or temporary failure)
     */
    isRetryableError(error, statusCode) {
        const retryableCodes = [429, 500, 502, 503, 504];
        const retryableMessages = ['rate limit', 'timeout', 'overloaded', 'capacity', 'temporarily'];
        
        if (retryableCodes.includes(statusCode)) return true;
        if (error?.message) {
            const msg = error.message.toLowerCase();
            return retryableMessages.some(term => msg.includes(term));
        }
        return false;
    }
    
    /**
     * Check if error indicates model is unavailable (should try fallback)
     */
    shouldFallback(error, statusCode) {
        const fallbackCodes = [404, 429, 500, 502, 503, 504];
        const fallbackMessages = ['not found', 'rate limit', 'unavailable', 'not available', 'model', 'capacity', 'overloaded'];
        
        if (fallbackCodes.includes(statusCode)) return true;
        if (error?.message) {
            const msg = error.message.toLowerCase();
            return fallbackMessages.some(term => msg.includes(term));
        }
        return false;
    }
    
    /**
     * Track model failure for health monitoring
     */
    trackModelFailure(modelId) {
        if (!this.modelHealth[modelId]) {
            this.modelHealth[modelId] = { failures: 0, lastFailure: null, available: true };
        }
        this.modelHealth[modelId].failures++;
        this.modelHealth[modelId].lastFailure = Date.now();
        
        // Mark as unavailable after 3 consecutive failures
        if (this.modelHealth[modelId].failures >= 3) {
            this.modelHealth[modelId].available = false;
            console.warn(`Model ${modelId} marked as unavailable after ${this.modelHealth[modelId].failures} failures`);
        }
    }
    
    /**
     * Track model success and reset health
     */
    trackModelSuccess(modelId) {
        this.modelHealth[modelId] = { failures: 0, lastFailure: null, available: true };
    }
    
    /**
     * Check if model is currently marked as available
     */
    isModelAvailable(modelId) {
        const health = this.modelHealth[modelId];
        if (!health) return true; // Unknown models are assumed available
        
        // Reset availability after 5 minutes
        if (!health.available && health.lastFailure) {
            const fiveMinutes = 5 * 60 * 1000;
            if (Date.now() - health.lastFailure > fiveMinutes) {
                health.available = true;
                health.failures = 0;
            }
        }
        return health.available;
    }
    
    /**
     * Get the fallback chain for current provider
     */
    getFallbackChain() {
        const provider = this.currentProvider || 'openrouter';
        return this.fallbackChains[provider] || this.fallbackChains.openrouter;
    }
    
    /**
     * Get next available fallback model
     */
    getNextFallbackModel(currentModel, triedModels = []) {
        const chain = this.getFallbackChain();
        
        for (const model of chain) {
            if (model !== currentModel && 
                !triedModels.includes(model) && 
                this.isModelAvailable(model)) {
                return model;
            }
        }
        
        // If all models in current provider failed, try cross-provider fallback
        if (this.openrouterApiKey && this.currentProvider !== 'openrouter') {
            // OpenRouter gives access to many models, use it as ultimate fallback
            for (const model of this.fallbackChains.openrouter) {
                if (!triedModels.includes(model) && this.isModelAvailable(model)) {
                    return { model, switchProvider: 'openrouter' };
                }
            }
        }
        
        return null;
    }
    
    /**
     * Sleep utility for retry delays
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Execute API call with retry and fallback logic
     */
    async executeWithFallback(apiCallFn, options = {}) {
        const { 
            maxRetries = this.maxRetries,
            showNotifications = true 
        } = options;
        
        const originalModel = this.model;
        const triedModels = [originalModel];
        let lastError = null;
        let currentModel = originalModel;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Update model temporarily if using fallback
                if (currentModel !== originalModel) {
                    this.model = currentModel;
                    if (showNotifications) {
                        this.showToast(`Trying fallback model: ${this.getReadableModelName()}`, 'info');
                    }
                }
                
                const result = await apiCallFn();
                
                // Success - track it and restore original model
                this.trackModelSuccess(currentModel);
                this.model = originalModel;
                return result;
                
            } catch (error) {
                lastError = error;
                const statusCode = error.statusCode || 0;
                
                console.warn(`API attempt ${attempt}/${maxRetries} failed for ${currentModel}:`, error.message);
                this.trackModelFailure(currentModel);
                
                // Check if we should retry with same model (rate limit with backoff)
                if (attempt < maxRetries && this.isRetryableError(error, statusCode)) {
                    const delay = this.retryDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
                    if (showNotifications) {
                        this.showToast(`Rate limited. Retrying in ${delay/1000}s...`, 'warning');
                    }
                    await this.sleep(delay);
                    continue;
                }
                
                // Check if we should try a fallback model
                if (this.fallbackEnabled && this.shouldFallback(error, statusCode)) {
                    const fallback = this.getNextFallbackModel(currentModel, triedModels);
                    
                    if (fallback) {
                        if (typeof fallback === 'object' && fallback.switchProvider) {
                            // Cross-provider fallback
                            this.currentProvider = fallback.switchProvider;
                            currentModel = fallback.model;
                        } else {
                            currentModel = fallback;
                        }
                        
                        triedModels.push(currentModel);
                        if (showNotifications) {
                            this.showToast(`Switching to fallback model...`, 'info');
                        }
                        continue;
                    }
                }
            }
        }
        
        // All retries and fallbacks exhausted
        this.model = originalModel;
        throw lastError || new Error('All models failed. Please try again later.');
    }
    
    /**
     * Toggle fallback mode on/off
     */
    toggleFallbackMode(enabled) {
        this.fallbackEnabled = enabled;
        localStorage.setItem('fallback_enabled', enabled.toString());
        this.showToast(enabled ? 'Auto-fallback enabled' : 'Auto-fallback disabled', 'success');
    }
    
    /**
     * Reset all model health tracking
     */
    resetModelHealth() {
        this.modelHealth = {};
        this.showToast('Model health reset. All models marked as available.', 'success');
    }
    
    /**
     * Get model health status for UI display
     */
    getModelHealthStatus() {
        const statuses = [];
        for (const [model, health] of Object.entries(this.modelHealth)) {
            statuses.push({
                model,
                available: health.available,
                failures: health.failures,
                lastFailure: health.lastFailure ? new Date(health.lastFailure).toLocaleTimeString() : null
            });
        }
        return statuses;
    }
    
    /**
     * Update the model health display in settings modal
     */
    updateModelHealthDisplay() {
        const display = document.getElementById('modelHealthDisplay');
        if (!display) return;
        
        const statuses = this.getModelHealthStatus();
        const unavailableCount = statuses.filter(s => !s.available).length;
        const failingCount = statuses.filter(s => s.available && s.failures > 0).length;
        
        if (unavailableCount > 0) {
            display.textContent = `${unavailableCount} model(s) temporarily unavailable`;
            display.className = 'status-value error';
        } else if (failingCount > 0) {
            display.textContent = `${failingCount} model(s) experiencing issues`;
            display.className = 'status-value warning';
        } else {
            display.textContent = 'All models available';
            display.className = 'status-value';
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
            // Use fallback system for resilient API calls
            const result = await this.executeWithFallback(
                () => this.callTranslationAPI(text),
                { showNotifications: true }
            );
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
        
        const requestBody = this.formatRequestBody(apiConfig, messages, 16000, 0.3);
        
        console.log('Translation API Call:', { endpoint: apiConfig.endpoint, model: apiConfig.model, isO1: apiConfig.isO1Model });
        
        let response;
        try {
            response = await fetch(apiConfig.endpoint, {
                method: 'POST',
                headers: apiConfig.headers,
                body: JSON.stringify(requestBody)
            });
        } catch (fetchError) {
            // Handle CORS or network errors
            if (apiConfig.isAnthropicDirect) {
                throw new Error('Anthropic API cannot be called directly from browsers due to CORS restrictions. Please use OpenRouter instead - it provides access to Claude models and works in browsers. Go to Settings and select OpenRouter as your provider.');
            }
            throw new Error(`Network error: ${fetchError.message}. Please check your internet connection.`);
        }
        
        if (!response.ok) {
            await this.handleApiError(response, apiConfig);
        }
        
        const data = await response.json();
        console.log('Translation Response OK');
        const content = this.parseApiResponse(data, apiConfig);
        
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
            // Use fallback system for resilient API calls
            const result = await this.executeWithFallback(
                () => this.callEnhancementAPI(text),
                { showNotifications: true }
            );
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
        
        const requestBody = this.formatRequestBody(apiConfig, messages, 16000, 0.4);
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            await this.handleApiError(response, apiConfig);
        }
        
        const data = await response.json();
        const content = this.parseApiResponse(data, apiConfig);
        
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
        
        const requestBody = this.formatRequestBody(apiConfig, messages, 8000, 0.3);
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            await this.handleApiError(response, apiConfig);
        }
        
        const data = await response.json();
        const content = this.parseApiResponse(data, apiConfig);
        
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
            // Use fallback system for resilient API calls
            const result = await this.executeWithFallback(
                () => this.callAgentAPI(text),
                { showNotifications: true }
            );
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
        
        const requestBody = this.formatRequestBody(apiConfig, messages, 16000, 0.4);
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            await this.handleApiError(response, apiConfig);
        }
        
        const data = await response.json();
        const content = this.parseApiResponse(data, apiConfig);
        
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
    
    // ==========================================
    // STRATEGY AI AGENT METHODS
    // ==========================================
    
    async refineStrategy() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showToast('Please enter your strategic objectives or action plan to refine.', 'error');
            return;
        }
        
        // Validate API key for selected model
        const apiConfig = this.getApiConfig();
        if (!apiConfig.apiKey) {
            this.showModal();
            return;
        }
        
        if (text.length > 15000) {
            this.showToast('Text is too long. Maximum 15000 characters allowed for strategy mode.', 'error');
            return;
        }
        
        this.setLoading(true);
        this.hideStrategy();
        
        try {
            // Use fallback system for resilient API calls
            const result = await this.executeWithFallback(
                () => this.callStrategyAPI(text),
                { showNotifications: true }
            );
            this.displayStrategyResponse(result);
        } catch (error) {
            console.error('Strategy agent error:', error);
            this.showToast(error.message || 'Strategy refinement failed. Please try again.', 'error');
            this.outputArea.innerHTML = '<div class="placeholder-text">Strategy refinement failed. Please try again.</div>';
        } finally {
            this.setLoading(false);
        }
    }
    
    async callStrategyAPI(text) {
        // Build conversation history context
        const historyContext = this.strategyConversationHistory.length > 0 
            ? `\n\nPrevious strategy refinement context:\n${this.strategyConversationHistory.slice(-3).map((h, i) => `Input ${i+1}: ${h.input.substring(0, 200)}...\nRefined: ${h.summary}`).join('\n\n')}\n\n---\nContinuing refinement:`
            : '';
        
        const systemPrompt = `You are a specialized Strategy Refinement AI Agent for Matanuska Transport Company operating in South Africa and Zimbabwe.

COMPANY CONTEXT:
- Company: Matanuska Transport
- Industry: Transport and Logistics
- Operations: South Africa and Zimbabwe cross-border transportation
- Focus Areas: Fleet management, route optimization, cross-border logistics, delivery scheduling
- Key Concerns: Budget planning, operational efficiency, regulatory compliance, vehicle maintenance

YOUR PRIMARY MISSION:
1. SIMPLIFY & SHORTEN: Transform verbose strategic objectives into clear, concise statements
2. MAINTAIN MEANING: Preserve the strategic intent while reducing word count
3. IMPROVE CLARITY: Make objectives actionable and measurable where possible
4. INDUSTRY ALIGNMENT: Ensure alignment with transport industry best practices
5. REGIONAL CONTEXT: Consider South Africa/Zimbabwe operational realities

RESPONSE FORMAT - Always use this exact JSON structure:
{
    "summary": "Brief 2-3 sentence analysis of the input and what was refined",
    
    "refinedStrategy": {
        "title": "Refined Strategic Plan",
        "content": "The complete refined version of the strategic objectives. Each objective should be:\n- Concise (aim for 50% reduction in word count)\n- Clear and actionable\n- Measurable where possible\n- Formatted with bullet points and clear headings\n\nUse this format for each objective:\n**[Objective Name]**: [Concise description] | Target: [specific target if applicable] | Timeline: [if mentioned]"
    },
    
    "comparison": [
        {
            "original": "The original verbose text",
            "refined": "The simplified, shorter version",
            "wordReduction": "65%",
            "clarityImprovement": "What was improved"
        }
    ],
    
    "objectivesAnalysis": [
        {
            "objective": "Objective name",
            "status": "clear|needs_work|vague",
            "isMeasurable": true|false,
            "isActionable": true|false,
            "suggestions": ["Specific improvement suggestion"]
        }
    ],
    
    "clarityImprovements": [
        {
            "issue": "What made the original unclear",
            "solution": "How it was fixed",
            "example": "Before → After example"
        }
    ],
    
    "industryAlignment": {
        "strengths": ["How the strategy aligns with transport best practices"],
        "gaps": ["Missing industry considerations"],
        "recommendations": ["Industry-specific improvements"]
    },
    
    "budgetConsiderations": [
        {
            "item": "Budget-related aspect",
            "consideration": "What to consider for budget planning",
            "priority": "high|medium|low"
        }
    ],
    
    "regionalFactors": {
        "southAfrica": ["SA-specific considerations"],
        "zimbabwe": ["Zimbabwe-specific considerations"],
        "crossBorder": ["Cross-border operational factors"]
    },
    
    "refinedActions": [
        {
            "action": "Clear, concise action item",
            "owner": "Suggested responsibility",
            "timeline": "Suggested timeline",
            "kpi": "How to measure success"
        }
    ],
    
    "followUpQuestions": [
        {
            "question": "Question to help further refine the strategy",
            "purpose": "Why this question matters",
            "category": "clarity|budget|operations|timeline|risk"
        }
    ]
}

REFINEMENT GUIDELINES:
1. Cut unnecessary words: "in order to" → "to", "due to the fact that" → "because"
2. Remove redundancy: Don't repeat the same idea in different words
3. Use active voice: "Vehicles will be acquired" → "Acquire vehicles"
4. Be specific: "improve performance" → "reduce delivery time by 20%"
5. One idea per objective: Split compound objectives
6. Start with action verbs: Expand, Reduce, Implement, Establish, Optimize

TRANSPORT INDUSTRY TERMINOLOGY:
- Fleet utilization, vehicle uptime, route optimization
- Cross-border logistics, customs compliance, transit times
- Maintenance schedules, fuel efficiency, driver management
- Load optimization, delivery windows, service level agreements

Always respond with valid JSON only, no additional text.`;

        const apiConfig = this.getApiConfig();
        
        const messages = apiConfig.isO1Model 
            ? [{ role: 'user', content: `${systemPrompt}\n\n---\n\n${historyContext}Please refine the following strategic objectives. Simplify, shorten, and improve clarity while maintaining the strategic intent:\n\n"${text}"` }]
            : [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `${historyContext}Please refine the following strategic objectives. Simplify, shorten, and improve clarity while maintaining the strategic intent:\n\n"${text}"` }
            ];
        
        const requestBody = this.formatRequestBody(apiConfig, messages, 16000, 0.3);
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            await this.handleApiError(response, apiConfig);
        }
        
        const data = await response.json();
        const content = this.parseApiResponse(data, apiConfig);
        
        if (!content) {
            throw new Error('No response received from Strategy Agent');
        }
        
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('Invalid response format');
        } catch (e) {
            console.error('JSON parse error:', e);
            throw new Error('Failed to parse Strategy Agent response');
        }
    }
    
    displayStrategyResponse(result) {
        this.currentStrategyResponse = result;
        
        // Save to conversation history
        const historyEntry = {
            input: this.inputText.value.trim().substring(0, 500),
            summary: result.summary || '',
            timestamp: new Date().toISOString()
        };
        this.strategyConversationHistory.push(historyEntry);
        if (this.strategyConversationHistory.length > 10) {
            this.strategyConversationHistory = this.strategyConversationHistory.slice(-10);
        }
        localStorage.setItem('strategy_conversation_history', JSON.stringify(this.strategyConversationHistory));
        
        // Display summary in output area
        if (result.summary) {
            this.outputArea.innerHTML = `
                <div class="translation-text" style="white-space: pre-wrap; line-height: 1.6;">
                    <div class="strategy-summary-output">${this.escapeHtml(result.summary)}</div>
                </div>`;
        }
        
        // Show strategy section
        this.strategySection.classList.add('visible');
        
        // Display summary
        if (result.summary && this.strategySummarySection) {
            this.strategySummarySection.classList.add('visible');
            this.strategySummary.innerHTML = `<div class="strategy-summary-text">${this.escapeHtml(result.summary)}</div>`;
        }
        
        // Display Refined Strategy (THE KEY FEATURE - copy-ready content)
        if (result.refinedStrategy && this.refinedStrategySection) {
            this.refinedStrategySection.classList.add('visible');
            const refinedContent = result.refinedStrategy.content || '';
            this.refinedStrategyContent.innerHTML = `
                <div class="refined-strategy-text">${this.formatMarkdown(refinedContent)}</div>
            `;
            
            // Set up copy button for refined strategy
            if (this.copyRefinedBtn) {
                this.copyRefinedBtn.onclick = () => this.copyRefinedStrategy();
            }
        } else if (this.refinedStrategySection) {
            this.refinedStrategySection.classList.remove('visible');
        }
        
        // Display Before/After Comparison
        if (result.comparison && result.comparison.length > 0 && this.comparisonSection) {
            this.comparisonSection.classList.add('visible');
            this.comparisonContainer.innerHTML = result.comparison.map(comp => `
                <div class="comparison-card">
                    <div class="comparison-item original">
                        <span class="comparison-label">📝 Original:</span>
                        <p>${this.escapeHtml(comp.original)}</p>
                    </div>
                    <div class="comparison-arrow">→</div>
                    <div class="comparison-item refined">
                        <span class="comparison-label">✨ Refined:</span>
                        <p>${this.escapeHtml(comp.refined)}</p>
                    </div>
                    <div class="comparison-stats">
                        <span class="word-reduction">📉 ${comp.wordReduction} shorter</span>
                        <span class="clarity-note">💡 ${this.escapeHtml(comp.clarityImprovement)}</span>
                    </div>
                </div>
            `).join('');
        } else if (this.comparisonSection) {
            this.comparisonSection.classList.remove('visible');
        }
        
        // Display Objectives Analysis
        if (result.objectivesAnalysis && result.objectivesAnalysis.length > 0 && this.objectivesAnalysisSection) {
            this.objectivesAnalysisSection.classList.add('visible');
            this.objectivesAnalysis.innerHTML = result.objectivesAnalysis.map(obj => `
                <div class="objective-card ${obj.status}">
                    <div class="objective-header">
                        <span class="objective-name">${this.escapeHtml(obj.objective)}</span>
                        <span class="objective-status ${obj.status}">${obj.status === 'clear' ? '✅ Clear' : obj.status === 'needs_work' ? '⚠️ Needs Work' : '❓ Vague'}</span>
                    </div>
                    <div class="objective-badges">
                        <span class="badge ${obj.isMeasurable ? 'good' : 'warning'}">${obj.isMeasurable ? '📊 Measurable' : '📊 Not Measurable'}</span>
                        <span class="badge ${obj.isActionable ? 'good' : 'warning'}">${obj.isActionable ? '✓ Actionable' : '✗ Not Actionable'}</span>
                    </div>
                    ${obj.suggestions && obj.suggestions.length > 0 ? `
                        <ul class="objective-suggestions">
                            ${obj.suggestions.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('');
        } else if (this.objectivesAnalysisSection) {
            this.objectivesAnalysisSection.classList.remove('visible');
        }
        
        // Display Clarity Improvements
        if (result.clarityImprovements && result.clarityImprovements.length > 0 && this.clarityImprovementsSection) {
            this.clarityImprovementsSection.classList.add('visible');
            this.clarityImprovements.innerHTML = result.clarityImprovements.map(imp => `
                <div class="clarity-card">
                    <div class="clarity-issue">⚠️ <strong>Issue:</strong> ${this.escapeHtml(imp.issue)}</div>
                    <div class="clarity-solution">✅ <strong>Solution:</strong> ${this.escapeHtml(imp.solution)}</div>
                    ${imp.example ? `<div class="clarity-example">📝 ${this.escapeHtml(imp.example)}</div>` : ''}
                </div>
            `).join('');
        } else if (this.clarityImprovementsSection) {
            this.clarityImprovementsSection.classList.remove('visible');
        }
        
        // Display Industry Alignment
        if (result.industryAlignment && this.industryAlignmentSection) {
            this.industryAlignmentSection.classList.add('visible');
            let alignmentHtml = '';
            
            if (result.industryAlignment.strengths && result.industryAlignment.strengths.length > 0) {
                alignmentHtml += `<div class="alignment-group strengths">
                    <h4>🚛 Industry Alignment Strengths</h4>
                    <ul>${result.industryAlignment.strengths.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}</ul>
                </div>`;
            }
            if (result.industryAlignment.gaps && result.industryAlignment.gaps.length > 0) {
                alignmentHtml += `<div class="alignment-group gaps">
                    <h4>⚠️ Missing Industry Considerations</h4>
                    <ul>${result.industryAlignment.gaps.map(g => `<li>${this.escapeHtml(g)}</li>`).join('')}</ul>
                </div>`;
            }
            if (result.industryAlignment.recommendations && result.industryAlignment.recommendations.length > 0) {
                alignmentHtml += `<div class="alignment-group recommendations">
                    <h4>💡 Industry Recommendations</h4>
                    <ul>${result.industryAlignment.recommendations.map(r => `<li>${this.escapeHtml(r)}</li>`).join('')}</ul>
                </div>`;
            }
            this.industryAlignment.innerHTML = alignmentHtml;
        } else if (this.industryAlignmentSection) {
            this.industryAlignmentSection.classList.remove('visible');
        }
        
        // Display Budget Considerations
        if (result.budgetConsiderations && result.budgetConsiderations.length > 0 && this.budgetImplicationsSection) {
            this.budgetImplicationsSection.classList.add('visible');
            this.budgetImplications.innerHTML = `<div class="budget-grid">${result.budgetConsiderations.map(b => `
                <div class="budget-card ${b.priority}">
                    <div class="budget-priority ${b.priority}">${b.priority === 'high' ? '🔴' : b.priority === 'medium' ? '🟡' : '🟢'} ${b.priority} priority</div>
                    <div class="budget-item">${this.escapeHtml(b.item)}</div>
                    <div class="budget-consideration">${this.escapeHtml(b.consideration)}</div>
                </div>
            `).join('')}</div>`;
        } else if (this.budgetImplicationsSection) {
            this.budgetImplicationsSection.classList.remove('visible');
        }
        
        // Display Regional Considerations
        if (result.regionalFactors && this.regionalSection) {
            this.regionalSection.classList.add('visible');
            let regionalHtml = '';
            
            if (result.regionalFactors.southAfrica && result.regionalFactors.southAfrica.length > 0) {
                regionalHtml += `<div class="regional-group south-africa">
                    <h4>🇿🇦 South Africa</h4>
                    <ul>${result.regionalFactors.southAfrica.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}</ul>
                </div>`;
            }
            if (result.regionalFactors.zimbabwe && result.regionalFactors.zimbabwe.length > 0) {
                regionalHtml += `<div class="regional-group zimbabwe">
                    <h4>🇿🇼 Zimbabwe</h4>
                    <ul>${result.regionalFactors.zimbabwe.map(z => `<li>${this.escapeHtml(z)}</li>`).join('')}</ul>
                </div>`;
            }
            if (result.regionalFactors.crossBorder && result.regionalFactors.crossBorder.length > 0) {
                regionalHtml += `<div class="regional-group cross-border">
                    <h4>🌍 Cross-Border Operations</h4>
                    <ul>${result.regionalFactors.crossBorder.map(c => `<li>${this.escapeHtml(c)}</li>`).join('')}</ul>
                </div>`;
            }
            this.regionalConsiderations.innerHTML = regionalHtml;
        } else if (this.regionalSection) {
            this.regionalSection.classList.remove('visible');
        }
        
        // Display Refined Actions
        if (result.refinedActions && result.refinedActions.length > 0 && this.strategyActionsSection) {
            this.strategyActionsSection.classList.add('visible');
            this.strategyActions.innerHTML = `<div class="actions-list">${result.refinedActions.map((action, index) => `
                <div class="action-card">
                    <div class="action-number">${index + 1}</div>
                    <div class="action-details">
                        <div class="action-text">${this.escapeHtml(action.action)}</div>
                        <div class="action-meta">
                            ${action.owner ? `<span class="action-owner">👤 ${this.escapeHtml(action.owner)}</span>` : ''}
                            ${action.timeline ? `<span class="action-timeline">📅 ${this.escapeHtml(action.timeline)}</span>` : ''}
                            ${action.kpi ? `<span class="action-kpi">📊 ${this.escapeHtml(action.kpi)}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}</div>`;
        } else if (this.strategyActionsSection) {
            this.strategyActionsSection.classList.remove('visible');
        }
        
        // Display Follow-up Questions
        if (result.followUpQuestions && result.followUpQuestions.length > 0 && this.strategyQuestionsSection) {
            this.strategyQuestionsSection.classList.add('visible');
            this.strategyQuestionsList.innerHTML = `
                <div class="strategy-questions-intro">
                    <span class="intro-icon">🎯</span>
                    <span>Click a question to refine your strategy further:</span>
                </div>
                <div class="strategy-questions-grid">
                    ${result.followUpQuestions.map(q => `
                        <div class="strategy-question-card" onclick="document.getElementById('strategyFollowUpInput').value = '${this.escapeHtml(q.question).replace(/'/g, "\\'")}'; document.getElementById('strategyFollowUpInput').focus();">
                            <span class="question-category-icon">${this.getStrategyCategoryIcon(q.category)}</span>
                            <div class="question-details">
                                <span class="question-text">${this.escapeHtml(q.question)}</span>
                                <span class="question-purpose">${this.escapeHtml(q.purpose)}</span>
                            </div>
                            <span class="question-category-tag ${q.category}">${this.escapeHtml(q.category)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="follow-up-input-container">
                    <input type="text" id="strategyFollowUpInput" class="follow-up-input" placeholder="Ask a question or paste additional strategy content..." />
                    <button class="follow-up-submit-btn" id="strategyFollowUpSubmitBtn" title="Refine further">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            `;
            
            // Bind follow-up input events
            const followUpInput = document.getElementById('strategyFollowUpInput');
            const followUpSubmitBtn = document.getElementById('strategyFollowUpSubmitBtn');
            
            if (followUpInput && followUpSubmitBtn) {
                followUpSubmitBtn.onclick = () => this.askStrategyFollowUp();
                followUpInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.askStrategyFollowUp();
                    }
                });
            }
        } else if (this.strategyQuestionsSection) {
            this.strategyQuestionsSection.classList.remove('visible');
        }
        
        // Bind copy and clear buttons
        if (this.copyStrategyBtn) {
            this.copyStrategyBtn.onclick = () => this.copyStrategyResponse();
        }
        if (this.clearStrategyHistoryBtn) {
            this.clearStrategyHistoryBtn.onclick = () => this.clearStrategyHistory();
        }
    }
    
    getStrategyCategoryIcon(category) {
        const icons = {
            'clarity': '💡',
            'budget': '💰',
            'operations': '⚙️',
            'timeline': '📅',
            'risk': '⚠️'
        };
        return icons[category] || '❓';
    }
    
    async askStrategyFollowUp() {
        const followUpInput = document.getElementById('strategyFollowUpInput');
        if (!followUpInput) return;
        
        const question = followUpInput.value.trim();
        if (!question) {
            this.showToast('Please enter a question or additional content', 'error');
            return;
        }
        
        // Add context about what we're asking about
        const contextualQuestion = `Regarding the previous strategy refinement, please address: ${question}`;
        
        // Set the main input and trigger the strategy agent
        this.inputText.value = contextualQuestion;
        followUpInput.value = '';
        
        // Scroll to top and trigger refinement
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.refineStrategy();
    }
    
    async copyRefinedStrategy() {
        if (!this.currentStrategyResponse || !this.currentStrategyResponse.refinedStrategy) {
            this.showToast('No refined strategy to copy.', 'error');
            return;
        }
        
        const content = this.currentStrategyResponse.refinedStrategy.content;
        
        try {
            await navigator.clipboard.writeText(content);
            this.showToast('Refined strategy copied to clipboard!', 'success');
        } catch (err) {
            this.showToast('Failed to copy. Please select and copy manually.', 'error');
        }
    }
    
    async copyStrategyResponse() {
        if (!this.currentStrategyResponse) {
            this.showToast('No strategy analysis to copy.', 'error');
            return;
        }
        
        let text = '';
        const r = this.currentStrategyResponse;
        
        text += `STRATEGY REFINEMENT ANALYSIS\n${'='.repeat(50)}\n`;
        text += `Generated for: Matanuska Transport (SA/Zimbabwe Operations)\n\n`;
        
        if (r.summary) {
            text += `SUMMARY\n${'-'.repeat(30)}\n${r.summary}\n\n`;
        }
        
        if (r.refinedStrategy) {
            text += `REFINED STRATEGY (Copy & Use)\n${'='.repeat(50)}\n`;
            text += `${r.refinedStrategy.content}\n\n`;
        }
        
        if (r.comparison?.length > 0) {
            text += `BEFORE & AFTER COMPARISON\n${'-'.repeat(30)}\n`;
            r.comparison.forEach((c, i) => {
                text += `\n${i + 1}. Original: ${c.original}\n`;
                text += `   Refined: ${c.refined}\n`;
                text += `   (${c.wordReduction} shorter - ${c.clarityImprovement})\n`;
            });
            text += '\n';
        }
        
        if (r.objectivesAnalysis?.length > 0) {
            text += `OBJECTIVES ANALYSIS\n${'-'.repeat(30)}\n`;
            r.objectivesAnalysis.forEach(obj => {
                text += `• ${obj.objective}: ${obj.status.toUpperCase()}\n`;
                text += `  Measurable: ${obj.isMeasurable ? 'Yes' : 'No'} | Actionable: ${obj.isActionable ? 'Yes' : 'No'}\n`;
                if (obj.suggestions?.length > 0) {
                    obj.suggestions.forEach(s => text += `  → ${s}\n`);
                }
            });
            text += '\n';
        }
        
        if (r.industryAlignment) {
            text += `TRANSPORT INDUSTRY ALIGNMENT\n${'-'.repeat(30)}\n`;
            if (r.industryAlignment.strengths?.length > 0) {
                text += 'Strengths:\n';
                r.industryAlignment.strengths.forEach(s => text += `  ✓ ${s}\n`);
            }
            if (r.industryAlignment.gaps?.length > 0) {
                text += 'Gaps:\n';
                r.industryAlignment.gaps.forEach(g => text += `  ⚠ ${g}\n`);
            }
            if (r.industryAlignment.recommendations?.length > 0) {
                text += 'Recommendations:\n';
                r.industryAlignment.recommendations.forEach(rec => text += `  → ${rec}\n`);
            }
            text += '\n';
        }
        
        if (r.budgetConsiderations?.length > 0) {
            text += `BUDGET CONSIDERATIONS\n${'-'.repeat(30)}\n`;
            r.budgetConsiderations.forEach(b => {
                text += `[${b.priority.toUpperCase()}] ${b.item}\n`;
                text += `  ${b.consideration}\n`;
            });
            text += '\n';
        }
        
        if (r.regionalFactors) {
            text += `REGIONAL FACTORS (SA/ZIMBABWE)\n${'-'.repeat(30)}\n`;
            if (r.regionalFactors.southAfrica?.length > 0) {
                text += '🇿🇦 South Africa:\n';
                r.regionalFactors.southAfrica.forEach(s => text += `  • ${s}\n`);
            }
            if (r.regionalFactors.zimbabwe?.length > 0) {
                text += '🇿🇼 Zimbabwe:\n';
                r.regionalFactors.zimbabwe.forEach(z => text += `  • ${z}\n`);
            }
            if (r.regionalFactors.crossBorder?.length > 0) {
                text += '🌍 Cross-Border:\n';
                r.regionalFactors.crossBorder.forEach(c => text += `  • ${c}\n`);
            }
            text += '\n';
        }
        
        if (r.refinedActions?.length > 0) {
            text += `REFINED ACTION ITEMS\n${'-'.repeat(30)}\n`;
            r.refinedActions.forEach((a, i) => {
                text += `${i + 1}. ${a.action}\n`;
                if (a.owner) text += `   Owner: ${a.owner}\n`;
                if (a.timeline) text += `   Timeline: ${a.timeline}\n`;
                if (a.kpi) text += `   KPI: ${a.kpi}\n`;
            });
            text += '\n';
        }
        
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Full strategy analysis copied to clipboard!', 'success');
        } catch (err) {
            this.showToast('Failed to copy. Please select and copy manually.', 'error');
        }
    }
    
    hideStrategy() {
        this.strategySection?.classList.remove('visible');
        this.strategySummarySection?.classList.remove('visible');
        this.refinedStrategySection?.classList.remove('visible');
        this.comparisonSection?.classList.remove('visible');
        this.objectivesAnalysisSection?.classList.remove('visible');
        this.clarityImprovementsSection?.classList.remove('visible');
        this.industryAlignmentSection?.classList.remove('visible');
        this.budgetImplicationsSection?.classList.remove('visible');
        this.regionalSection?.classList.remove('visible');
        this.strategyActionsSection?.classList.remove('visible');
        this.strategyQuestionsSection?.classList.remove('visible');
    }
    
    clearStrategyHistory() {
        this.strategyConversationHistory = [];
        localStorage.removeItem('strategy_conversation_history');
        this.showToast('Strategy conversation history cleared', 'success');
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
    
    // ==================== CHAT MODE METHODS ====================
    
    toggleSidebar() {
        this.chatSidebar?.classList.toggle('open');
        this.sidebarToggle?.classList.toggle('shifted');
    }
    
    toggleSystemPrompt() {
        this.systemPromptContent?.classList.toggle('visible');
        this.togglePromptBtn?.classList.toggle('rotated');
    }
    
    saveSystemPrompt() {
        if (this.systemPromptInput) {
            this.systemPrompt = this.systemPromptInput.value;
            localStorage.setItem('chat_system_prompt', this.systemPrompt);
        }
    }
    
    // Conversation Management
    createNewChat() {
        const chatId = 'chat_' + Date.now();
        const newChat = {
            id: chatId,
            title: 'New Conversation',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.chatConversations.unshift(newChat);
        this.saveChatConversations();
        this.loadChat(chatId);
        this.renderConversationsList();
        
        // Clear welcome screen
        if (this.chatWelcome) {
            this.chatWelcome.style.display = 'flex';
        }
        
        this.showToast('New conversation created', 'success');
    }
    
    loadChat(chatId) {
        const chat = this.chatConversations.find(c => c.id === chatId);
        if (!chat) return;
        
        this.currentChatId = chatId;
        this.currentChatMessages = chat.messages || [];
        localStorage.setItem('current_chat_id', chatId);
        
        // Render messages
        this.renderChatMessages();
        this.renderConversationsList();
        
        // Show/hide welcome screen
        if (this.chatWelcome) {
            this.chatWelcome.style.display = this.currentChatMessages.length === 0 ? 'flex' : 'none';
        }
    }
    
    deleteChat(chatId) {
        const index = this.chatConversations.findIndex(c => c.id === chatId);
        if (index === -1) return;
        
        this.chatConversations.splice(index, 1);
        this.saveChatConversations();
        
        // If deleted current chat, load another or create new
        if (this.currentChatId === chatId) {
            if (this.chatConversations.length > 0) {
                this.loadChat(this.chatConversations[0].id);
            } else {
                this.createNewChat();
            }
        }
        
        this.renderConversationsList();
        this.showToast('Conversation deleted', 'info');
    }
    
    saveChatConversations() {
        localStorage.setItem('chat_conversations', JSON.stringify(this.chatConversations));
    }
    
    renderConversationsList() {
        if (!this.conversationsList) return;
        
        const searchTerm = this.chatSearchInput?.value?.toLowerCase() || '';
        
        const filteredChats = this.chatConversations.filter(chat => {
            const title = chat.title?.toLowerCase() || '';
            const preview = chat.messages?.[0]?.content?.toLowerCase() || '';
            return title.includes(searchTerm) || preview.includes(searchTerm);
        });
        
        this.conversationsList.innerHTML = filteredChats.map(chat => {
            const isActive = chat.id === this.currentChatId;
            const preview = chat.messages?.[chat.messages.length - 1]?.content?.substring(0, 50) || 'Empty conversation';
            const date = new Date(chat.updatedAt || chat.createdAt).toLocaleDateString();
            
            return `
                <div class="conversation-item ${isActive ? 'active' : ''}" data-chat-id="${chat.id}">
                    <div class="conv-title">${this.escapeHtml(chat.title)}</div>
                    <div class="conv-preview">${this.escapeHtml(preview)}...</div>
                    <div class="conv-date">${date}</div>
                    <div class="conv-actions">
                        <button class="conv-action-btn rename" data-action="rename" title="Rename">✏️</button>
                        <button class="conv-action-btn delete" data-action="delete" title="Delete">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click handlers
        this.conversationsList.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.conv-action-btn')) return;
                this.loadChat(item.dataset.chatId);
            });
            
            item.querySelector('.conv-action-btn.delete')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Delete this conversation?')) {
                    this.deleteChat(item.dataset.chatId);
                }
            });
            
            item.querySelector('.conv-action-btn.rename')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const newTitle = prompt('Enter new title:', this.chatConversations.find(c => c.id === item.dataset.chatId)?.title);
                if (newTitle) {
                    this.renameChat(item.dataset.chatId, newTitle);
                }
            });
        });
    }
    
    renameChat(chatId, newTitle) {
        const chat = this.chatConversations.find(c => c.id === chatId);
        if (chat) {
            chat.title = newTitle;
            this.saveChatConversations();
            this.renderConversationsList();
        }
    }
    
    filterConversations() {
        this.renderConversationsList();
    }
    
    // Message Rendering
    renderChatMessages() {
        if (!this.chatMessages) return;
        
        // Keep welcome screen if no messages
        const welcomeHtml = this.chatWelcome ? this.chatWelcome.outerHTML : '';
        
        this.chatMessages.innerHTML = this.currentChatMessages.map((msg, index) => {
            return this.createMessageBubble(msg, index);
        }).join('');
        
        // Re-add welcome if needed
        if (this.currentChatMessages.length === 0 && welcomeHtml) {
            this.chatMessages.innerHTML = welcomeHtml;
            this.chatWelcome = document.getElementById('chatWelcome');
        }
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Apply syntax highlighting
        this.applySyntaxHighlighting();
    }
    
    createMessageBubble(msg, index) {
        const isUser = msg.role === 'user';
        const avatarIcon = isUser 
            ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
            : '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>';
        
        let content = msg.content;
        
        // Parse markdown for assistant messages
        if (!isUser && typeof marked !== 'undefined') {
            try {
                content = marked.parse(content);
            } catch (e) {
                content = this.escapeHtml(content);
            }
        } else {
            content = this.escapeHtml(content).replace(/\n/g, '<br>');
        }
        
        // Add image if present
        let imageHtml = '';
        if (msg.image) {
            imageHtml = `<img src="${msg.image}" class="message-image" alt="Uploaded image">`;
        }
        
        const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
        const model = msg.model || '';
        
        return `
            <div class="message ${isUser ? 'user' : 'assistant'}" data-index="${index}">
                <div class="message-avatar">${avatarIcon}</div>
                <div class="message-content">
                    ${imageHtml}
                    <div class="message-bubble">${content}</div>
                    <div class="message-meta">
                        <span class="message-time">${timestamp}</span>
                        ${model ? `<span class="message-model">${model}</span>` : ''}
                    </div>
                    <div class="message-actions">
                        <button class="message-action-btn" data-action="copy" title="Copy">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                            Copy
                        </button>
                        ${!isUser ? `
                            <button class="message-action-btn" data-action="regenerate" title="Regenerate">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                                Regenerate
                            </button>
                        ` : ''}
                        <button class="message-action-btn" data-action="speak" title="Read aloud">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                            Speak
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    applySyntaxHighlighting() {
        if (typeof hljs !== 'undefined') {
            this.chatMessages?.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }
    
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
    
    // Image Upload
    handleImageUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please upload an image file', 'error');
            return;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showToast('Image must be less than 10MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.pendingImage = e.target.result;
            if (this.imagePreview) this.imagePreview.src = this.pendingImage;
            if (this.imagePreviewContainer) this.imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    removeUploadedImage() {
        this.pendingImage = null;
        if (this.imagePreviewContainer) this.imagePreviewContainer.style.display = 'none';
        if (this.chatImageInput) this.chatImageInput.value = '';
    }
    
    // Send Message
    async sendChatMessage() {
        const content = this.chatInput?.value?.trim();
        if (!content && !this.pendingImage) return;
        
        // Create new chat if none exists
        if (!this.currentChatId) {
            this.createNewChat();
        }
        
        // Hide welcome screen
        if (this.chatWelcome) {
            this.chatWelcome.style.display = 'none';
        }
        
        // Create user message
        const userMessage = {
            role: 'user',
            content: content,
            image: this.pendingImage,
            timestamp: new Date().toISOString()
        };
        
        // Add to messages
        this.currentChatMessages.push(userMessage);
        this.renderChatMessages();
        
        // Clear input
        if (this.chatInput) {
            this.chatInput.value = '';
            this.chatInput.style.height = 'auto';
        }
        this.removeUploadedImage();
        
        // Update chat title if first message
        this.updateChatTitle(content);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Send to API with streaming
        await this.streamChatResponse();
    }
    
    updateChatTitle(content) {
        const chat = this.chatConversations.find(c => c.id === this.currentChatId);
        if (chat && (chat.title === 'New Conversation' || !chat.title)) {
            chat.title = content.substring(0, 40) + (content.length > 40 ? '...' : '');
            this.saveChatConversations();
            this.renderConversationsList();
        }
    }
    
    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message assistant typing';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        this.chatMessages?.appendChild(indicator);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        document.getElementById('typingIndicator')?.remove();
    }
    
    // Streaming Response
    async streamChatResponse() {
        const apiConfig = this.getApiConfig();
        
        // Build messages array
        const messages = [];
        
        // Add system prompt
        const systemContent = this.systemPrompt || 'You are a helpful AI assistant. Provide clear, accurate, and thoughtful responses.';
        if (!apiConfig.isO1Model) {
            messages.push({ role: 'system', content: systemContent });
        }
        
        // Add conversation history (last 20 messages for context)
        const historyMessages = this.currentChatMessages.slice(-20);
        for (const msg of historyMessages) {
            let content = msg.content;
            
            // Handle images for vision models
            if (msg.image && this.isVisionModel(apiConfig.model)) {
                if (apiConfig.isGoogleGemini) {
                    // Gemini format
                    content = [
                        { text: msg.content },
                        { inline_data: { mime_type: 'image/jpeg', data: msg.image.split(',')[1] } }
                    ];
                } else {
                    // OpenAI/Anthropic format
                    content = [
                        { type: 'text', text: msg.content },
                        { type: 'image_url', image_url: { url: msg.image } }
                    ];
                }
            }
            
            messages.push({ role: msg.role, content: content });
        }
        
        // For O1 models, prepend system to first user message
        if (apiConfig.isO1Model) {
            if (messages.length > 0 && messages[0].role === 'user') {
                messages[0].content = `${systemContent}\n\n---\n\n${messages[0].content}`;
            }
        }
        
        try {
            this.isStreaming = true;
            if (this.stopGenerationBtn) this.stopGenerationBtn.style.display = 'flex';
            
            // Check if provider supports streaming
            const supportsStreaming = !apiConfig.isGoogleGemini && !apiConfig.isO1Model;
            
            if (supportsStreaming) {
                await this.fetchWithStreaming(apiConfig, messages);
            } else {
                await this.fetchWithoutStreaming(apiConfig, messages);
            }
            
        } catch (error) {
            if (error.name === 'AbortError') {
                this.showToast('Generation stopped', 'info');
            } else {
                console.error('Chat error:', error);
                this.showToast('Error: ' + error.message, 'error');
                this.hideTypingIndicator();
            }
        } finally {
            this.isStreaming = false;
            if (this.stopGenerationBtn) this.stopGenerationBtn.style.display = 'none';
            this.saveChatToStorage();
        }
    }
    
    isVisionModel(model) {
        const visionModels = [
            'gpt-4o', 'gpt-4-vision', 'gpt-4-turbo',
            'claude-3', 'claude-3.5',
            'gemini-1.5', 'gemini-2',
            'grok-2-vision', 'grok-vision'
        ];
        const modelLower = model.toLowerCase();
        return visionModels.some(vm => modelLower.includes(vm));
    }
    
    async fetchWithStreaming(apiConfig, messages) {
        this.streamController = new AbortController();
        
        const requestBody = {
            model: apiConfig.model,
            messages: messages,
            max_tokens: 16000,
            stream: true
        };
        
        if (!apiConfig.isO1Model) {
            requestBody.temperature = 0.7;
        }
        
        // For Anthropic direct, format differently
        if (apiConfig.isAnthropicDirect) {
            const systemMessage = messages.find(m => m.role === 'system');
            const userMessages = messages.filter(m => m.role !== 'system');
            
            requestBody.system = systemMessage?.content || '';
            requestBody.messages = userMessages;
            delete requestBody.temperature;
        }
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody),
            signal: this.streamController.signal
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
            throw new Error(error.error?.message || 'API request failed');
        }
        
        this.hideTypingIndicator();
        
        // Create assistant message element
        const assistantMessage = {
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            model: apiConfig.model.split('/').pop()
        };
        this.currentChatMessages.push(assistantMessage);
        
        const messageIndex = this.currentChatMessages.length - 1;
        const messageHtml = this.createMessageBubble(assistantMessage, messageIndex);
        this.chatMessages.insertAdjacentHTML('beforeend', messageHtml);
        
        const messageBubble = this.chatMessages.querySelector(`.message[data-index="${messageIndex}"] .message-bubble`);
        
        // Process stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const json = JSON.parse(data);
                        let content = '';
                        
                        if (apiConfig.isAnthropicDirect) {
                            content = json.delta?.text || '';
                        } else {
                            content = json.choices?.[0]?.delta?.content || '';
                        }
                        
                        if (content) {
                            fullContent += content;
                            assistantMessage.content = fullContent;
                            
                            // Update UI with markdown
                            if (typeof marked !== 'undefined') {
                                messageBubble.innerHTML = marked.parse(fullContent) + '<span class="streaming-cursor"></span>';
                            } else {
                                messageBubble.innerHTML = this.escapeHtml(fullContent).replace(/\n/g, '<br>') + '<span class="streaming-cursor"></span>';
                            }
                            
                            this.scrollToBottom();
                        }
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
            }
        }
        
        // Remove cursor and apply final formatting
        if (messageBubble) {
            if (typeof marked !== 'undefined') {
                messageBubble.innerHTML = marked.parse(fullContent);
            } else {
                messageBubble.innerHTML = this.escapeHtml(fullContent).replace(/\n/g, '<br>');
            }
            this.applySyntaxHighlighting();
        }
        
        // Track token usage (rough estimate)
        const inputTokens = messages.reduce((sum, m) => sum + Math.ceil((m.content?.length || 0) / 4), 0);
        const outputTokens = Math.ceil(fullContent.length / 4);
        this.trackTokenUsage(inputTokens, outputTokens);
        
        // Update chat header
        this.updateChatHeader();
        
        // Show follow-up suggestions for longer responses
        if (fullContent.length > 200) {
            const suggestions = this.generateFollowupSuggestions(fullContent);
            this.showFollowupSuggestions(suggestions);
        }
        
        // Bind message actions
        this.bindMessageActions();
    }
    
    async fetchWithoutStreaming(apiConfig, messages) {
        const requestBody = this.formatRequestBody(apiConfig, messages, 16000, 0.7);
        
        const response = await fetch(apiConfig.endpoint, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
            throw new Error(error.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        const content = this.parseApiResponse(data, apiConfig);
        
        this.hideTypingIndicator();
        
        // Create assistant message
        const assistantMessage = {
            role: 'assistant',
            content: content,
            timestamp: new Date().toISOString(),
            model: apiConfig.model.split('/').pop()
        };
        this.currentChatMessages.push(assistantMessage);
        
        this.renderChatMessages();
        this.bindMessageActions();
    }
    
    bindMessageActions() {
        this.chatMessages?.querySelectorAll('.message-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const messageEl = btn.closest('.message');
                const index = parseInt(messageEl.dataset.index);
                const message = this.currentChatMessages[index];
                
                if (action === 'copy') {
                    navigator.clipboard.writeText(message.content);
                    this.showToast('Copied to clipboard', 'success');
                } else if (action === 'regenerate') {
                    this.regenerateMessage(index);
                } else if (action === 'speak') {
                    this.speakText(message.content);
                }
            });
        });
    }
    
    async regenerateMessage(index) {
        // Remove messages from index onwards
        this.currentChatMessages = this.currentChatMessages.slice(0, index);
        this.renderChatMessages();
        
        // Re-send to get new response
        this.showTypingIndicator();
        await this.streamChatResponse();
    }
    
    speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }
    
    stopStreaming() {
        if (this.streamController) {
            this.streamController.abort();
            this.streamController = null;
        }
        this.isStreaming = false;
        if (this.stopGenerationBtn) this.stopGenerationBtn.style.display = 'none';
        this.hideTypingIndicator();
    }
    
    saveChatToStorage() {
        const chat = this.chatConversations.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.messages = this.currentChatMessages;
            chat.updatedAt = new Date().toISOString();
            this.saveChatConversations();
        }
    }
    
    updateTokenCount() {
        const text = this.chatInput?.value || '';
        // Rough estimate: ~4 characters per token
        const tokens = Math.ceil(text.length / 4);
        if (this.tokenCounter) {
            this.tokenCounter.textContent = `~${tokens} tokens`;
        }
    }
    
    toggleChatSpeechRecognition() {
        if (!this.recognition) {
            this.initSpeechRecognition();
        }
        
        if (this.isRecording) {
            this.recognition?.stop();
        } else {
            this.recognition?.start();
        }
    }
    
    // Export/Import
    exportChats() {
        const data = {
            conversations: this.chatConversations,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Chats exported successfully', 'success');
    }
    
    importChats() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.conversations && Array.isArray(data.conversations)) {
                        // Merge with existing conversations
                        const existingIds = new Set(this.chatConversations.map(c => c.id));
                        const newChats = data.conversations.filter(c => !existingIds.has(c.id));
                        
                        this.chatConversations = [...newChats, ...this.chatConversations];
                        this.saveChatConversations();
                        this.renderConversationsList();
                        
                        this.showToast(`Imported ${newChats.length} conversations`, 'success');
                    }
                } catch (err) {
                    this.showToast('Invalid import file', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    // ==================== ADVANCED FEATURES ====================
    
    initAdvancedFeatures() {
        // Initialize slash commands
        this.initSlashCommands();
        
        // Initialize keyboard shortcuts
        this.initKeyboardShortcuts();
        
        // Initialize theme toggle
        this.initThemeToggle();
        
        // Initialize token tracking
        this.initTokenTracking();
        
        // Initialize follow-up suggestions
        this.initFollowupSuggestions();
        
        // Update chat header bar
        this.initChatHeader();
        
        // Initialize quick model switcher
        this.initQuickModelSwitcher();
    }
    
    // ==================== SLASH COMMANDS ====================
    
    initSlashCommands() {
        this.slashCommandsMenu = document.getElementById('slashCommandsMenu');
        
        this.slashCommands = [
            { command: '/clear', label: 'Clear conversation', icon: '🗑️', description: 'Clear all messages in current chat' },
            { command: '/system', label: 'Set system prompt', icon: '⚙️', description: 'Configure AI behavior' },
            { command: '/export', label: 'Export chat', icon: '📤', description: 'Download conversation as file' },
            { command: '/model', label: 'Change model', icon: '🤖', description: 'Switch AI model' },
            { command: '/summarize', label: 'Summarize chat', icon: '📝', description: 'Get a summary of current conversation' },
            { command: '/fork', label: 'Fork conversation', icon: '🔀', description: 'Create a branch from this point' },
            { command: '/code', label: 'Code mode', icon: '💻', description: 'Enable code-focused responses' },
            { command: '/translate', label: 'Translation mode', icon: '🌐', description: 'Enable translation focus' },
            { command: '/image', label: 'Generate image prompt', icon: '🎨', description: 'Create an image generation prompt' },
            { command: '/help', label: 'Show help', icon: '❓', description: 'Display available commands' }
        ];
        
        if (this.chatInput) {
            this.chatInput.addEventListener('input', (e) => this.handleSlashInput(e));
            this.chatInput.addEventListener('keydown', (e) => this.handleSlashKeydown(e));
        }
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (this.slashCommandsMenu && !this.slashCommandsMenu.contains(e.target) && e.target !== this.chatInput) {
                this.hideSlashCommands();
            }
        });
    }
    
    handleSlashInput(e) {
        const value = this.chatInput.value;
        const cursorPos = this.chatInput.selectionStart;
        
        // Check if typing at start or after space with /
        const beforeCursor = value.substring(0, cursorPos);
        const slashMatch = beforeCursor.match(/(?:^|\s)(\/\w*)$/);
        
        if (slashMatch) {
            this.showSlashCommands(slashMatch[1]);
        } else {
            this.hideSlashCommands();
        }
    }
    
    handleSlashKeydown(e) {
        if (!this.slashCommandsMenu || !this.slashCommandsMenu.classList.contains('visible')) return;
        
        const items = this.slashCommandsMenu.querySelectorAll('.slash-command-item');
        const selectedIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectSlashCommand(Math.min(selectedIndex + 1, items.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectSlashCommand(Math.max(selectedIndex - 1, 0));
                break;
            case 'Enter':
            case 'Tab':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    this.executeSlashCommand(this.slashCommands[selectedIndex].command);
                }
                break;
            case 'Escape':
                this.hideSlashCommands();
                break;
        }
    }
    
    showSlashCommands(filter = '/') {
        if (!this.slashCommandsMenu) return;
        
        const filterText = filter.toLowerCase();
        const filtered = this.slashCommands.filter(cmd => 
            cmd.command.toLowerCase().includes(filterText) || 
            cmd.label.toLowerCase().includes(filterText)
        );
        
        if (filtered.length === 0) {
            this.hideSlashCommands();
            return;
        }
        
        this.slashCommandsMenu.innerHTML = filtered.map((cmd, index) => `
            <div class="slash-command-item ${index === 0 ? 'selected' : ''}" data-command="${cmd.command}">
                <span class="slash-icon">${cmd.icon}</span>
                <div class="slash-content">
                    <span class="slash-label">${cmd.command}</span>
                    <span class="slash-description">${cmd.description}</span>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        this.slashCommandsMenu.querySelectorAll('.slash-command-item').forEach(item => {
            item.addEventListener('click', () => {
                this.executeSlashCommand(item.dataset.command);
            });
            item.addEventListener('mouseenter', () => {
                this.slashCommandsMenu.querySelectorAll('.slash-command-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            });
        });
        
        this.slashCommandsMenu.classList.add('visible');
    }
    
    hideSlashCommands() {
        if (this.slashCommandsMenu) {
            this.slashCommandsMenu.classList.remove('visible');
        }
    }
    
    selectSlashCommand(index) {
        const items = this.slashCommandsMenu.querySelectorAll('.slash-command-item');
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === index);
        });
    }
    
    executeSlashCommand(command) {
        this.hideSlashCommands();
        
        // Clear the slash command from input
        if (this.chatInput) {
            this.chatInput.value = '';
        }
        
        switch (command) {
            case '/clear':
                this.clearCurrentChat();
                break;
            case '/system':
                this.toggleSystemPrompt();
                this.systemPromptInput?.focus();
                break;
            case '/export':
                this.exportCurrentChat();
                break;
            case '/model':
                this.showModal();
                break;
            case '/summarize':
                this.summarizeConversation();
                break;
            case '/fork':
                this.forkConversation();
                break;
            case '/code':
                this.enableCodeMode();
                break;
            case '/translate':
                this.enableTranslateMode();
                break;
            case '/image':
                this.generateImagePrompt();
                break;
            case '/help':
                this.showCommandsHelp();
                break;
        }
    }
    
    clearCurrentChat() {
        if (confirm('Clear all messages in this conversation?')) {
            this.currentChatMessages = [];
            this.renderChatMessages();
            this.saveChatToStorage();
            if (this.chatWelcome) this.chatWelcome.style.display = 'flex';
            this.showToast('Conversation cleared', 'info');
        }
    }
    
    exportCurrentChat() {
        const chat = this.chatConversations.find(c => c.id === this.currentChatId);
        if (!chat) return;
        
        const data = {
            title: chat.title,
            messages: chat.messages,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chat.title.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Chat exported', 'success');
    }
    
    async summarizeConversation() {
        if (this.currentChatMessages.length === 0) {
            this.showToast('No messages to summarize', 'warning');
            return;
        }
        
        // Add a system message asking for summary
        const summaryRequest = 'Please provide a brief summary of our conversation so far, highlighting the key points and any conclusions or action items.';
        
        this.chatInput.value = summaryRequest;
        this.sendChatMessage();
    }
    
    forkConversation() {
        const currentChat = this.chatConversations.find(c => c.id === this.currentChatId);
        if (!currentChat) return;
        
        const forkedChat = {
            id: 'chat_' + Date.now(),
            title: `${currentChat.title} (Fork)`,
            messages: [...this.currentChatMessages],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            forkedFrom: this.currentChatId
        };
        
        this.chatConversations.unshift(forkedChat);
        this.saveChatConversations();
        this.loadChat(forkedChat.id);
        this.renderConversationsList();
        
        this.showToast('Conversation forked', 'success');
    }
    
    enableCodeMode() {
        this.systemPromptInput.value = this.promptTemplates.coder;
        this.saveSystemPrompt();
        this.showToast('Code mode enabled', 'success');
    }
    
    enableTranslateMode() {
        this.systemPromptInput.value = this.promptTemplates.translator;
        this.saveSystemPrompt();
        this.showToast('Translation mode enabled', 'success');
    }
    
    generateImagePrompt() {
        this.chatInput.value = 'Generate a detailed image prompt for an AI image generator. The subject should be: ';
        this.chatInput.focus();
        this.chatInput.setSelectionRange(this.chatInput.value.length, this.chatInput.value.length);
    }
    
    showCommandsHelp() {
        const helpText = this.slashCommands.map(cmd => 
            `**${cmd.command}** - ${cmd.description}`
        ).join('\n');
        
        // Create a help message bubble
        const helpMessage = {
            role: 'assistant',
            content: `## Available Commands\n\n${helpText}\n\n*Type a command or use the menu that appears when you type /*`,
            timestamp: new Date().toISOString()
        };
        
        this.currentChatMessages.push(helpMessage);
        this.renderChatMessages();
    }
    
    // ==================== KEYBOARD SHORTCUTS ====================
    
    initKeyboardShortcuts() {
        this.keyboardShortcutsModal = document.getElementById('keyboardShortcutsModal');
        
        // Bind close button
        document.getElementById('closeShortcutsBtn')?.addEventListener('click', () => this.toggleShortcutsModal());
        
        // Bind shortcuts button in sidebar
        document.getElementById('keyboardShortcutsBtn')?.addEventListener('click', () => this.toggleShortcutsModal());
        
        // Click outside to close
        this.keyboardShortcutsModal?.addEventListener('click', (e) => {
            if (e.target === this.keyboardShortcutsModal) {
                this.toggleShortcutsModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            // Only trigger if not in an input/textarea (except for specific shortcuts)
            const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
            
            // Ctrl/Cmd shortcuts work everywhere
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'n':
                        if (this.currentMode === 'chat') {
                            e.preventDefault();
                            this.createNewChat();
                        }
                        break;
                    case 'b':
                        if (this.currentMode === 'chat') {
                            e.preventDefault();
                            this.toggleSidebar();
                        }
                        break;
                    case 'k':
                        if (this.currentMode === 'chat') {
                            e.preventDefault();
                            this.focusSearchConversations();
                        }
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                    case '/':
                    case '?':
                        e.preventDefault();
                        this.toggleShortcutsModal();
                        break;
                }
            }
            
            // Escape key
            if (e.key === 'Escape') {
                // Stop streaming
                if (this.isStreaming) {
                    this.stopStreaming();
                }
                // Close modals
                if (this.keyboardShortcutsModal?.classList.contains('visible')) {
                    this.toggleShortcutsModal();
                }
                if (this.apiKeyModal?.classList.contains('visible')) {
                    this.hideModal();
                }
                // Close slash commands
                this.hideSlashCommands();
            }
            
            // Focus chat input with / when not typing
            if (!isTyping && e.key === '/' && this.currentMode === 'chat') {
                e.preventDefault();
                this.chatInput?.focus();
                this.chatInput.value = '/';
                this.showSlashCommands('/');
            }
        });
    }
    
    toggleShortcutsModal() {
        if (this.keyboardShortcutsModal) {
            this.keyboardShortcutsModal.classList.toggle('visible');
        }
    }
    
    focusSearchConversations() {
        if (this.chatSidebar && !this.chatSidebar.classList.contains('open')) {
            this.toggleSidebar();
        }
        setTimeout(() => this.chatSearchInput?.focus(), 100);
    }
    
    // ==================== THEME TOGGLE ====================
    
    initThemeToggle() {
        this.isDarkMode = localStorage.getItem('dark_mode') === 'true';
        this.themeToggleBtn = document.getElementById('themeToggleBtn');
        
        // Apply initial theme
        this.applyTheme();
        
        // Bind toggle
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('dark_mode', this.isDarkMode);
        this.applyTheme();
        this.showToast(`${this.isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
    }
    
    applyTheme() {
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        
        // Update icon visibility
        const sunIcon = this.themeToggleBtn?.querySelector('.sun-icon');
        const moonIcon = this.themeToggleBtn?.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            sunIcon.style.display = this.isDarkMode ? 'none' : 'block';
            moonIcon.style.display = this.isDarkMode ? 'block' : 'none';
        }
    }
    
    // ==================== TOKEN TRACKING ====================
    
    initTokenTracking() {
        this.totalTokensUsed = parseInt(localStorage.getItem('total_tokens_used') || '0');
        this.updateStatsDisplay();
    }
    
    updateStatsDisplay() {
        const totalTokensEl = document.getElementById('totalTokensUsed');
        const convoCountEl = document.getElementById('conversationCount');
        const totalConvosEl = document.getElementById('totalConversations');
        const tokenCountDisplay = document.getElementById('tokenCountDisplay');
        
        if (totalTokensEl) {
            totalTokensEl.textContent = this.formatNumber(this.totalTokensUsed);
        }
        if (convoCountEl) {
            convoCountEl.textContent = this.chatConversations.length;
        }
        if (totalConvosEl) {
            totalConvosEl.textContent = this.chatConversations.length;
        }
        if (tokenCountDisplay) {
            tokenCountDisplay.textContent = this.formatNumber(this.totalTokensUsed);
        }
    }
    
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    trackTokenUsage(inputTokens, outputTokens) {
        const total = inputTokens + outputTokens;
        this.totalTokensUsed += total;
        localStorage.setItem('total_tokens_used', this.totalTokensUsed);
        this.updateStatsDisplay();
    }
    
    // ==================== CHAT HEADER ====================
    
    initChatHeader() {
        this.updateChatHeader();
        
        // Bind header actions
        document.getElementById('bookmarkChatBtn')?.addEventListener('click', () => this.bookmarkChat());
        document.getElementById('forkChatBtn')?.addEventListener('click', () => this.forkConversation());
        document.getElementById('shareChatBtn')?.addEventListener('click', () => this.shareChat());
        document.getElementById('exportPdfBtn')?.addEventListener('click', () => this.exportChatAsPdf());
    }
    
    updateChatHeader() {
        const titleEl = document.getElementById('currentChatTitle');
        const modelBadge = document.getElementById('currentModelBadge');
        const modelIndicator = document.getElementById('modelIndicator');
        
        const currentChat = this.chatConversations.find(c => c.id === this.currentChatId);
        
        if (titleEl && currentChat) {
            titleEl.textContent = currentChat.title;
        }
        
        // Get current model name
        const modelName = this.getReadableModelName();
        if (modelBadge) modelBadge.textContent = modelName;
        if (modelIndicator) modelIndicator.textContent = modelName;
    }
    
    getReadableModelName() {
        const model = this.model || '';
        
        // Map model IDs to readable names
        const modelNames = {
            'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet',
            'anthropic/claude-3-opus': 'Claude 3 Opus',
            'anthropic/claude-3-haiku': 'Claude 3 Haiku',
            'openai/gpt-4-turbo': 'GPT-4 Turbo',
            'openai/gpt-4o': 'GPT-4o',
            'openai/gpt-4o-mini': 'GPT-4o Mini',
            'google/gemini-pro': 'Gemini Pro',
            'google/gemini-1.5-pro': 'Gemini 1.5 Pro',
            'deepseek/deepseek-chat': 'DeepSeek',
            'meta/llama-3': 'Llama 3',
            'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
            'claude-3-opus-20240229': 'Claude 3 Opus',
            'gpt-4-turbo-preview': 'GPT-4 Turbo',
            'gpt-4o': 'GPT-4o',
            'gemini-1.5-pro': 'Gemini 1.5 Pro',
            'deepseek-chat': 'DeepSeek'
        };
        
        return modelNames[model] || model.split('/').pop()?.replace(/-/g, ' ') || 'AI Model';
    }
    
    // ==================== QUICK MODEL SWITCHER ====================
    // DISABLED - Using settings modal for model selection only
    
    initQuickModelSwitcher() {
        // Quick model switcher has been removed from the UI
        // Model selection now happens only through the Settings modal
        // This function is kept as a stub to prevent errors
        return;
    }
    
    // Stub functions to prevent errors if called elsewhere
    switchQuickProvider(provider) { return; }
    updateQuickProviderTab() { return; }
    toggleQuickModelDropdown() { return; }
    openQuickModelDropdown() { return; }
    closeQuickModelDropdown() { return; }
    updateQuickModelActiveState() { return; }
    filterQuickModels(searchTerm) { return; }
    
    selectQuickModel(modelId, provider) {
        // Redirect to proper model selection via settings
        if (!modelId) return;
        
        this.model = modelId;
        this.currentProvider = provider;
        localStorage.setItem('current_provider', provider);
        
        const storageKeyMap = {
            openrouter: 'openrouter_model',
            anthropic: 'anthropic_model',
            openai: 'openai_model',
            google: 'google_model',
            deepseek: 'deepseek_model',
            grok: 'grok_model',
            groq: 'groq_model',
            together: 'together_model',
            ollama: 'ollama_model'
        };
        
        if (storageKeyMap[provider]) {
            localStorage.setItem(storageKeyMap[provider], modelId);
        }
        
        this.updateQuickModelDisplay();
        this.updateChatHeader();
        this.updateSelectionDisplay();
    }
    
    updateQuickModelDisplay() {
        const modelName = this.getReadableModelName();
        
        // Update main quick model switcher
        if (this.quickModelName) {
            this.quickModelName.textContent = modelName;
        }
        
        // Update inline model button (translation/other modes)
        if (this.inlineModelName) {
            this.inlineModelName.textContent = modelName;
        }
        
        // Update chat inline model button
        if (this.chatInlineModelName) {
            this.chatInlineModelName.textContent = modelName;
        }
        
        // Update the model badge in chat header
        const modelBadge = document.getElementById('currentModelBadge');
        if (modelBadge) {
            modelBadge.textContent = modelName;
        }
        
        // Update legacy model indicator
        const modelIndicator = document.getElementById('modelIndicator');
        if (modelIndicator) {
            modelIndicator.textContent = modelName;
        }
    }

    bookmarkChat() {
        const chat = this.chatConversations.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.bookmarked = !chat.bookmarked;
            this.saveChatConversations();
            this.showToast(chat.bookmarked ? 'Conversation bookmarked' : 'Bookmark removed', 'success');
        }
    }
    
    shareChat() {
        const chat = this.chatConversations.find(c => c.id === this.currentChatId);
        if (!chat || chat.messages.length === 0) {
            this.showToast('Nothing to share', 'warning');
            return;
        }
        
        // Create shareable text
        const shareText = chat.messages.map(m => 
            `${m.role === 'user' ? '👤 You' : '🤖 AI'}:\n${m.content}`
        ).join('\n\n---\n\n');
        
        if (navigator.share) {
            navigator.share({
                title: chat.title,
                text: shareText
            }).catch(() => {});
        } else {
            // Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Conversation copied to clipboard', 'success');
            });
        }
    }
    
    exportChatAsPdf() {
        const chat = this.chatConversations.find(c => c.id === this.currentChatId);
        if (!chat || chat.messages.length === 0) {
            this.showToast('Nothing to export', 'warning');
            return;
        }
        
        // Create printable HTML
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${chat.title}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { border-bottom: 2px solid #667eea; padding-bottom: 10px; }
                    .message { margin: 20px 0; padding: 15px; border-radius: 8px; }
                    .user { background: #e8eaff; }
                    .assistant { background: #f5f5f5; }
                    .role { font-weight: bold; margin-bottom: 8px; }
                    .timestamp { color: #888; font-size: 12px; }
                    pre { background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; overflow-x: auto; }
                    code { font-family: 'Consolas', 'Monaco', monospace; }
                </style>
            </head>
            <body>
                <h1>${chat.title}</h1>
                <p class="timestamp">Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                ${chat.messages.map(m => `
                    <div class="message ${m.role}">
                        <div class="role">${m.role === 'user' ? '👤 You' : '🤖 AI Assistant'}</div>
                        <div class="content">${this.renderMarkdownForExport(m.content)}</div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;
        
        // Open in new window and trigger print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }
    
    renderMarkdownForExport(text) {
        // Simple markdown to HTML conversion for export
        return text
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
    
    // ==================== FOLLOW-UP SUGGESTIONS ====================
    
    initFollowupSuggestions() {
        this.followupSuggestions = document.getElementById('followupSuggestions');
        this.followupButtons = document.getElementById('followupButtons');
    }
    
    showFollowupSuggestions(suggestions) {
        if (!this.followupSuggestions || !this.followupButtons) return;
        
        this.followupButtons.innerHTML = suggestions.map(s => `
            <button class="followup-btn" data-prompt="${this.escapeHtml(s)}">${this.escapeHtml(s)}</button>
        `).join('');
        
        // Add click handlers
        this.followupButtons.querySelectorAll('.followup-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.chatInput.value = btn.dataset.prompt;
                this.sendChatMessage();
                this.hideFollowupSuggestions();
            });
        });
        
        this.followupSuggestions.style.display = 'flex';
    }
    
    hideFollowupSuggestions() {
        if (this.followupSuggestions) {
            this.followupSuggestions.style.display = 'none';
        }
    }
    
    generateFollowupSuggestions(response) {
        // Extract potential follow-up topics from the response
        const suggestions = [];
        
        // Look for question-like patterns or topics
        if (response.includes('example')) {
            suggestions.push('Can you give me more examples?');
        }
        if (response.includes('code') || response.includes('```')) {
            suggestions.push('Explain this code step by step');
            suggestions.push('How can I improve this code?');
        }
        if (response.length > 500) {
            suggestions.push('Can you summarize the key points?');
        }
        
        // Default suggestions
        if (suggestions.length < 2) {
            suggestions.push('Tell me more about this');
            suggestions.push('What are the alternatives?');
        }
        
        return suggestions.slice(0, 3);
    }
}

// Initialize the translator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.translator = new AfrikaansTranslator();
});

