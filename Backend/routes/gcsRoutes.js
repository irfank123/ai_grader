const express = require("express");
const gcsController = require("../controllers/gcsController");
const gcsRouter = express.Router();

// Route for image uploads
gcsRouter.post("/image", gcsController.upload.single("file"), (req, res) => {
  //   uploadToGCS(req.file, res);
  gcsController.uploadToGCS(req.file, res);
});

// Route for audio uploads
gcsRouter.post("/audio", gcsController.upload.single("file"), (req, res) => {
  //   uploadToGCS(req.file, res);
  gcsController.uploadToGCS(req.file, res);
});

module.exports = gcsRouter;
