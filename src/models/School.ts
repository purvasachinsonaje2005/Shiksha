import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    board: {
      type: String,
      default:
        "Maharashtra State Board for Secondary and Higher Secondary Education",
    },
    logo: {
      contentType: { type: String },
      data: { type: Buffer },
    },
    address: { type: String },
    village: { type: String },
    taluka: { type: String },
    district: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
    pincode: { type: String },
    principal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Principal",
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    scholarships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scholarship",
      },
    ],
  },
  { timestamps: true }
);

const School = mongoose.models.School || mongoose.model("School", SchoolSchema);
export default School;
