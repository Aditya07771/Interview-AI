// app/api/vapi/get-transcript/route.js
import { NextResponse } from "next/server";
import { vapiService } from "@/lib/vapi-service";
import prisma from "@/lib/prisma";
import { aiService } from "@/lib/ai-service";

export async function POST(request) {
  try {
    const { callId, mockId, userEmail } = await request.json();

    // Get call transcript
    const callData = await vapiService.getCallTranscript(callId);

    // Get interview questions
    const interview = await prisma.mockInterview.findUnique({
      where: { mockId },
    });

    const questions = JSON.parse(interview.jsonMockResp);

    // Extract answers from transcript
    const transcript = callData.transcript || [];
    
    // Save answers and generate feedback
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const userMessage = transcript.find(t => 
        t.role === 'user' && 
        transcript.indexOf(t) > i
      );

      if (userMessage) {
        const userAnswer = userMessage.content;

        // Generate feedback
        const feedback = await aiService.generateFeedback({
          question: question.question,
          userAnswer: userAnswer,
          correctAnswer: question.answer,
        });

        // Save to database
        await prisma.userAnswer.create({
          data: {
            mockIdRef: mockId,
            question: question.question,
            correctAns: question.answer,
            userAns: userAnswer,
            feedback: feedback.feedback,
            rating: feedback.rating,
            userEmail: userEmail,
            createdAt: new Date().toISOString(),
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Transcript processed and feedback generated",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Transcript processing error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}