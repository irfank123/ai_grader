const express = require("express");
const questionController = require("../controllers/questionController");
const questionRouter = express.Router();

questionRouter.get("/", questionController.getAllQuestions);

questionRouter.post("/", questionController.createQuestion);

questionRouter.patch("/modifyQuestion/:question_id", questionController.updateQuestion);

questionRouter.get("/:question_id", questionController.getOneQuestion);

questionRouter.delete("/:question_id", questionController.deleteQuestion);

module.exports = questionRouter;
