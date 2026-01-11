import Class from "@/models/Class";
import Teacher from "@/models/Teacher";
import Principal from "@/models/Principal";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import Conversation from "@/models/Convertation";
import School from "@/models/School";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const teacherId = decoded.id;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const classes = await Class.find({ "subjects.teacher": teacherId });

    for (const classItem of classes) {
      const classData = await Class.findById(classItem._id)
        .populate("students")
        .populate("subjects.teacher");
      if (!classData) continue;
      let classGroup = await Conversation.findOne({
        type: "group",
        "groupInfo.class": classData._id,
      });

      if (!classGroup) {
        const participants = [
          ...classData.students.map((s: any) => ({
            _id: s._id,
            model: "Student",
          })),
          ...classData.subjects
            .filter((sub: any) => sub.teacher)
            .map((sub: any) => ({
              _id: sub.teacher._id,
              model: "Teacher",
            })),
        ];

        await Conversation.create({
          type: "group",
          participants,
          groupInfo: {
            name: `${classData.name} Class Group`,
            class: classData._id,
            school: classData.school,
          },
        });
      }

      for (const student of classData.students) {
        const exists = await Conversation.findOne({
          type: "single",
          "participants._id": { $all: [teacherId, student._id] },
        });

        if (!exists) {
          await Conversation.create({
            type: "single",
            participants: [
              { _id: teacherId, model: "Teacher" },
              { _id: student._id, model: "Student" },
            ],
          });
        }
      }
    }

    let teacherPrincipalGroup = await Conversation.findOne({
      type: "group",
      "groupInfo.name": "Teachers & Principal Group",
    });

    if (!teacherPrincipalGroup) {
      const allTeachers = await Teacher.find({ school: teacher.school });
      const school = await School.findById(teacher.school);
      const groupParticipants = [
        ...allTeachers.map((t: any) => ({
          _id: t._id,
          model: "Teacher",
        })),
        { _id: school.principal, model: "Principal" },
      ];

      await Conversation.create({
        type: "group",
        participants: groupParticipants,
        groupInfo: {
          name: "Teachers & Principal Group",
          school: teacher.school,
        },
      });
    }

    const conversations = await Conversation.find({
      "participants._id": teacherId,
    })
      .populate("participants._id")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.log("Error fetching teacher conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
