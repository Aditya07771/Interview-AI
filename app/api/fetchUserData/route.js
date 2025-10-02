import { NextResponse } from "next/server";
// import prisma from "../../../utils/prisma"; // make sure you created prisma.ts as I showed before
import prisma from "@/lib/prisma";
export async function POST(request) {
  try {
    const { userEmail } = await request.json();

    const userAnswers = await prisma.userAnswer.findMany({
      where: {
        userEmail: userEmail, // simple filter
      },
    });

    return NextResponse.json(
      {
        userAnswers: userAnswers.length > 0 ? userAnswers : [],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
