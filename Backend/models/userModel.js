const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    exam_scores: {
      type: Map,
      of: Number, // the type of the values in the map
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "Users"); // export the model
