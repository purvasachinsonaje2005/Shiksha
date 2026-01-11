import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Class from "@/models/Class";
import Student from "@/models/Student";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const classes = await Class.find({
      "subjects.teacher": decodedId.id,
    });
    const students = await Student.find({
      class: { $in: classes.map((c) => c._id) },
    }).populate("class");
    return NextResponse.json({ students });
  } catch (error) {
    console.log("Error fetching students:", error);
    return NextResponse.json(
      { message: "Failed to fetch students." },
      { status: 500 }
    );
  }
}
