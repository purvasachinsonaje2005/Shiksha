import Class from "@/models/Class";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { classId, classData } = await req.json();
    if (!classId || !classData) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    await Class.findByIdAndUpdate(classId, classData);
    return NextResponse.json(
      { message: "Class updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json(
      { message: "Could not update class" },
      { status: 500 }
    );
  }
}
