import Result from "@/models/Result";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const classId = searchParams.get("classId");
    const studentId = searchParams.get("studentId");
    const results = await Result.find({
      class: classId,
      student: studentId,
    })
      .populate("class")
      .populate("student");
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.log("Error fetching results:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
