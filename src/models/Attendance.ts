import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },

  records: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
      },
      timeMarked: { type: Date, default: Date.now },
    },
  ],
});

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
export default Attendance;
