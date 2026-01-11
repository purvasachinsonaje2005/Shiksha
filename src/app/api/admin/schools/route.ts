import School from "@/models/School";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const schools = await School.find().populate("principal");
    return NextResponse.json({ schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Error fetching schools" },
      { status: 500 }
    );
  }
}
