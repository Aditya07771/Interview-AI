// // app/api/interview/answer/route.js
// import { NextResponse } from "next/server";
// import { prisma } from "@/utils/db";

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     console.log("Received body:", body);

//     const { mockIdRef, question, userAns, correctAns, feedback, rating, userEmail, createdAt } = body;

//     // Validation
//     if (!mockIdRef || !question) {
//       return NextResponse.json(
//         { success: false, error: "Mock ID and question are required" },
//         { status: 400 }
//       );
//     }

//     // Verify the mock interview exists
//     const mockInterview = await prisma.mockInterview.findUnique({
//       where: {
//         mockId: mockIdRef,
//       },
//     });

//     if (!mockInterview) {
//       return NextResponse.json(
//         { success: false, error: "Interview not found" },
//         { status: 404 }
//       );
//     }

//     // Save the answer
//     const savedAnswer = await prisma.userAnswer.create({
//       data: {
//         mockIdRef: mockIdRef,
//         question: question,
//         userAns: userAns || "",
//         correctAns: correctAns || "",
//         feedback: feedback || "",
//         rating: rating || "0",
//         userEmail: userEmail || "",
//         createdAt: createdAt || new Date().toISOString(),
//       },
//     });

//     console.log("Saved answer:", savedAnswer);

//     return NextResponse.json(
//       { 
//         success: true, 
//         data: savedAnswer,
//         message: "Answer saved successfully" 
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error saving answer:", error);
//     return NextResponse.json(
//       { success: false, error: error.message || "Failed to save answer" },
//       { status: 500 }
//     );
//   }
// }

// // GET all answers for an interview
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const mockIdRef = searchParams.get('mockIdRef');

//     if (!mockIdRef) {
//       return NextResponse.json(
//         { success: false, error: "Mock ID is required" },
//         { status: 400 }
//       );
//     }

//     const answers = await prisma.userAnswer.findMany({
//       where: {
//         mockIdRef: mockIdRef,
//       },
//       orderBy: {
//         id: "asc",
//       },
//     });

//     return NextResponse.json(
//       { success: true, data: answers },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching answers:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch answers" },
//       { status: 500 }
//     );
//   }
// }


// app/api/interview/answer/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { aiService } from "@/lib/ai-service";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const { mockIdRef, question, userAns, correctAns, userEmail, createdAt } = body;

    // Validation
    if (!mockIdRef || !question) {
      return NextResponse.json(
        { success: false, error: "Mock ID and question are required" },
        { status: 400 }
      );
    }

    // Verify the mock interview exists
    const mockInterview = await prisma.mockInterview.findUnique({
      where: {
        mockId: mockIdRef,
      },
    });

    if (!mockInterview) {
      return NextResponse.json(
        { success: false, error: "Interview not found" },
        { status: 404 }
      );
    }

    // Generate feedback using AI service (DeepSeek)
    let feedback = "";
    let rating = "0";

    if (userAns && userAns.length > 10) {
      console.log("Generating AI feedback...");
      
      const aiResponse = await aiService.generateFeedback({
        question,
        userAnswer: userAns,
        correctAnswer: correctAns || "",
      });

      console.log("AI Feedback:", aiResponse);

      feedback = aiResponse.feedback || "";
      rating = aiResponse.rating || "0";
    }

    // Save the answer
    const savedAnswer = await prisma.userAnswer.create({
      data: {
        mockIdRef: mockIdRef,
        question: question,
        correctAns: correctAns || "",
        userAns: userAns || "",
        feedback: feedback,
        rating: rating,
        userEmail: userEmail || "",
        createdAt: createdAt || new Date().toISOString(),
      },
    });

    console.log("Saved answer:", savedAnswer);

    return NextResponse.json(
      { 
        success: true, 
        data: savedAnswer,
        message: "Answer saved successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving answer:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save answer" },
      { status: 500 }
    );
  }
}

// GET endpoint remains the same...
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mockIdRef = searchParams.get('mockIdRef');

    if (!mockIdRef) {
      return NextResponse.json(
        { success: false, error: "Mock ID is required" },
        { status: 400 }
      );
    }

    const answers = await prisma.userAnswer.findMany({
      where: {
        mockIdRef: mockIdRef,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(
      { success: true, data: answers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}