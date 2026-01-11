import Attendance from "@/models/Attendance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { records } = await req.json();
    const newAttendance = new Attendance(records);
    await newAttendance.save();
    return NextResponse.json(
      { message: "Attendance records added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
