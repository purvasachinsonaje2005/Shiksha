import School from "@/models/School";
import Teacher from "@/models/Teacher";
import fs from "fs";
import ejs from "ejs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/config/db.config";
import mailSender from "@/config/mailSender.config";
import Student from "@/models/Student";
import Class from "@/models/Class";

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
    const get = (key: string) => formData.get(key) as string;
    const studentId = get("studentId");
    const name = get("name");
    const email = get("email");
    const phone = get("phone");
    const password = get("password");
    const dateOfBirth = get("dateOfBirth");

    const age = parseInt(get("age"), 10);

    // Father
    const fatherName = get("fatherName");
    const fatherEmail = get("fatherEmail");
    const fatherOccupation = get("fatherOccupation");
    const fatherEducationLevel = parseInt(get("fatherEducationLevel"), 10);

    // Mother
    const motherName = get("motherName");
    const motherEmail = get("motherEmail");
    const motherOccupation = get("motherOccupation");
    const motherEducationLevel = parseInt(get("motherEducationLevel"), 10);

    // Academic / ML Inputs
    const finalGrade = parseFloat(get("finalGrade"));
    const grade2 = parseFloat(get("grade2"));
    const grade1 = parseFloat(get("grade1"));
    const numberOfFailures = parseInt(get("numberOfFailures"), 10);

    const wantsHigherEducation = get("wantsHigherEducation");
    const familyRelationship = parseInt(get("familyRelationship"), 10);
    const freeTime = parseInt(get("freeTime"), 10);
    const goingOut = parseInt(get("goingOut"), 10);

    const weekdayAlcoholConsumption = parseInt(
      get("weekdayAlcoholConsumption"),
      10
    );
    const weekendAlcoholConsumption = parseInt(
      get("weekendAlcoholConsumption"),
      10
    );

    const healthStatus = parseInt(get("healthStatus"), 10);
    const studyTime = parseInt(get("studyTime"), 10);
    const travelTime = parseInt(get("travelTime"), 10);

    const gender = get("gender");
    const address = get("address");
    const internetAccess = get("internetAccess");
    const extraCurricularActivities = get("extraCurricularActivities");
    const inRelationship = get("inRelationship");
    const familySize = get("familySize");
    const reasonForChoosingSchool = get("reasonForChoosingSchool");

    const guardian = get("guardian");
    const parentalStatus = get("parentalStatus");
    const attendedNursery = get("attendedNursery");
    const familySupport = get("familySupport");
    const extraPaidClasses = get("extraPaidClasses");

    const classId = get("class");

    const image = formData.get("image") as File;

    // ---------------- PASSWORD ENCRYPTION ----------------
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      studentId,
      name,
      email,
      phone,
      password: encryptedPassword,
      dateOfBirth,
      age,

      father: {
        name: fatherName,
        email: fatherEmail,
        occupation: fatherOccupation,
        educationLevel: fatherEducationLevel,
      },

      mother: {
        name: motherName,
        email: motherEmail,
        occupation: motherOccupation,
        educationLevel: motherEducationLevel,
      },

      finalGrade,
      grade1,
      grade2,
      numberOfFailures,

      guardian,
      parentalStatus,
      attendedNursery,
      familySupport,
      extraPaidClasses,

      wantsHigherEducation,
      familyRelationship,
      freeTime,
      goingOut,

      weekdayAlcoholConsumption,
      weekendAlcoholConsumption,

      healthStatus,
      studyTime,
      travelTime,

      reasonForChoosingSchool,
      gender,
      internetAccess,
      extraCurricularActivities,
      inRelationship,
      familySize,
      address,

      class: classId,
      school: school._id,

      profileImage: {
        data: Buffer.from(await image.arrayBuffer()),
        contentType: image.type,
      },
    });
    const savedStudent = await newStudent.save();
    school.students.push(savedStudent._id);
    const existingClass = await Class.findById(classId);
    if (existingClass) {
      existingClass.students.push(savedStudent._id);
      await existingClass.save();
    }
    await school.save();
    await sendMailToStudent(school.name, name, email);
    return NextResponse.json(
      { message: "Student added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const sendMailToStudent = async (
  schoolName: string,
  studentName: string,
  email: string
) => {
  const template = fs.readFileSync(
    "./src/emailTemplates/studentWelcomeTemplate.ejs",
    "utf-8"
  );
  const mailSubject = "Welcome to " + schoolName;
  const html = ejs.render(template, {
    schoolName,
    studentName,
    email,
  });
  await mailSender(email, mailSubject, html);
};
