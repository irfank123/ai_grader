const Exam = require("../models/examModel");
const mongoose = require("mongoose");

// get all exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({}); //find all documents in the collection
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).send("Failed to fetch exams: " + error.message);
  }
};

// get one exam
const getOneExam = async (req, res) => {
  try {
    const { exam_id } = req.params; // get the exam id from the parameters
    const exam = await Exam.findById(exam_id); //find the specific document based on exam id
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).send("Failed to fetch exam: " + error.message);
  }
};

// create an exam
const createExam = async (req, res) => {
  try {
    const { subject_name, questions } = req.body; // get the new exam fields fro the request body
    const newExam = new Exam({ subject_name, questions }); // create the new exam object with these fields
    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).send("Failed to create exam: " + error.message);
  }
};

// update an exam
const updateExam = async (req, res) => {
  const { exam_id } = req.params;
  const updates = req.body; //this can include `subject_name`, `questions`, or both

  try {
    const updatedExam = await Exam.findByIdAndUpdate(exam_id, updates, {
      new: true,
      runValidators: true,
    }); // find the exam by id and return new updateed version as well as run schema check
    if (!updatedExam) {
      return res.status(404).send("Exam not found");
    }
    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(500).send("Failed to update exam: " + error.message);
  }
};

// delete an exam
const deleteExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const exam = await Exam.findByIdAndDelete(exam_id); // find the exam by id and delete it
    if (!exam) {
      return res.status(404).send("Exam not found");
    }
    res.status(200).send("Exam successfully deleted");
  } catch (error) {
    res.status(500).send("Failed to delete exam: " + error.message);
  }
};

module.exports = {
  getAllExams,
  getOneExam,
  createExam,
  updateExam,
  deleteExam,
};
