const mongoose = require("mongoose");
const Question = require("./questionModel").schema; // import the question schema from its file

const Schema = mongoose.Schema;

const examSchema = new Schema(
  {
    subject_name: {
      type: String,
      required: true,
    },
    questions: [Question], // use the imported question schema
  },
  { timestamps: false }
);

module.exports = mongoose.model("Exam", examSchema, "Exams"); // export the model
