const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Question", questionSchema, "Questions"); // export the model
