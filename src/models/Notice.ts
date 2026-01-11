import mongoose, { Schema } from "mongoose";

const NoticeSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    principal: {
      type: Schema.Types.ObjectId,
      ref: "Principal",
      required: true,
    },
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    image: {
      contentType: { type: String },
      data: { type: Buffer },
    },
    tags: [{ type: String, required: false }],
  },
  { timestamps: true }
);

const Notice = mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);

export default Notice;
