import School from "@/models/School";
import Teacher from "@/models/Teacher";
import fs from "fs";
import ejs from "ejs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/config/db.config";
import mailSender from "@/config/mailSender.config";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const school = await School.findOne({ principal: decodedId.id });
    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const qualifications = formData.get("qualifications") as string;
    const image = formData.get("image") as File;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({
      name,
      email,
      phone,
      password: encryptedPassword,
      qualifications,
      profileImage: {
        data: Buffer.from(await image.arrayBuffer()),
        contentType: image.type,
      },
      school: school._id,
    });
    const savedTeacher = await newTeacher.save();
    school.teachers.push(savedTeacher._id);
    await school.save();
    await sendMailToTeacher(school.name, name, email);
    return NextResponse.json(
      { message: "Teacher added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding teacher:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const sendMailToTeacher = async (
  schoolName: string,
  teacherName: string,
  email: string
) => {
  const template = fs.readFileSync(
    "./src/emailTemplates/teacherWelcomeTemplate.ejs",
    "utf-8"
  );
  const mailSubject = "Welcome to " + schoolName;
  const html = ejs.render(template, {
    schoolName,
    teacherName,
    email,
  });
  await mailSender(email, mailSubject, html);
};
