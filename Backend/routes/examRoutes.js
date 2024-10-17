const express = require("express");
const examController = require("../controllers/examController");
const examRouter = express.Router();

examRouter.get("/", examController.getAllExams);

examRouter.post("/", examController.createExam);

examRouter.get("/:exam_id", examController.getOneExam);

examRouter.patch("/:exam_id", examController.updateExam);

examRouter.delete("/:exam_id", examController.deleteExam);

module.exports = examRouter;
