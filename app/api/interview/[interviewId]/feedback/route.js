// app/api/interview/[interviewId]/feedback/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function GET(request, { params }) {
  try {
    const { interviewId } = params;

    if (!interviewId) {
      return NextResponse.json(
        { success: false, error: "Interview ID is required" },
        { status: 400 }
      );
    }

    // Fetch all user answers for this interview
    const feedback = await prisma.userAnswer.findMany({
      where: {
        mockIdRef: interviewId,
      },
      orderBy: {
        id: "asc",
      },
    });

    console.log("Fetched feedback for interview:", interviewId, feedback);

    return NextResponse.json(
      { success: true, data: feedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}