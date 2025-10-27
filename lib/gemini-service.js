// lib/gemini-service.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });
  }

  async generateQuestions({ jobPosition, jobDescription, jobExperience, resumeText = null }) {
    const prompt = resumeText
      ? `Generate 5 technical interview questions for a ${jobPosition} position with ${jobExperience} years of experience.

Resume context: ${resumeText}

Tech stack/skills: ${jobDescription}

Create diverse questions that:
1. Test technical knowledge specific to their skills
2. Assess problem-solving abilities
3. Evaluate experience level
4. Include behavioral scenarios

Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Your question here",
    "answer": "Expected answer or key points",
    "category": "Technical",
    "difficulty": "Medium"
  }
]`
      : `Generate 5 interview questions for ${jobPosition} role requiring ${jobDescription} with ${jobExperience} years experience. 

Return ONLY a valid JSON array with question, answer, category, difficulty fields.`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      console.log("Gemini raw response:", text);
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini generateQuestions error:", error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  async generateFeedback({ question, userAnswer, correctAnswer }) {
    const prompt = `Evaluate this interview response:

Question: ${question}
Expected Answer: ${correctAnswer}
User's Answer: ${userAnswer}

Provide constructive feedback and a rating out of 10.

Return ONLY valid JSON with this exact structure:
{
  "rating": "8",
  "feedback": "Your detailed feedback here (3-5 sentences)"
}`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      console.log("Gemini feedback response:", text);
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini generateFeedback error:", error);
      throw new Error(`Failed to generate feedback: ${error.message}`);
    }
  }

  async analyzeResume(resumeText) {
    const prompt = `Analyze this resume and extract key information:

${resumeText}

Extract and identify:
- Technical skills and technologies
- Years of experience (estimate based on work history)
- Job roles/positions held
- Key projects or achievements
- Professional summary

Return ONLY valid JSON with this exact structure:
{
  "skills": ["skill1", "skill2", "skill3"],
  "experience_years": "5",
  "job_roles": ["Software Engineer", "Developer"],
  "key_projects": ["project1", "project2"],
  "summary": "Brief professional summary in 2-3 sentences"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      console.log("Gemini resume analysis:", text);
      
      const parsed = JSON.parse(text);
      
      // Ensure required fields exist
      return {
        skills: parsed.skills || [],
        experience_years: parsed.experience_years || parsed.experienceYears || "0",
        job_roles: parsed.job_roles || parsed.jobRoles || ["Software Engineer"],
        key_projects: parsed.key_projects || parsed.keyProjects || [],
        summary: parsed.summary || "Professional with technical experience",
      };
    } catch (error) {
      console.error("Gemini analyzeResume error:", error);
      
      // Return fallback data if AI fails
      return {
        skills: ["JavaScript", "Python", "Problem Solving"],
        experience_years: "0",
        job_roles: ["Software Engineer"],
        key_projects: [],
        summary: "Technical professional with diverse skill set",
      };
    }
  }
}