import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import School from "@/models/School";
import Teacher from "@/models/Teacher";
import Class from "@/models/Class";

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
    const classes = await Class.find({
      "subjects.teacher": { $in: teachers.map((t) => t._id) },
    });
    const teachersWithAssignments = teachers.map((teacher) => {
      const assignedSubjects = classes
        .map((cls) =>
          cls.subjects
            .filter(
              (subj: any) => subj.teacher.toString() === teacher._id.toString()
            )
            .map((subj: any) => ({
              className: cls.name,
              subjectName: subj.subjectName,
            }))
        )
        .flat();

      return {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        qualifications: teacher.qualifications,
        profileImage: teacher.profileImage,
        assignedSubjects,
      };
    });
    return NextResponse.json(
      { teachers: teachersWithAssignments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/principal/teachers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
