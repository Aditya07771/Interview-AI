// lib/deepseek-service.js
import axios from 'axios';

export class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.baseURL = 'https://api.deepseek.com/v1';
    this.model = 'deepseek-chat'; // or 'deepseek-coder' for technical roles
  }

  async callAPI(messages, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 4000,
          response_format: options.json ? { type: "json_object" } : undefined,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API Error:', error.response?.data || error.message);
      throw new Error(`DeepSeek API failed: ${error.message}`);
    }
  }

  async generateQuestions({ jobPosition, jobDescription, jobExperience, resumeText = null }) {
    const prompt = resumeText
      ? `You are an expert AI interviewer. Generate 5 interview questions based on:

Role: ${jobPosition}
Description: ${jobDescription}
Experience Required: ${jobExperience} years
Resume Summary: ${resumeText}

Create questions that:
- Test technical knowledge relevant to the role
- Assess problem-solving abilities
- Evaluate experience level
- Include behavioral questions

Return ONLY a valid JSON array with this structure:
[
  {
    "question": "Question text here",
    "answer": "Expected answer or key points",
    "category": "Technical/Behavioral/Situational",
    "difficulty": "Easy/Medium/Hard"
  }
]`
      : `You are an expert AI interviewer. Generate 5 interview questions for:

Role: ${jobPosition}
Tech Stack/Description: ${jobDescription}
Experience Level: ${jobExperience} years

Create diverse questions covering:
1. Technical skills
2. Problem-solving
3. System design (if senior role)
4. Behavioral assessment
5. Experience-based scenarios

Return ONLY a valid JSON array with this structure:
[
  {
    "question": "Question text here",
    "answer": "Expected answer or key points",
    "category": "Technical/Behavioral/Situational",
    "difficulty": "Easy/Medium/Hard"
  }
]`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert technical interviewer. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await this.callAPI(messages, { json: true, temperature: 0.8 });
    return JSON.parse(response);
  }

  async generateFeedback({ question, userAnswer, correctAnswer }) {
    const prompt = `Analyze this interview response and provide detailed feedback.

Question: ${question}
Expected Answer: ${correctAnswer}
User's Answer: ${userAnswer}

Evaluate based on:
- Accuracy and completeness
- Communication clarity
- Technical depth
- Problem-solving approach

Return ONLY valid JSON:
{
  "rating": "score out of 10",
  "feedback": "Detailed feedback (3-5 lines)",
  "strengths": ["point 1", "point 2"],
  "improvements": ["suggestion 1", "suggestion 2"]
}`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert interview evaluator. Provide constructive, actionable feedback. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await this.callAPI(messages, { json: true, temperature: 0.5 });
    return JSON.parse(response);
  }

  async analyzeResume(resumeText) {
    const prompt = `Analyze this resume and extract key information:

${resumeText}

Extract and return ONLY valid JSON:
{
  "skills": ["skill1", "skill2", ...],
  "experience_years": "estimated years",
  "job_roles": ["role1", "role2"],
  "key_projects": ["project1", "project2"],
  "summary": "brief professional summary"
}`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert resume analyzer. Extract structured information. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await this.callAPI(messages, { json: true });
    return JSON.parse(response);
  }
}