const express = require("express");
const aiController = require("../controllers/aiController");
const aiRouter = express.Router();
const bucketName = "ai-grader-storage";

aiRouter.post("/", async (req, res) => {
  try {
    const feedback = await aiController.processSubmission(bucketName);
    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error processing submission:", error);
    res.status(500).json({ error: "An error occurred while processing the submission" });
  }
});

module.exports = aiRouter;
