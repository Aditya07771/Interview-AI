

// app/api/interview/[interviewId]/route.js
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

// export async function GET(request, { params }) {
//   console.log("API called with interviewId:", params.interviewId);
 
// }

export async function GET(request, { params }) {
  try {
    const { interviewId } = params;
    
    // Fetch the interview data from database
    const result = await prisma.mockInterview.findUnique({
      where: {
        mockId: interviewId,
      },
    });
    
    if (!result) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview details" },
      { status: 500 }
    );
  }
}