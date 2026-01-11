import ScholarshipApplication from "@/models/ScholarshipApplication";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { applicationId, action, remarks, amountGranted } = await req.json();
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
    if (action === "Granted") {
      application.granted = {
        isGranted: true,
        grantDate: new Date(),
        amountGranted,
      };
    }
    application.status = action;
    application.adminReview = {
      remarks,
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
