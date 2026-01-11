import Attendance from "@/models/Attendance";
import ScholarshipApplication from "@/models/ScholarshipApplication";
import Student from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }
    const student = await Student.findById(studentId)
      .select("-password")
      .select("-profileImage");
    const application = await ScholarshipApplication.find({
      student: studentId,
      "granted.isGranted": true,
    });
    const numberOfAbsences = await Attendance.countDocuments({
      "records.student": studentId,
      status: "absent",
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        student,
        schoolSupport: application.length > 0 ? "yes" : "no",
        numberOfAbsences,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
