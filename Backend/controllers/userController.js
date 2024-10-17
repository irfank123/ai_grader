const User = require("../models/userModel");
const mongoose = require("mongoose");

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}); //find all documents in the collection
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Failed to fetch user: " + error.message);
  }
};

// get one user
const getOneUser = async (req, res) => {
  try {
    const { user_id } = req.params; // get the exam id from the parameters
    const user = await User.findById(user_id); //find the specific document based on exam id
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).send("Failed to fetch user: " + error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, exam_scores } = req.body; // extract fields from request body
    const newUser = new User({
      name,
      email,
      exam_scores: new Map(Object.entries(exam_scores || {})), // convert an object to a map
    });

    await newUser.save();
    res.status(201).json(newUser); // respond with the created user document
  } catch (error) {
    res.status(500).send("Failed to create user: " + error.message); // error handling
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req.params; // get user_id from URL parameters
  const { name, email, exam_scores } = req.body; // extract potential updates from request body

  try {
    const update = {};
    if (name) update.name = name; // check and add name to update object
    if (email) update.email = email; // check and add email to update object
    if (exam_scores) {
      update.exam_scores = {}; // prepare to handle map updates
      for (const [key, value] of Object.entries(exam_scores)) {
        update[`exam_scores.${key}`] = value; // update individual scores
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { $set: update },
      { new: true, runValidators: true } // return updated document and do schema checks
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to update user: " + error.message);
  }
};

// delete a user
const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findByIdAndDelete(user_id); // find the question by id and delete it
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User successfully deleted");
  } catch (error) {
    res.status(500).send("Faield to delete user: " + error.message);
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
};
