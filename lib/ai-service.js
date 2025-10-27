// lib/ai-service.js
import { DeepSeekService } from './deepseek-service';
import { GeminiService } from './gemini-service';

class AIServiceManager {
  constructor() {
    this.providers = {
      deepseek: new DeepSeekService(),
      gemini: new GeminiService(),
    };
    // Default provider - change this to switch AI models
    this.currentProvider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'deepseek';
  }

  setProvider(providerName) {
    if (!this.providers[providerName]) {
      throw new Error(`Provider ${providerName} not found`);
    }
    this.currentProvider = providerName;
  }

  getProvider() {
    return this.providers[this.currentProvider];
  }

  async generateQuestions(data) {
    return await this.getProvider().generateQuestions(data);
  }

  async generateFeedback(data) {
    return await this.getProvider().generateFeedback(data);
  }

  async analyzeResume(resumeText) {
    return await this.getProvider().analyzeResume(resumeText);
  }
}

export const aiService = new AIServiceManager();