import Question from "@/models/Question";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { questionId, answer } = await req.json();
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    question.answers.push(answer);
    await question.save();
    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error("Error adding answer:", error);
    return NextResponse.json(
      { error: "Failed to add answer" },
      { status: 500 }
    );
  }
}
