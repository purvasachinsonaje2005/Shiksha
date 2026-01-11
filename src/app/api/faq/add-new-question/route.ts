import FAQ from "@/models/FAQ";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || question.trim() === "") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }
    const newFAQ = new FAQ({ question: question.trim() });
    await newFAQ.save();
    return NextResponse.json(
      { message: "Question added successfully", faq: newFAQ },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding new question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
