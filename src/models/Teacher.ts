import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    profileImage: {
      contentType: { type: String, required: true },
      data: { type: Buffer, required: true },
    },
    qualifications: { type: String },
    password: { type: String, required: true },

    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
  },
  { timestamps: true }
);

const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
export default Teacher;
