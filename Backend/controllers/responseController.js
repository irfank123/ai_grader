const Response = require("../models/responseModel");
const mongoose = require("mongoose");

// get all responses
const getAllResponses = async (req, res) => {
  try {
    const responses = await Response.find({}); //find all documents in the collection
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).send("Failed to fetch responses: " + error.message);
  }
};

// get one response
const getOneResponse = async (req, res) => {
  try {
    const { response_id } = req.params; // get the response id from the parameters
    const response = await Response.findById(response_id); //find the specific document based on response id
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send("Failed to fetch response: " + error.message);
  }
};

// create a response
const createResponse = async (req, res) => {
  try {
    const { user_id, question_id, submitted_answer, speech_to_text, score } = req.body; // get the new response fields fro the request body

    // check if the referenced User and Question exist
    const userExists = await User.findById(user_id);
    const questionExists = await Question.findById(question_id);

    if (!userExists || !questionExists) {
      return res.status(404).send("User or Question not found");
    }

    const newResponse = new Response({
      user_id,
      question_id,
      submitted_answer,
      speech_to_text,
      score,
    }); // create the new response object with these fields
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(500).send("Failed to create response: " + error.message);
  }
};

const updateResponse = async (req, res) => {
  const { response_id } = req.params;
  const { submitted_answer, speech_to_text, score } = req.body; // get new values of only fields that can be changed

  try {
    const updatedResponse = await Response.findByIdAndUpdate(
      response_id,
      { $set: { submitted_answer, speech_to_text, score } },
      { new: true, runValidators: true }
    ); //set the new values and run schema checks

    if (!updatedResponse) {
      return res.status(404).send("Response not found");
    }

    res.status(200).json(updatedResponse);
  } catch (error) {
    res.status(500).send("Failed to update response: " + error.message);
  }
};

// delete a response
const deleteResponse = async (req, res) => {
  try {
    const { response_id } = req.params;
    const response = await Response.findByIdAndDelete(response_id); // find the question by id and delete it
    if (!response) {
      return res.status(404).send("Response not found");
    }
    res.status(200).send("Response successfully deleted");
  } catch (error) {
    res.status(500).send("Faield to delete response: " + error.message);
  }
};

module.exports = {
  getAllResponses,
  getOneResponse,
  createResponse,
  updateResponse,
  deleteResponse,
};