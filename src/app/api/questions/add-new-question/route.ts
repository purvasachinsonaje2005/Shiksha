import Question from "@/models/Question";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    const newQuestion = new Question({ question, answers: [] });
    await newQuestion.save();
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.log("Error adding new question:", error);
    return NextResponse.json(
      { error: "Failed to add new question" },
      { status: 500 }
    );
  }
}
