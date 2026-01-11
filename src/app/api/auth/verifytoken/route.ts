import dbConfig from "@/config/db.config";
import Principal from "@/models/Principal";
import School from "@/models/School";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };
    if (!data) {
      return NextResponse.json({ error: "Invalid token" });
    }
    switch (data.role) {
      case "admin":
        return NextResponse.json({ user: data, status: 200 });
      case "principal":
        const school = await School.findOne({ principal: data.id })
          .select("-password")
          .populate("principal");
        if (!school) {
          return NextResponse.json({ error: "Principal not found" });
        }
        return NextResponse.json({ user: school, status: 200 });
      case "teacher":
        const teacher = await Teacher.findById(data.id).select("-password");
        if (!teacher) {
          return NextResponse.json({
            error: "Teacher not found",
          });
        }
        return NextResponse.json({ user: teacher, status: 200 });
      case "student":
        const student = await Student.findById(data.id)
          .select("-password")
          .populate("class");
        if (!student) {
          return NextResponse.json({
            error: "Student not found",
          });
        }
        return NextResponse.json({ user: student, status: 200 });
      case "parent":
        const parent = await Student.findOne({ email: data.email })
          .select("-password")
          .populate("class");
        if (!parent) {
          return NextResponse.json({
            error: "Parent not found",
          });
        }
        return NextResponse.json({ user: parent, status: 200 });
      default:
        return NextResponse.json({ error: "Invalid role" });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 401 });
  }
}
