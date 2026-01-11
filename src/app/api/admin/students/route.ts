import Student from "@/models/Student";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await Student.find().populate("class").populate("school");
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.log("Error fetching students:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
