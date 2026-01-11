import Student from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 }
      );
    }
    const { user } = await req.json();
    await Student.findByIdAndUpdate(id, user, { new: true });
    return NextResponse.json(
      { message: "Student updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
