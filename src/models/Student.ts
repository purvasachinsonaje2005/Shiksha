import mongoose, { Schema } from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    // Basic Identification
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },

    // Parent Information
    father: {
      name: { type: String, required: true },
      occupation: { type: String, required: true },
      email: { type: String, required: false },
      educationLevel: { type: Number, min: 0, max: 4 }, // Matches dataset
    },

    mother: {
      name: { type: String, required: true },
      occupation: { type: String, required: true },
      email: { type: String, required: false },
      educationLevel: { type: Number, min: 0, max: 4 }, // Matches dataset
    },

    // Core Academic + Behavior Features (Your ML Model Inputs)
    finalGrade: { type: Number, required: true },
    grade2: { type: Number, required: true },
    grade1: { type: Number, required: true },

    numberOfFailures: { type: Number, default: 0 },

    wantsHigherEducation: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    familyRelationship: { type: Number, min: 1, max: 5 },
    freeTime: { type: Number, min: 1, max: 5 },
    goingOut: { type: Number, min: 1, max: 5 },
    age: { type: Number, required: true },

    weekdayAlcoholConsumption: { type: Number, min: 1, max: 5 },
    weekendAlcoholConsumption: { type: Number, min: 1, max: 5 },
    motherEducation: { type: Number, min: 0, max: 4 },
    fatherEducation: { type: Number, min: 0, max: 4 },

    healthStatus: { type: Number, min: 1, max: 5 },
    studyTime: { type: Number, min: 1, max: 4 },
    travelTime: { type: Number, min: 1, max: 4 }, // dataset uses 1–4 hours range

    address: {
      type: String,
      enum: ["U", "R"], // Urban, Rural
      required: true,
    },

    reasonForChoosingSchool: {
      type: String,
      enum: ["course", "home", "reputation", "other"],
      required: true,
    },

    gender: {
      type: String,
      enum: ["M", "F"],
      required: true,
    },

    guardian: {
      type: String,
      enum: ["mother", "father", "other"],
      required: true,
    },

    parentalStatus: {
      type: String,
      enum: ["T", "A"],
      required: true,
    },

    attendedNursery: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    extraPaidClasses: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    familySupport: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    internetAccess: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    extraCurricularActivities: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    inRelationship: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    familySize: {
      type: String,
      enum: ["GT3", "LE3"],
      required: true,
    },

    // ML Prediction Field
    dropoutPrediction: {
      willDropout: { type: String, enum: ["yes", "no"] },
      confidence: { type: Number, min: 0, max: 1 },
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default Student;
