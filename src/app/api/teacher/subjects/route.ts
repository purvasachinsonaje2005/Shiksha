import Courses from "@/models/Courses";
import Semester from "@/models/Semester";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const facultyId = searchParams.get("facultyId");
    if (!facultyId) {
      return NextResponse.json(
        { error: "Missing facultyId parameter" },
        { status: 400 }
      );
    }
    const courses = await Courses.find({ facultyId }).lean();
    for (const course of courses) {
      const semester = await Semester.find({
        "subjects.courseId": course._id,
        department: course.department,
      })
        .populate("subjects.courseId")
        .lean();
      if (semester.length > 0) {
        course.semester = semester[0].semesterNumber;
      } else {
        course.semester = "N/A";
      }
    }
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.log("Error fetching assigned classes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
