import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["single", "group"],
      required: true,
    },
    participants: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "participants.model",
          required: true,
        },
        model: {
          type: String,
          required: true,
          enum: ["Student", "Teacher", "Principal", "Parent"],
        },
      },
    ],

    groupInfo: {
      name: {
        type: String,
        required: function () {
          return this.type === "group";
        },
      },
      class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
      },
    },
    messages: [
      {
        sender: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "messages.sender.model",
            required: true,
          },
          model: {
            type: String,
            required: true,
            enum: ["Student", "Teacher", "Principal", "Parent"],
          },
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

ConversationSchema.index({ "participants._id": 1 });
ConversationSchema.index({ "messages.sender._id": 1 });

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);

export default Conversation;
