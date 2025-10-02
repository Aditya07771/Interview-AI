import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request) {
  try {
    const { mockId } = await request.json();

    if (!mockId) {
      return NextResponse.json(
        { message: "Mock ID is required" },
        { status: 400 }
      );
    }

    // Delete related UserAnswer records first
    await prisma.userAnswer.deleteMany({
      where: {
        mockIdRef: mockId
      }
    });

    // Then delete the MockInterview
    const deletedInterview = await prisma.mockInterview.delete({
      where: {
        mockId: mockId
      }
    });

    return NextResponse.json(
      {
        message: "Interview deleted successfully",
        deletedInterview
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete interview error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}