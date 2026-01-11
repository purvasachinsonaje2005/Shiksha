import ScholarshipApplication from "@/models/ScholarshipApplication";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const applicationId = searchParams.get("applicationId");
    if (!applicationId) {
      return NextResponse.json(
        { message: "Application ID is required" },
        { status: 400 }
      );
    }
    const application = await ScholarshipApplication.findById(applicationId)
      .populate("student", "name email")
      .populate("class")
      .populate("school", "name address")
      .populate("principalReview.reviewedBy", "name email");
    return NextResponse.json({ application });
  } catch (error) {
    console.log("Error processing scholarship application:", error);
    return NextResponse.json(
      { message: "Failed to process scholarship application" },
      { status: 500 }
    );
  }
}
