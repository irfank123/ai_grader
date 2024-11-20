require("dotenv").config({ override: true });
const mongoose = require("mongoose");

const express = require("express");

const app = require("./app");

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
