// // path: app/api/createInterview/route.js

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { v4 as uuidv4 } from 'uuid';

// // Mock AI response - replace this with your actual AI integration
// const generateMockQuestions = async (jobPosition, jobDescription, jobExperience) => {
//   // This is a placeholder - replace with your actual Gemini AI integration
//   const mockQuestions = [
//     {
//       question: `Tell me about yourself and your experience in ${jobPosition}.`,
//       answer: `I have ${jobExperience} years of experience working with ${jobDescription}. I am passionate about technology and continuous learning.`
//     },
//     {
//       question: `What are your strengths in ${jobPosition}?`,
//       answer: `My key strengths include problem-solving, teamwork, and expertise in ${jobDescription}.`
//     },
//     {
//       question: `How do you handle challenging situations in your work?`,
//       answer: `I approach challenges systematically by breaking them down into smaller parts and collaborating with team members when needed.`
//     },
//     {
//       question: `Why do you want to work as a ${jobPosition}?`,
//       answer: `I am passionate about ${jobPosition} because it allows me to use my skills in ${jobDescription} to create meaningful solutions.`
//     },
//     {
//       question: `Where do you see yourself in 5 years?`,
//       answer: `In 5 years, I see myself as a senior ${jobPosition}, leading projects and mentoring junior developers.`
//     }
//   ];
  
//   return mockQuestions;
// };

// export async function POST(request) {
//   try {
//     const { jobPosition, jobDescription, jobExperience, userEmail, createdAt } = await request.json();

//     if (!jobPosition || !jobDescription || !jobExperience || !userEmail) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Generate mock interview questions (replace with your AI logic)
//     const mockQuestions = await generateMockQuestions(jobPosition, jobDescription, jobExperience);
//     const mockId = uuidv4();

//     // Save to database using Prisma
//     const interview = await prisma.mockInterview.create({
//       data: {
//         mockId: mockId,
//         jsonMockResp: JSON.stringify(mockQuestions),
//         jobPosition: jobPosition,
//         jobDesc: jobDescription,
//         jobExperience: jobExperience,
//         createdBy: userEmail,
//         createdAt: createdAt
//       }
//     });

//     return NextResponse.json(
//       {
//         message: "Interview created successfully",
//         mockId: interview.mockId,
//         interview: interview
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("Create interview error:", error);
//     return NextResponse.json(
//       {
//         message: "Internal server error",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }


// app/api/createInterview/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { aiService } from "@/lib/ai-service";

export async function POST(request) {
  try {
    const { jobPosition, jobDescription, jobExperience, userEmail, createdAt } = await request.json();

    if (!jobPosition || !jobDescription || !jobExperience || !userEmail) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Generating questions with DeepSeek AI...");

    // Generate questions using DeepSeek AI
    const questions = await aiService.generateQuestions({
      jobPosition,
      jobDescription,
      jobExperience,
    });

    console.log("Generated questions:", questions);

    const mockId = uuidv4();

    // Save to database
    const interview = await prisma.mockInterview.create({
      data: {
        mockId: mockId,
        jsonMockResp: JSON.stringify(questions),
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: jobExperience,
        createdBy: userEmail,
        createdAt: createdAt
      }
    });

    return NextResponse.json(
      {
        message: "Interview created successfully",
        mockId: interview.mockId,
        interview: interview,
        questionsCount: questions.length,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create interview error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}