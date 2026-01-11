import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    examType: {
      type: String,
      enum: ["FA1", "FA2", "MidTerm", "Final", "Custom"],
      required: true,
    },

    subjectResults: [
      {
        subjectName: { type: String, required: true },
        marks: { type: Number, required: true, min: 0 },
        maxMarks: { type: Number, default: 100 },
      },
    ],

    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
