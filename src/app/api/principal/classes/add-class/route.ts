import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import School from "@/models/School";
import Class from "@/models/Class";

export async function POST(req: NextRequest) {
  try {
    const { classData } = await req.json();
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
    const newClass = new Class({
      name: classData.name,
      subjects: classData.subjects,
      school: school._id,
    });
    await newClass.save();
    return NextResponse.json(
      { message: "Class added successfully", class: newClass },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding class:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
