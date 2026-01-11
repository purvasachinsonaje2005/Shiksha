import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { course, content } = await req.json();
    const examDuties = await generateExamDuties(course, content);
    return NextResponse.json({ examDuties }, { status: 200 });
  } catch (error) {
    console.log("Error generating exam duties:", error);
    return NextResponse.json(
      { message: "Failed to generate exam duties" },
      { status: 500 }
    );
  }
}

const generateExamDuties = async (course: string, content: string) => {
  const model = openai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `You are an expert exam paper generator of an engineering college. Create a detailed exam question paper for the course "${course}" based on the following content: ${content}. Generate a list of questions that cover all key topics and concepts mentioned in the content. Ensure the questions are clear, concise, and relevant to the course material. Format the output as a JSON array of questions. Each question should be an object with the following structure:
    {
      "question": "Question text here",
      "marks": "Marks allocated for the question"
    } The total marks for the question paper should be 100. No need to include sections or question numbers. Just provide the list of questions in JSON format. Make sure the JSON is properly formatted and no need of any explanation just plain JSON output.`;

  const response = await model.generateContent(prompt);
  const message = response.response?.text().trim();
  const match = message?.match(/\[[\s\S]*\]/);
  const questionPaper = JSON.parse(match ? match[0] : "[]");
  return questionPaper || "No feedback generated.";
};
