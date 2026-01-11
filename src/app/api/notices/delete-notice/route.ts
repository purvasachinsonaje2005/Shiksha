import Notice from "@/models/Notice";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Notice ID is required" },
        { status: 400 }
      );
    }
    await Notice.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Notice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in deleting notice", error);
    return NextResponse.json(
      { message: "Error in deleting notice", error },
      { status: 500 }
    );
  }
}
