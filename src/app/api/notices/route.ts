import Notice from "@/models/Notice";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .populate("principal")
      .populate("school");
    return NextResponse.json({ notices }, { status: 200 });
  } catch (error) {
    console.log("An Error Occurred While Fetching Notices", error);
    return NextResponse.json(
      { message: "An Error Occurred While Fetching Notices" },
      { status: 500 }
    );
  }
}
