import Teacher from "@/models/Teacher";
import Principal from "@/models/Principal";
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
    const principalId = decoded.id;

    const principal = await Principal.findById(principalId);
    if (!principal) {
      return NextResponse.json(
        { error: "Principal not found" },
        { status: 404 }
      );
    }

    const teachers = await Teacher.find({ school: principal.school });

    let principalTeachersGroup = await Conversation.findOne({
      type: "group",
      "groupInfo.school": principal.school,
      participants: {
        $elemMatch: { _id: principalId, model: "Principal" },
      },
    });

    if (!principalTeachersGroup) {
      const participants = [
        ...teachers.map((t: any) => ({
          _id: t._id,
          model: "Teacher",
        })),
        {
          _id: principal._id,
          model: "Principal",
        },
      ];

      await Conversation.create({
        type: "group",
        participants,
        groupInfo: {
          name: "Principal–Teachers Group",
          school: principal.school,
        },
      });
    }

    let allPrincipalsGroup = await Conversation.findOne({
      type: "group",
      "groupInfo.name": "All Principals Group",
    });

    if (!allPrincipalsGroup) {
      const allPrincipals = await Principal.find({});

      const participants = allPrincipals.map((p: any) => ({
        _id: p._id,
        model: "Principal",
      }));

      await Conversation.create({
        type: "group",
        participants,
        groupInfo: {
          name: "All Principals Group",
        },
      });
    }

    const conversations = await Conversation.find({
      "participants._id": principalId,
    })
      .populate("participants._id")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.log("Error fetching principal conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
