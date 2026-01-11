import Class from "@/models/Class";
import School from "@/models/School";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface PrincipalDashboardData {
  totalTeachers: number;
  totalStudents: number;
  totalScholarships: number;
  totalClasses: number;

  attendanceLabels: string[];
  attendanceData: number[];

  studentsPerClassLabels: string[];
  studentsPerClassData: number[];

  riskDistribution: number[];
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
    const school = await School.findOne({ principal: decodedId.id });
    const totalTeachers = school.teachers.length;
    const totalStudents = await Student.countDocuments({ school: school._id });
    const totalScholarships = await Student.countDocuments({
      school: school._id,
    });
    const totalClasses = await Class.countDocuments({ school: school._id });
    const classes = await Class.find({ school: school._id });
    // Dummy data for charts
    const attendanceLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const attendanceData = [90, 85, 88, 92, 87];
    const studentsPerClassLabels = classes.map((cls) => cls.name);
    const studentsPerClassData = classes.map((cls) => cls.students.length);
    const riskDistribution = [50, 30, 20]; // Dummy data: [low, medium, high]
    const data: PrincipalDashboardData = {
      totalTeachers,
      totalStudents,
      totalScholarships,
      totalClasses,
      attendanceLabels,
      attendanceData,
      studentsPerClassLabels,
      studentsPerClassData,
      riskDistribution,
    };
    return NextResponse.json(data);
  } catch (error) {
    console.log("Error in principal dashboard route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
