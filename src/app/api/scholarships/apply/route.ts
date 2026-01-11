import Student from "@/models/Student";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import School from "@/models/School";
import ScholarshipApplication from "@/models/ScholarshipApplication";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const student = await Student.findById(decodedId.id);
    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }
    const formData = await req.formData();
    const reasonForScholarship = formData.get("reasonForScholarship") as string;
    const annualFamilyIncome = formData.get("annualFamilyIncome") as string;
    const supportingDocuments: File[] = [];

    for (const entry of formData.entries()) {
      const [key, value] = entry;
      if (key.startsWith("supportingDocument_") && value instanceof File) {
        supportingDocuments.push(value);
      }
    }
    // Save the files
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "scholarships",
      student.id
    );
    fs.mkdirSync(uploadDir, { recursive: true });
    const savedFilePaths: string[] = [];
    for (const file of supportingDocuments) {
      const filePath = path.join(uploadDir, file.name);
      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
      savedFilePaths.push(`/uploads/scholarships/${student.id}/${file.name}`);
    }
    const newApplication = new ScholarshipApplication({
      student: student.id,
      school: student.school,
      class: student.class,
      annualFamilyIncome: Number(annualFamilyIncome),
      supportingDocuments: savedFilePaths.map((filePath) => ({
        url: filePath,
        fileType: path.extname(filePath),
      })),
      reasonForScholarship,
    });
    await newApplication.save();
    return NextResponse.json(
      { message: "Scholarship application submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error processing scholarship application:", error);
    return NextResponse.json(
      { message: "Failed to process scholarship application" },
      { status: 500 }
    );
  }
}
