import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import School from "@/models/School";
import Student from "@/models/Student";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const school = await School.findOne({ principal: decodedId.id });
    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }
    const students = await Student.find({ school: school._id });
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/principal/students:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
