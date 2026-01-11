import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import School from "@/models/School";
import Class from "@/models/Class";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const school = await School.findOne({ principal: decodedId.id });
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    const classes = await Class.find({ school: school._id }).populate(
      "subjects.teacher",
      "name"
    );
    return NextResponse.json({ classes }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/principal/classes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
