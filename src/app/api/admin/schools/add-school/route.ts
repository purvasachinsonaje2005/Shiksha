import fs from "fs";
import ejs from "ejs";
import dbConfig from "@/config/db.config";
import Principal from "@/models/Principal";
import School from "@/models/School";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import mailSender from "@/config/mailSender.config";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const schoolData = await req.formData();
    const principalData = new Principal({
      name: schoolData.get("principalName"),
      email: schoolData.get("principalEmail"),
      password: bcrypt.hashSync(
        schoolData.get("principalPassword") as string,
        10
      ),
    });
    const savedPrincipal = await principalData.save();
    const school = new School({
      name: schoolData.get("name"),
      email: schoolData.get("email"),
      contactNumber: schoolData.get("contactNumber"),
      registrationId: schoolData.get("registrationId"),
      logo: {
        data: Buffer.from(
          await (schoolData.get("image") as File).arrayBuffer()
        ),
        contentType: (schoolData.get("image") as File).type,
      },
      address: schoolData.get("address"),
      village: schoolData.get("village"),
      taluka: schoolData.get("taluka"),
      district: schoolData.get("district"),
      state: schoolData.get("state"),
      country: schoolData.get("country"),
      pincode: schoolData.get("pincode"),
      board: schoolData.get("board"),
      principal: savedPrincipal._id,
    });
    await school.save();
    await sendMailToPrincipal(
      schoolData.get("principalEmail") as string,
      schoolData.get("principalName") as string,
      school.name,
      school.address
    );
    return NextResponse.json(
      { message: "School Added Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in adding school:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const sendMailToPrincipal = async (
  principalEmail: string,
  principalName: string,
  schoolName: string,
  schoolLocation: string
) => {
  const template = fs.readFileSync(
    "./src/emailTemplates/welcomeTemplate.ejs",
    "utf-8"
  );
  const mailSubject = "Your Principal Account has been Created";
  const html = ejs.render(template, {
    principalName: principalName,
    schoolName: schoolName,
    schoolLocation: schoolLocation,
  });
  await mailSender(principalEmail, mailSubject, html);
};
