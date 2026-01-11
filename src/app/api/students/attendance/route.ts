import Attendance from "@/models/Attendance";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const attendances = await Attendance.find({
      "records.student": decodedId.id,
    })
      .populate("class")
      .populate("teacher")
      .populate("records.student");
    return NextResponse.json({ attendance: attendances });
  } catch (error) {
    console.log("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
