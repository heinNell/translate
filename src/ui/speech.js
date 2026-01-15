/**
 * Speech Manager - Handles text-to-speech and speech recognition
 */

import { SPEECH_SETTINGS } from '../config/constants.js';
import { splitIntoSentences } from '../utils/helpers.js';

class SpeechManager {
  constructor() {
    // Text-to-speech state
    this.state = 'idle'; // 'idle', 'speaking', 'paused'
    this.utterance = null;
    this.queue = [];
    this.currentIndex = 0;
    
    // Speech recognition
    this.recognition = null;
    this.isRecording = false;
    
    // Callbacks
    this.onRecognitionResult = null;
    this.onRecognitionEnd = null;
    this.onStateChange = null;
  }

  /**
   * Initialize speech recognition
   */
  initRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'af-ZA'; // Default to Afrikaans

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (this.onRecognitionResult) {
        this.onRecognitionResult(transcript, event.results[event.results.length - 1].isFinal);
      }
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      if (this.onRecognitionEnd) {
        this.onRecognitionEnd();
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isRecording = false;
    };

    return true;
  }

  /**
   * Start speech recognition
   * @param {string} lang - Language code
   */
  startRecognition(lang = 'af-ZA') {
    if (!this.recognition) {
      if (!this.initRecognition()) return false;
    }

    this.recognition.lang = lang;
    this.recognition.start();
    this.isRecording = true;
    return true;
  }

  /**
   * Stop speech recognition
   */
  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.isRecording = false;
  }

  /**
   * Toggle speech recognition
   * @param {string} lang - Language code
   */
  toggleRecognition(lang) {
    if (this.isRecording) {
      this.stopRecognition();
    } else {
      this.startRecognition(lang);
    }
    return this.isRecording;
  }

  /**
   * Check if speech synthesis is supported
   * @returns {boolean}
   */
  isSpeechSupported() {
    return 'speechSynthesis' in window;
  }

  /**
   * Speak text
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   */
  speak(text, options = {}) {
    if (!this.isSpeechSupported()) {
      console.warn('Speech synthesis not supported');
      return false;
    }

    const synth = window.speechSynthesis;

    // If already speaking, toggle pause/resume
    if (this.state === 'speaking') {
      synth.pause();
      this.state = 'paused';
      this.notifyStateChange();
      return true;
    }

    if (this.state === 'paused') {
      synth.resume();
      this.state = 'speaking';
      this.notifyStateChange();
      return true;
    }

    // Start new speech
    this.stop();
    this.queue = splitIntoSentences(text);
    this.currentIndex = 0;

    if (this.queue.length === 0) return false;

    this.state = 'speaking';
    this.notifyStateChange();
    this.speakNext(options);
    return true;
  }

  /**
   * Speak next sentence in queue
   * @param {Object} options - Speech options
   */
  speakNext(options = {}) {
    const synth = window.speechSynthesis;

    if (this.state === 'idle' || this.currentIndex >= this.queue.length) {
      this.complete();
      return;
    }

    const sentence = this.queue[this.currentIndex];
    const utterance = new SpeechSynthesisUtterance(sentence);

    // Configure voice settings
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || SPEECH_SETTINGS.defaultRate;
    utterance.pitch = options.pitch || SPEECH_SETTINGS.defaultPitch;
    utterance.volume = options.volume || SPEECH_SETTINGS.defaultVolume;

    // Select voice
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Natural'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      if (this.state !== 'idle') {
        this.currentIndex++;
        if (this.currentIndex < this.queue.length) {
          // Add pause between sentences
          setTimeout(() => {
            if (this.state === 'speaking') {
              this.speakNext(options);
            }
          }, this.getPauseDuration(sentence));
        } else {
          this.complete();
        }
      }
    };

    utterance.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech error:', event.error);
        this.currentIndex++;
        if (this.currentIndex < this.queue.length && this.state === 'speaking') {
          setTimeout(() => this.speakNext(options), 100);
        } else {
          this.complete();
        }
      }
    };

    this.utterance = utterance;
    synth.speak(utterance);
  }

  /**
   * Get pause duration based on sentence
   * @param {string} sentence - Sentence text
   * @returns {number} Pause in ms
   */
  getPauseDuration(sentence) {
    let pause = SPEECH_SETTINGS.pauseBetweenSentences;
    
    if (sentence.endsWith('?')) pause += 150;
    if (sentence.endsWith('!')) pause += 100;
    if (sentence.length > 100) pause += 100;
    
    return pause;
  }

  /**
   * Stop speech
   */
  stop() {
    if (this.isSpeechSupported()) {
      window.speechSynthesis.cancel();
    }
    this.state = 'idle';
    this.queue = [];
    this.currentIndex = 0;
    this.utterance = null;
    this.notifyStateChange();
  }

  /**
   * Complete speech
   */
  complete() {
    this.state = 'idle';
    this.queue = [];
    this.currentIndex = 0;
    this.notifyStateChange();
  }

  /**
   * Get current state
   * @returns {string}
   */
  getState() {
    return this.state;
  }

  /**
   * Notify state change
   */
  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
}

// Export singleton
export const speech = new SpeechManager();
export default speech;
