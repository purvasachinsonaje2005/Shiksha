import ScholarshipApplication from "@/models/ScholarshipApplication";
import School from "@/models/School";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
    const school = await School.findOne({ principal: decoded.id });
    const scholarships = await ScholarshipApplication.find({
      school: school?._id,
    })
      .populate("student", "name email")
      .populate("class")
      .sort({ createdAt: -1 });
    return NextResponse.json({ scholarships }, { status: 200 });
  } catch (error) {
    console.error("Error processing scholarship application:", error);
    return NextResponse.json(
      { message: "Failed to process scholarship application" },
      { status: 500 }
    );
  }
}
