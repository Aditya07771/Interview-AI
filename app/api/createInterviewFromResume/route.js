// app/api/createInterviewFromResume/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { aiService } from "@/lib/ai-service";
import { ResumeParser } from "@/lib/resume-parser";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');
    const jobExperience = formData.get('jobExperience');
    const userEmail = formData.get('userEmail');
    const createdAt = formData.get('createdAt');

    console.log("Resume upload received:", {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      jobExperience,
      userEmail
    });

    // Validation
    if (!file) {
      return NextResponse.json(
        { message: "Resume file is required" },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { message: "User email is required" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Please upload PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    console.log("Parsing resume...");

    let resumeText;
    try {
      // Parse resume text
      resumeText = await ResumeParser.parseFile(file);
      const cleanedText = ResumeParser.cleanText(resumeText);

      console.log("Resume parsed successfully, text length:", cleanedText.length);

      if (!cleanedText || cleanedText.length < 50) {
        return NextResponse.json(
          { 
            message: "Could not extract enough text from resume. Please ensure your resume contains text (not just images) and try again, or use the 'Job Description' option instead." 
          },
          { status: 400 }
        );
      }

      resumeText = cleanedText;
    } catch (parseError) {
      console.error("Parse error:", parseError);
      
      // Return user-friendly error with suggestion
      return NextResponse.json(
        { 
          message: parseError.message || "Failed to parse resume",
          suggestion: "If your resume is image-based or scanned, please try converting it to text-based PDF, use DOCX format, or use the 'Job Description' option to manually enter your details."
        },
        { status: 400 }
      );
    }

    console.log("Analyzing resume with AI...");

    // Analyze resume with AI
    let resumeAnalysis;
    try {
      resumeAnalysis = await aiService.analyzeResume(resumeText);
      console.log("Resume analysis:", resumeAnalysis);
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
      
      // Fallback analysis
      resumeAnalysis = {
        skills: ["JavaScript", "Python", "Problem Solving"],
        experience_years: jobExperience || "0",
        job_roles: ["Software Engineer"],
        key_projects: [],
        summary: resumeText.substring(0, 200),
      };
    }

    // Extract job details from analysis
    const jobPosition = resumeAnalysis.job_roles?.[0] || 
                       resumeAnalysis.jobRoles?.[0] || 
                       "Software Engineer";
    
    const skills = resumeAnalysis.skills || [];
    const jobDescription = skills.length > 0 
      ? skills.slice(0, 10).join(', ') 
      : "General technical skills";

    const experience = jobExperience || 
                      resumeAnalysis.experience_years || 
                      resumeAnalysis.experienceYears || 
                      "0";

    console.log("Generating interview questions for:", {
      jobPosition,
      skillsCount: skills.length,
      experience
    });

    // Generate questions based on resume
    const questions = await aiService.generateQuestions({
      jobPosition: jobPosition,
      jobDescription: jobDescription,
      jobExperience: experience,
      resumeText: resumeAnalysis.summary || resumeText.substring(0, 500),
    });

    console.log("Generated", questions.length, "questions");

    const mockId = uuidv4();

    // Save to database
    const interview = await prisma.mockInterview.create({
      data: {
        mockId: mockId,
        jsonMockResp: JSON.stringify(questions),
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: experience.toString(),
        createdBy: userEmail,
        createdAt: createdAt || new Date().toISOString()
      }
    });

    console.log("Interview created successfully:", interview.mockId);

    return NextResponse.json(
      {
        message: "Interview created successfully from resume",
        mockId: interview.mockId,
        interview: {
          mockId: interview.mockId,
          jobPosition: interview.jobPosition,
          jobDesc: interview.jobDesc,
          jobExperience: interview.jobExperience,
        },
        resumeAnalysis: {
          jobPosition: jobPosition,
          skills: skills.slice(0, 5),
          experience: experience,
        },
        questionsCount: questions.length,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create interview from resume error:", error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      {
        message: "Failed to process resume. Please try again or use the 'Job Description' option.",
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}