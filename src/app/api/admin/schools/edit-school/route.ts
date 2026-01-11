import School from "@/models/School";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { school } = await req.json();
    if (!school || !school._id) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }
    await School.findByIdAndUpdate(school._id, school);
    return NextResponse.json(
      { message: "School edited successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error editing school:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
