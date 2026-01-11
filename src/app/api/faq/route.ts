import FAQ from "@/models/FAQ";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const faqs = await FAQ.find().populate("answers.responder");
    return NextResponse.json({ faqs }, { status: 200 });
  } catch (error) {
    console.error("FAQ GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
