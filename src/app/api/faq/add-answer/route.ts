import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import FAQ from "@/models/FAQ";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const oid = searchParams.get("oid");
    const { response } = await req.json();

    if (!oid || !response) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const token = req.cookies.get("token")?.value;
    const decodedId = jwt.verify(token!, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
    const existingResponse = await FAQ.findById(oid);
    if (!existingResponse) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }
    existingResponse.answers.push({
      responder: decodedId.id,
      role: decodedId.role.charAt(0).toUpperCase() + decodedId.role.slice(1),
      response,
      time: new Date(),
    });
    await existingResponse.save();
    return NextResponse.json(
      { message: "Answer added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error adding answer:", error);
    return NextResponse.json(
      { message: "Error adding answer" },
      { status: 500 }
    );
  }
}
