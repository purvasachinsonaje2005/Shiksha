import Courses from "@/models/Courses";
import Semester from "@/models/Semester";
import Student from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";

const getCurrentYear = (semester: number) => {
  switch (semester) {
    case 1:
    case 2:
      return 1;
      break;
    case 3:
    case 4:
      return 2;
      break;
    case 5:
    case 6:
      return 3;
      break;
    case 7:
    case 8:
      return 4;
      break;
    default:
      return null;
  }
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const department = searchParams.get("department");
    const course = searchParams.get("course");
    if (!department || !course) {
      return NextResponse.json(
        { error: "Missing department or course parameter" },
        { status: 400 }
      );
    }
    const exisitingCourse = await Courses.findOne({
      department,
      name: course,
    });
    if (!exisitingCourse) {
      return NextResponse.json(
        { error: "Course not found in the specified department" },
        { status: 404 }
      );
    }
    const semester = await Semester.findOne({
      department,
      "subjects.courseId": exisitingCourse._id,
    });
    if (!semester) {
      return NextResponse.json(
        { error: "No semester found for the given department and course" },
        { status: 404 }
      );
    }
    const students = await Student.find({
      stream: department,
      currentYear: getCurrentYear(Number(semester.semesterNumber)),
    }).lean();
    return NextResponse.json(
      { students, semesterNumber: semester.semesterNumber },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
