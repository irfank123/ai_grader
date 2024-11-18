require("dotenv").config({ override: true });
const mongoose = require("mongoose");



const express = require("express");
const cors = require("cors");


const app = require("./app");

const uploadRoutes = require("./controllers/upload"); // Import the upload route



// Enable CORS for cross-origin requests
app.use(cors());

// Add JSON body parser (if not already in app.js)
app.use(express.json());

// Mount the upload route
app.use("/api/v1", uploadRoutes);


// connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to database...", mongoose.connection.name);
      console.log(`Listening on port ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
