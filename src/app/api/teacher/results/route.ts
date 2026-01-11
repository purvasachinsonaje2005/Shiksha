import Result from "@/models/Result";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { student, classId, examType, marks } = await req.json();

    if (!student || !classId || !examType || !marks) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingResult = await Result.findOne({
      student,
      class: classId,
      examType,
    });

    if (existingResult) {
      existingResult.subjectResults = marks;
      await existingResult.save();
      return NextResponse.json(
        { message: "Result updated successfully" },
        { status: 200 }
      );
    }

    const newResult = new Result({
      student,
      class: classId,
      examType,
      subjectResults: marks,
    });
    await newResult.save();

    return NextResponse.json(
      { message: "Result saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error saving marks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
