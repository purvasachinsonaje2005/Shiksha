import mongoose, { Schema } from "mongoose";

const FAQmodel = new Schema({
  question: { type: String, required: true },
  answers: [
    {
      responder: {
        type: Schema.Types.ObjectId,
        refPath: "answers.role",
        required: true,
      },
      role: {
        type: String,
        enum: ["Student", "Teacher", "Principal", "Parent"],
        required: true,
      },
      response: { type: String, required: true },
      time: { type: Date, default: Date.now },
    },
  ],
});

const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQmodel);
export default FAQ;
