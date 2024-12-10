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



// Research storage routes
gcsRouter.post("/research/image", gcsController.upload.single("file"), (req, res) => {
  gcsController.uploadToResearchStorage(req.file, res);
});

gcsRouter.post("/research/audio", gcsController.upload.single("file"), (req, res) => {
  gcsController.uploadToResearchStorage(req.file, res);
});


// Route for deleting all files
gcsRouter.delete("/delete-all", async (req, res) => {
  try {
    await gcsController.deleteAllFilesfromRoot();
    res.status(200).send("All files deleted successfully (except for the protected directory).");
  } catch (error) {
    console.error("Error deleting files:", error);
    res.status(500).send("Error deleting files.");
  }
});

module.exports = gcsRouter;
