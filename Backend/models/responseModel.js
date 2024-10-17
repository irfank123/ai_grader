const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    submitted_answer: {
      type: String,
      required: true,
    },
    speech_to_text: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema, "Responses"); // export the model
