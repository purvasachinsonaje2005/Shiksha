import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import School from "@/models/School";
import Student from "@/models/Student";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decodedId = jwt.verify(token!, process.env.JWT_SECRET!) as {
      id: string;
    };
    const school = await School.findOne({ principal: decodedId.id });
    const students = await Student.find({ school: school?._id })
      .populate("school")
      .populate("class");
    return NextResponse.json({ students: students || [] }, { status: 200 });
  } catch (error) {
    console.log("Error fetching students by school:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
