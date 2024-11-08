const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      name,
      email,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    try {
      await user.save();
      console.log("User saved successfully:", user);
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return res
        .status(500)
        .json({ message: "Error saving user to database", error: saveError.message });
    }

    // Log the user in
    req.login(user, (loginError) => {
      if (loginError) {
        console.error("Error logging in after registration:", loginError);
        return res
          .status(500)
          .json({ message: "Error logging in after registration", error: loginError.message });
      }
      res.status(201).json({
        message: "User registered successfully",
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If credentials are correct, log the user in
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "Logged in successfully",
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  } catch (error) {
    res.status(500).send("Login error: " + error.message);
  }
};

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
  registerUser,
  loginUser,
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
};
