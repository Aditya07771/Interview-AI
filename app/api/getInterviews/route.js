import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { message: "User email is required" },
        { status: 400 }
      );
    }

    const interviews = await prisma.mockInterview.findMany({
      where: {
        createdBy: userEmail
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json(
      {
        interviews: interviews,
        count: interviews.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get interviews error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}