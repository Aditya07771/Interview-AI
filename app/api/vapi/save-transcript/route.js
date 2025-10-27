// app/api/vapi/save-transcript/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { aiService } from "@/lib/ai-service";
import { useUser } from "@clerk/nextjs";

export async function POST(request) {
  try {
    const { mockId, transcript } = await request.json();

    if (!mockId || !transcript || !Array.isArray(transcript)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get interview details
    const interview = await prisma.mockInterview.findUnique({
      where: { mockId },
    });

    if (!interview) {
      return NextResponse.json(
        { success: false, error: "Interview not found" },
        { status: 404 }
      );
    }

    const questions = JSON.parse(interview.jsonMockResp);

    // Extract user answers from transcript
    const userMessages = transcript.filter(msg => msg.role === "user");

    console.log("Processing", userMessages.length, "user responses");

    // Match answers with questions and generate feedback
    for (let i = 0; i < Math.min(questions.length, userMessages.length); i++) {
      const question = questions[i];
      const userAnswer = userMessages[i]?.text || "";

      if (userAnswer.length > 10) {
        try {
          // Generate feedback using AI
          const feedback = await aiService.generateFeedback({
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: question.answer || "",
          });

          console.log(`Feedback for Q${i + 1}:`, feedback);

          // Save to database
          await prisma.userAnswer.create({
            data: {
              mockIdRef: mockId,
              question: question.question,
              correctAns: question.answer || "",
              userAns: userAnswer,
              feedback: feedback.feedback || "Good response",
              rating: feedback.rating || "7",
              userEmail: interview.createdBy,
              createdAt: new Date().toISOString(),
            },
          });
        } catch (error) {
          console.error(`Error processing Q${i + 1}:`, error);
          // Continue with next question even if one fails
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Transcript processed successfully",
        processedCount: Math.min(questions.length, userMessages.length),
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Save transcript error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}