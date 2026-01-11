import ScholarshipApplication from "@/models/ScholarshipApplication";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const { applicationId, action, remarks } = await req.json();
    if (!applicationId || !action || !remarks) {
      return NextResponse.json(
        { message: "Application ID, action, and remarks are required" },
        { status: 400 }
      );
    }

    const application = await ScholarshipApplication.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { message: "Scholarship application not found" },
        { status: 404 }
      );
    }

    application.status = action;
    application.principalReview = {
      remarks,
      reviewedBy: decodedId.id,
      date: new Date(),
    };
    await application.save();
    return NextResponse.json(
      { message: "Scholarship application updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error processing scholarship review:", error);
    return NextResponse.json(
      { message: "Failed to process scholarship review" },
      { status: 500 }
    );
  }
}
