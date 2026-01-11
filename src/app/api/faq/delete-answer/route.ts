import FAQ from "@/models/FAQ";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const oid = searchParams.get("oid");
    const answerIndex = searchParams.get("answerIndex");
    if (!oid || answerIndex === null) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      );
    }
    const existingFAQ = await FAQ.findById(oid);
    if (!existingFAQ) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }
    existingFAQ.answers.splice(parseInt(answerIndex), 1);
    await existingFAQ.save();
    return NextResponse.json(
      { message: "Answer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { message: "Error deleting question" },
      { status: 500 }
    );
  }
}
