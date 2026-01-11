import dbConfig from "@/config/db.config";
import Exam from "@/models/Exam";
import Semester from "@/models/Semester";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { facultyId, courseId, department, questions, courseName, title } =
      await req.json();
    if (
      !facultyId ||
      !courseId ||
      !department ||
      !questions ||
      questions.length === 0 ||
      !courseName
    ) {
      console.log("Missing fields:", {
        facultyId,
        courseId,
        department,
        questions,
        courseName,
        title,
      });
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    const semester = await Semester.findOne({
      department,
      "subjects.name": courseName,
    });
    if (!semester) {
      return NextResponse.json(
        { message: "Semester not found for the given department and course" },
        { status: 404 }
      );
    }
    const newExam = new Exam({
      title,
      department,
      semester: semester.semesterNumber,
      course: courseId,
      questions,
      date: new Date(),
      faculty: facultyId,
      isApproved: false,
    });
    await newExam.save();
    return NextResponse.json({ message: "Exam duties saved successfully" });
  } catch (error) {
    console.log("Error in saving exam duties:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
