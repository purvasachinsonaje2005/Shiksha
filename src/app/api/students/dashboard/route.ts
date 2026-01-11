import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Attendance from "@/models/Attendance";
import Result from "@/models/Result";
import Student from "@/models/Student";
import Class from "@/models/Class";

interface DashboardData {
  attendanceTrend: { labels: string[]; data: number[] };
  recentMarks: { subject: string; marks: number }[];
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    const student = await Student.findById(decoded.id).populate("class");
    if (!student)
      return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const classId = student.class;

    /* ---------------------- 1️⃣ ATTENDANCE TREND ---------------------- */
    const attendanceRecords = await Attendance.find({
      "records.student": decoded.id,
    });

    // Group by week and calculate presence %
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const attendanceData = weeks.map((_, i) => {
      const weekRecords = attendanceRecords.filter((rec) => {
        const weekNumber =
          Math.ceil((new Date(rec.date).getDate() + 1) / 7) - 1;
        return weekNumber === i;
      });

      if (weekRecords.length === 0) return 0;

      const total = weekRecords.length;
      const presentCount = weekRecords.filter((rec) =>
        rec.records.some(
          (r) => r.student.toString() === decoded.id && r.status === "Present"
        )
      ).length;

      return presentCount / total; // → 0–1
    });

    const attendanceTrend = {
      labels: weeks,
      data: attendanceData,
    };

    /* ---------------------- 2️⃣ RECENT MARKS ---------------------- */
    const latestResult = await Result.findOne({
      student: decoded.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const recentMarks = latestResult
      ? latestResult.subjectResults.map((s: any) => ({
          subject: s.subjectName,
          marks: s.marks,
        }))
      : [];
    /* ---------------------- 6️⃣ FINAL DASHBOARD DATA ---------------------- */
    const dashboardData: DashboardData = {
      attendanceTrend,
      recentMarks,
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
