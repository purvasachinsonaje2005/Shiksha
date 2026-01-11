import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resources = await Resource.find();
    return NextResponse.json(
      { message: "Resources fetched successfully", resources },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching resources:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
