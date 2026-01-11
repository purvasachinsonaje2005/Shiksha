import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConfig from "@/config/db.config";
import Principal from "@/models/Principal";
import Teacher from "@/models/Teacher";
import Student from "@/models/Student";

dbConfig();

const createTokenAndResponse = (data: object, route: string) => {
  const token = jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "7d" });
  const response = NextResponse.json({
    message: "Login successful",
    route,
    token,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
  });
  return response;
};

const validatePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();
    let user = null;
    let route = "";
    let roleAssigned = "";

    switch (role) {
      case "admin":
        if (
          email !== process.env.ADMIN_EMAIL ||
          password !== process.env.ADMIN_PASSWORD
        ) {
          return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
          );
        }
        user = {
          id: "admin_id",
          name: "Shiksha Admin",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
          profileImage:
            "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg",
        };
        route = "/admin/dashboard";
        roleAssigned = "admin";
        break;
      case "principal":
        const exisitingPrincipal = await Principal.findOne({ email });
        user = exisitingPrincipal;
        route = "/principal/dashboard";
        roleAssigned = "principal";
        break;
      case "teacher":
        const teacher = await Teacher.findOne({ email }).select(
          "-profileImage"
        );
        user = teacher;
        route = "/teacher/dashboard";
        roleAssigned = "teacher";
        break;
      case "student":
        const student = await Student.findOne({ email }).select(
          "-profileImage"
        );
        user = student;
        route = "/student/dashboard";
        roleAssigned = "student";
        break;
      case "parent":
        const parent = await Student.findOne({
          $or: [{ "father.email": email }, { "mother.email": email }],
        }).select("-profileImage");
        user = parent;
        route = "/parent/dashboard";
        roleAssigned = "parent";
        break;
      default:
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (role !== "admin") {
      const isPasswordValid = validatePassword(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }
    }

    const data = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: roleAssigned,
      profileImage: user.profileImage,
      registrationNumber: user.registrationNumber || user.facultyId,
    };

    return createTokenAndResponse(data, route);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
