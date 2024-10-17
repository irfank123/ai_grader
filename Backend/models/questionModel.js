const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Question", questionSchema, "Questions"); // export the model
