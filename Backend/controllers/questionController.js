const Question = require("../models/questionModel");
const mongoose = require("mongoose");

// get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}); //find all documents in the collection
    console.log(questions);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send("Failed to fetch questions: " + error.message);
  }
};

// get one question
const getOneQuestion = async (req, res) => {
  try {
    const { question_id } = req.params; // get the question id from the parameters
    const question = await Question.findById(question_id); //find the specific document based on question id
    res.status(200).json(question);
  } catch (error) {
    res.status(500).send("Failed to fetch question: " + error.message);
  }
};

// create a question
const createQuestion = async (req, res) => {
  try {
    const { question, answer, module } = req.body; // get the new question fields fro the request body
    const newQuestion = new Question({ question, answer, module }); // create the new question object with these fields
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).send("Failed to create question: " + error.message);
  }
};

// update a question
const updateQuestion = async (req, res) => {
  const { question_id } = req.params;
  const updates = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(question_id, updates, {
      new: true,
      runValidators: true,
    }); // find the question by id and return new updateed version as well as run schema check
    if (!updatedQuestion) {
      return res.status(404).send("Question not found");
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).send("Failed to update question: " + error.message);
  }
};

// delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;
    const question = await Question.findByIdAndDelete(question_id); // find the question by id and delete it
    if (!question) {
      return res.status(404).send("Question not found");
    }
    res.status(200).send("Question successfully deleted");
  } catch (error) {
    res.status(500).send("Failed to delete question: " + error.message);
  }
};

module.exports = {
  getAllQuestions,
  getOneQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
