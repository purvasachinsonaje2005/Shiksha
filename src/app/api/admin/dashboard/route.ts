import ScholarshipApplication from "@/models/ScholarshipApplication";
import School from "@/models/School";
import Student from "@/models/Student";
import { NextResponse } from "next/server";

interface DashboardData {
  totalSchools: number;
  totalHeadmasters: number;
  totalStudents: number;
  totalScholarships: number;

  riskDistribution: number[];

  schoolsRegisteredLabels: string[];
  schoolsRegisteredData: number[];

  studentsGrowthLabels: string[];
  studentsGrowthData: number[];
}

export async function GET() {
  try {
    // ------------------------------------------------
    // BASIC COUNTS
    // ------------------------------------------------
    const totalSchools = await School.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalHeadmasters = totalSchools;
    const totalScholarships = await ScholarshipApplication.countDocuments();

    // ------------------------------------------------
    // DUMMY RISK DISTRIBUTION
    // ------------------------------------------------
    const riskDistribution = [
      Math.floor(totalStudents * 0.2),
      Math.floor(totalStudents * 0.5),
      Math.floor(totalStudents * 0.3),
    ];

    // ------------------------------------------------
    // SCHOOLS REGISTERED OVER TIME (LAST 6 MONTHS)
    // ------------------------------------------------
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const now = new Date();
    const schoolsRegisteredLabels: string[] = [];
    const schoolsRegisteredData: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);

      const schoolsCount = await School.countDocuments({
        createdAt: { $gte: month, $lt: nextMonth },
      });

      schoolsRegisteredLabels.push(months[month.getMonth()]);
      schoolsRegisteredData.push(schoolsCount);
    }

    // ------------------------------------------------
    // STUDENT GROWTH OVER TIME (LAST 6 MONTHS)
    // ------------------------------------------------
    const studentsGrowthLabels: string[] = [];
    const studentsGrowthData: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);

      const studentCount = await Student.countDocuments({
        createdAt: { $gte: month, $lt: nextMonth },
      });

      studentsGrowthLabels.push(months[month.getMonth()]);
      studentsGrowthData.push(studentCount);
    }

    const response: DashboardData = {
      totalSchools,
      totalHeadmasters,
      totalStudents,
      totalScholarships,

      riskDistribution,

      schoolsRegisteredLabels,
      schoolsRegisteredData,

      studentsGrowthLabels,
      studentsGrowthData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.log("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
