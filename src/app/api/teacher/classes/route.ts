import Class from "@/models/Class";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { message: "Teacher ID is required" },
        { status: 400 }
      );
    }
    const classes = await Class.find({
      "subjects.teacher": teacherId,
    }).populate("subjects.teacher", "name email");

    return NextResponse.json({ classes }, { status: 200 });
  } catch (error) {
    console.log("Error fetching classes for teacher:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
