// require("dotenv").config({ override: true });
// const mongoose = require("mongoose");
// const app = require("./app");


require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const audioTranscriptionController = require("./Backend/controllers/audioTranscriptionController");

const app = express();

// Middleware for file uploads
const upload = multer({ dest: 'Backend/uploads/' });  // Save uploads temporarily in 'Backend/uploads/'


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
// Route for handling media upload and transcription
app.post('/upload_media', upload.single('file'), audioTranscriptionController.uploadAndTranscribe);