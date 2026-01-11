import dbConfig from "@/config/db.config";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import Class from "@/models/Class";

dbConfig();

interface TeacherDashboardData {
  assignedClasses: number;
  totalStudents: number;
  pendingAttendance: number;
  atRiskStudents: number;

  attendanceTrend: {
    labels: string[];
    data: number[];
  };

  riskDistribution: {
    data: number[];
  };
}
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const teacherId = decodedId.id;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const assignedClasses = await Class.find({
      "subjects.teacher": teacherId,
    });
    const totalStudents = assignedClasses
      .map((cls) => cls.students.length)
      .reduce((a, b) => a + b, 0);
    const pendingAttendance = 0;
    const atRiskStudents = 0;

    const attendanceTrend = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [85, 80, 90, 88],
    };
    const riskDistribution = {
      data: [10, 5, 2],
    };
    const stats: TeacherDashboardData = {
      assignedClasses: assignedClasses.length,
      totalStudents,
      pendingAttendance,
      atRiskStudents,
      attendanceTrend,
      riskDistribution,
    };
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.log("Error fetching faculty stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
