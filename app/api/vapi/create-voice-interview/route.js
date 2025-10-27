// app/api/vapi/create-voice-interview/route.js
import { NextResponse } from "next/server";
import { vapiService } from "@/lib/vapi-service";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { mockId } = await request.json();

    if (!mockId) {
      return NextResponse.json(
        { success: false, error: "Mock ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching interview for mockId:", mockId);

    // Fetch interview questions
    const interview = await prisma.mockInterview.findUnique({
      where: { mockId },
    });

    if (!interview) {
      return NextResponse.json(
        { success: false, error: "Interview not found" },
        { status: 404 }
      );
    }

    console.log("Interview found:", interview.jobPosition);

    const questions = JSON.parse(interview.jsonMockResp);

    console.log("Creating Vapi assistant with", questions.length, "questions");

    // Create Vapi assistant (using private key on backend)
    const assistant = await vapiService.createAssistant(
      questions,
      interview.jobPosition
    );

    console.log("Assistant created:", assistant.id);

    // Return assistant ID - frontend will initiate the call using public key
    return NextResponse.json(
      {
        success: true,
        assistantId: assistant.id,
        jobPosition: interview.jobPosition,
        questionsCount: questions.length,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Vapi interview creation error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: error.response?.data || null,
      },
      { status: 500 }
    );
  }
}