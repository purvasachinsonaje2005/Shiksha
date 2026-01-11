import Question from "@/models/Question";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const questions = await Question.find();
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
