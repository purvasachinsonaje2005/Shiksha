import mongoose from "mongoose";

const ScholarshipApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    reasonForScholarship: {
      type: String,
      required: true,
    },
    annualFamilyIncome: {
      type: Number,
      required: true,
    },
    supportingDocuments: [
      {
        url: String,
        fileType: String,
      },
    ],
    status: {
      type: String,
      enum: [
        "Submitted",
        "Principal Review",
        "Principal Approved",
        "Principal Rejected",
        "Admin Review",
        "Admin Approved",
        "Admin Rejected",
        "Granted",
      ],
      default: "Submitted",
    },
    principalReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Principal",
      },
      remarks: String,
      date: Date,
    },
    adminReview: {
      remarks: String,
      date: Date,
    },
    granted: {
      isGranted: { type: Boolean, default: false },
      grantDate: Date,
      amountGranted: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ScholarshipApplication ||
  mongoose.model("ScholarshipApplication", ScholarshipApplicationSchema);
