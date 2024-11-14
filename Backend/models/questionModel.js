const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    ai_solution: {
      type: String,
      required: true,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Question", questionSchema, "Questions"); // export the model
