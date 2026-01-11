import dbConfig from "@/config/db.config";
import Resource from "@/models/Resource";
import { NextRequest, NextResponse } from "next/server";

dbConfig();
export async function POST(req: NextRequest) {
  try {
    const { newResource } = await req.json();
    const createdResource = await Resource.create(newResource);
    return NextResponse.json(
      { message: "Resource added successfully", resource: createdResource },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error adding new resource:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
