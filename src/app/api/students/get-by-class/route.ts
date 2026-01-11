import Student from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParam = req.nextUrl.searchParams;
    const classId = searchParam.get("classId");
    if (!classId) {
      return NextResponse.json(
        { error: "classId is required" },
        { status: 400 }
      );
    }
    const students = await Student.find({ class: classId }).lean();
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.log("Error fetching students by class:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
