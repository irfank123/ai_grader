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
    gpt_written_feedback: {
      type: String,
      required: true,
    },
    gpt_spoken_feedback: {
      type: String,
      required: true,
    },
    user_speech_to_text: {
      type: String,
    },
    grade: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema, "Responses"); // export the model
