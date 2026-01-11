import Attendance from "@/models/Attendance";
import School from "@/models/School";
import Teacher from "@/models/Teacher";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const school = await School.findOne({ principal: decodedId.id });
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    const teachers = await Teacher.find({ school: school._id });
    const attendance = await Attendance.find({
      teacher: { $in: teachers.map((t) => t._id) },
    })
      .populate("class")
      .populate("teacher")
      .populate("records.student");

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
