import Class from "@/models/Class";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const studentId = decoded.id;
    const classData = await Class.findOne({
      students: studentId,
    })
      .populate("students", "name email")
      .populate("subjects.teacher", "name email");
    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json({ class: classData });
  } catch (error) {
    console.error("Error in GET /students/class:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
