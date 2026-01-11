import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  authors: [
    {
      name: { type: String, required: true },
      bio: String,
      birthDate: Date,
      nationality: String,
    },
  ],
  description: {
    type: String,
  },
  publishedYear: {
    type: Number,
  },
  categories: [{ type: String }],
  isbn: {
    type: String,
    unique: true,
    sparse: true,
  },
  fileUrl: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Resource =
  mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);

export default Resource;
