import Class from "@/models/Class";
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

    const classData = await Class.findById(classId).populate("subjects");

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ class: classData }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/principal/classes/get-class:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
