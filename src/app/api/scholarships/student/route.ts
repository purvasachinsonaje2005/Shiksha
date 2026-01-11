import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import ScholarshipApplication from "@/models/ScholarshipApplication";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const studentId = decoded.id;
    const scholarshipApplications = await ScholarshipApplication.find({
      student: studentId,
    });
    return NextResponse.json(scholarshipApplications);
  } catch (error) {
    console.error("Error fetching scholarship applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
