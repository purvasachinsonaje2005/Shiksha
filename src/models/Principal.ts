import mongoose from "mongoose";

const PrincipalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Principal =
  mongoose.models.Principal || mongoose.model("Principal", PrincipalSchema);
export default Principal;
