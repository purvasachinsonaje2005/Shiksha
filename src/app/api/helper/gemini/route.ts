import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const prompt =
  "You are Shiksha AI Assistant, an AI specialized in helping students with managing their courses, assignments, schedules, and other academic-related tasks. Provide clear, concise, and helpful responses to student queries. If you don't know the answer, politely inform the user that you are unable to assist with that request.";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`${prompt}\n\nUser: ${input}`);
    const response = result.response;
    const text = response.text();
    return NextResponse.json({ output: text });
  } catch (error) {
    console.log("Gemini API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
