import Notice from "@/models/Notice";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const noticeData = await req.formData();
    const title = noticeData.get("title") as string;
    const content = noticeData.get("content") as string;
    const principal = noticeData.get("principal") as string;
    const school = noticeData.get("school") as string;
    const date = new Date(noticeData.get("date") as string);
    const tags = noticeData.get("tags") as string;
    const imageFile = noticeData.get("tempImage") as File | null;
    console.log("Received notice data:", {
      title,
      content,
      principal,
      school,
      date,
      tags: tags.split(","),
      imageFile,
    });
    const notice = new Notice({
      title,
      content,
      principal,
      school,
      date,
      tags: tags ? tags.split(",") : [],
      image: imageFile
        ? {
            data: Buffer.from(await imageFile.arrayBuffer()),
            contentType: imageFile.type,
          }
        : undefined,
    });
    await notice.save();
    return NextResponse.json(
      { message: "Notice added successfully", notice },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in adding notice", error);
    return NextResponse.json(
      { message: "Error in adding notice", error },
      { status: 500 }
    );
  }
}
