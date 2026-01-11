import Class from "@/models/Class";
import Conversation from "@/models/Convertation";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const studentId = decoded.id;

    const studentClass = await Class.findOne({ students: studentId })
      .populate("students")
      .populate("subjects.teacher");

    if (!studentClass) {
      return NextResponse.json(
        { error: "Class not found for student" },
        { status: 404 }
      );
    }

    let groupConversation = await Conversation.findOne({
      type: "group",
      "groupInfo.class": studentClass._id,
    });

    if (!groupConversation) {
      const participants = [
        ...studentClass.students.map((s: any) => ({
          _id: s._id,
          model: "Student",
        })),
        ...studentClass.subjects
          .filter((sub: any) => sub.teacher)
          .map((sub: any) => ({
            _id: sub.teacher._id,
            model: "Teacher",
          })),
      ];

      groupConversation = await Conversation.create({
        type: "group",
        participants,
        groupInfo: {
          name: `${studentClass.name} Class Group`,
          class: studentClass._id,
          school: studentClass.school,
        },
      });
    }

    for (const subject of studentClass.subjects) {
      const teacher = subject.teacher;
      if (!teacher) continue;

      const exists = await Conversation.findOne({
        type: "single",
        "participants._id": { $all: [studentId, teacher._id] },
      });

      if (!exists) {
        await Conversation.create({
          type: "single",
          participants: [
            { _id: studentId, model: "Student" },
            { _id: teacher._id, model: "Teacher" },
          ],
        });
      }
    }

    const allConversations = await Conversation.find({
      "participants._id": studentId,
    })
      .populate("participants._id")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ conversations: allConversations });
  } catch (error) {
    console.log("Error fetching student conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
