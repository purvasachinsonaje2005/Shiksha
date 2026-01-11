import Class from "@/models/Class";
import Principal from "@/models/Principal";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import mongoose from "mongoose";

// Database Connection

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to the Database");
    });
    Principal;
    Student;
    Teacher;
    Class;
    connection.on("error", (error) => {
      console.log("Error: ", error);
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

export default dbConfig;
