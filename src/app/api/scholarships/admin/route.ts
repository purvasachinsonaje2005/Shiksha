import ScholarshipApplication from "@/models/ScholarshipApplication";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const scholarships = await ScholarshipApplication.find()
      .populate("student")
      .populate("school")
      .populate("class");
    return NextResponse.json({ scholarships }, { status: 200 });
  } catch (error) {
    console.error("Error fetching scholarship applications:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
