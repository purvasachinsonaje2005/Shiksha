import Faculty from "@/models/Faculty";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { formData } = await req.json();
  try {
    if (formData.password && formData.password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    if (formData.password !== "") {
      const encryptedPassword = await bcrypt.hash(formData.password, 10);
      formData.password = encryptedPassword;
    }
    const faculty = await Faculty.findOneAndUpdate(
      { email: formData.email },
      {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        ...(formData.password ? { password: formData.password } : {}),
        profileImage: formData.profileImage,
        ...formData,
      },
      { new: true }
    );
    if (!faculty) {
      return NextResponse.json(
        { message: "Faculty not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Faculty updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating Faculty:", error);
    return NextResponse.json(
      { message: "Failed to update HOD" },
      { status: 500 }
    );
  }
}
