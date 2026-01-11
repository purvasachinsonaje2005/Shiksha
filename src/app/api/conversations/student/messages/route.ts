import Conversation from "@/models/Convertation";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const searchParams = req.nextUrl.searchParams;
    const conversationId = searchParams.get("conversationId");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const studentId = decoded.id;
    const { content } = await req.json();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }
    conversation.messages.push({
      sender: { _id: studentId, model: "Student" },
      content,
    });
    await conversation.save();
    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error in POST /conversations/student/messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
