// lib/vapi-service.js
import axios from 'axios';

export class VapiService {
  constructor() {
    this.privateKey = process.env.VAPI_API_KEY;
    this.publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    this.baseURL = 'https://api.vapi.ai';
  }

  async createAssistant(interviewQuestions, jobPosition) {
    try {
      const questionsList = interviewQuestions
        .map((q, i) => `${i + 1}. ${q.question}`)
        .join('\n');

      const response = await axios.post(
        `${this.baseURL}/assistant`,
        {
          name: `Interview for ${jobPosition}`,
          model: {
            provider: 'openai',
            model: 'gpt-4o-mini',
            temperature: 0.7,
            messages: [
              {
                role: 'system',
                content: `You are a professional AI interviewer conducting an interview for a ${jobPosition} position. 

Your interview questions are:
${questionsList}

Instructions:
1. Greet the candidate warmly and professionally
2. Ask each question ONE AT A TIME
3. Wait for the candidate's complete response
4. Acknowledge their answer briefly (e.g., "Thank you", "I see", "Interesting")
5. Then move to the next question
6. After all questions, thank them and end the interview
7. Keep the conversation natural and encouraging
8. Don't provide feedback during the interview - just collect answers

Remember: Be professional, friendly, and let the candidate speak without interruption.`,
              },
            ],
          },
          voice: {
            provider: '11labs',
            voiceId: 'sarah',
          },
          firstMessage: `Hello! Welcome to your ${jobPosition} interview. I'm your AI interviewer today, and I'll be asking you ${interviewQuestions.length} questions. Please take your time to answer each question thoughtfully. Let's begin!`,
          endCallMessage: 'Thank you for completing the interview. We appreciate your time and will review your responses. Good luck!',
          recordingEnabled: true,
          endCallFunctionEnabled: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.privateKey}`, // Use private key for creating assistant
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Vapi Assistant Creation Error:', error.response?.data || error.message);
      throw new Error(`Failed to create Vapi assistant: ${error.response?.data?.message || error.message}`);
    }
  }

  // Remove createWebCall - we'll do this from the frontend instead

  async getCall(callId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/call/${callId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.privateKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Vapi Get Call Error:', error.response?.data || error.message);
      throw new Error(`Failed to get call: ${error.response?.data?.message || error.message}`);
    }
  }

  async getCallTranscript(callId) {
    try {
      const callData = await this.getCall(callId);
      
      const messages = callData.messages || [];
      const transcript = messages.map(msg => ({
        role: msg.role,
        content: msg.content || msg.message,
        timestamp: msg.timestamp,
      }));

      return {
        transcript,
        recordingUrl: callData.recordingUrl,
        status: callData.status,
        startedAt: callData.startedAt,
        endedAt: callData.endedAt,
      };
    } catch (error) {
      console.error('Vapi Transcript Error:', error.response?.data || error.message);
      throw new Error(`Failed to get transcript: ${error.message}`);
    }
  }
}

export const vapiService = new VapiService();