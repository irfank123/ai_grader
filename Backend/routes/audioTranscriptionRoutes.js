const express = require("express");
const audioController = require("../controllers/audioTranscriptionController");
const audioRouter = express.Router();

audioRouter.post("/", audioController.handleAudioUpload);

module.exports = audioRouter;
