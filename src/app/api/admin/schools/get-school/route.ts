import School from "@/models/School";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) {
      return NextResponse.json(
        { error: "Missing schoolId parameter" },
        { status: 400 }
      );
    }
    const school = await School.findById(schoolId).populate("principal").lean();
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    return NextResponse.json({ school });
  } catch (error) {
    console.error("Error fetching school:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
