const express = require("express");
const examController = require("../controllers/examController");
const examRouter = express.Router();

examRouter.get("/", examController.getAllExams);

examRouter.get("/:exam_id", examController.getOneExam);

examRouter.post("/", examController.createExam);

examRouter.patch("/:exam_id", examController.updateExam);

examRouter.delete("/:exam_id", examController.deleteExam);

module.exports = examRouter;
