import FAQ from "@/models/FAQ";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const oid = searchParams.get("oid");
    if (!oid) {
      return NextResponse.json(
        { message: "Question ID is required" },
        { status: 400 }
      );
    }
    await FAQ.findByIdAndDelete(oid);
    return NextResponse.json(
      { message: "Question deleted successfully" },
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
