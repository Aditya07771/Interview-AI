import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { mockId } = await request.json();

    if (!mockId) {
      return NextResponse.json(
        { message: "Mock ID is required" },
        { status: 400 }
      );
    }

    const interview = await prisma.mockInterview.findUnique({
      where: {
        mockId: mockId
      }
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        interview: interview
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get interview by ID error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}