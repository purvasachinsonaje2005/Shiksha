import Student from "@/models/Student";
import { promisify } from "util";
import { exec } from "child_process";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const execAsync = promisify(exec);
const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json(
        { error: "Missing studentId parameter" },
        { status: 400 }
      );
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    const { stdout, stderr } = await execAsync(
      `py -3.12 python/analyze_student.py ${student._id}`
    );
    // if (stderr) {
    //   console.error("Error executing Python script:", stderr);
    //   return NextResponse.json(
    //     { error: "Error analyzing student data" },
    //     { status: 500 }
    //   );
    // }
    const riskData = JSON.parse(stdout);
    const prompt = `Analyze the following student data and determine if the student is at risk of dropping out. Provide a risk score between 0 and 1, where 1 indicates a high risk of dropout. Also, provide a brief explanation for your assessment. Here is the student data: ${JSON.stringify(
      riskData
    )}`;
   
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    if (student) {
      student.dropoutPrediction = {
        willDropout: riskData.dropout_prediction === 0 ? "no" : "yes",
        confidence: riskData.dropout_probability,
      };
      await student.save();
    }
    return NextResponse.json({
      analysis: text,
      dropout: riskData.dropout_prediction,
      probability: riskData.dropout_probability,
    });
  } catch (error) {
    console.error("Error in analyze-student route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
