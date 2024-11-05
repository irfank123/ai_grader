const multer = require("multer");
const path = require("path");
const { PythonShell } = require("python-shell");
const fs = require("fs");

// Define upload directory
const uploadDirectory = path.join(__dirname, "../uploads");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage }).single("audio");

// Transcribe audio function
const transcribeAudio = (filePath) => {
  return new Promise((resolve, reject) => {
    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: path.join(__dirname, "../../transcribe-anything"),
      args: [filePath],
    };

    PythonShell.run("transcribe.py", options, (err, results) => {
      if (err) return reject(err);

      const folderName = `text_${path.basename(filePath, path.extname(filePath))}`;
      const outputFolder = path.join(__dirname, "../../transcribe-anything", folderName);
      const outputFilePath = path.join(outputFolder, "out.txt");

      try {
        const transcription = fs.readFileSync(outputFilePath, "utf8");
        resolve(transcription);
      } catch (readError) {
        reject(`Failed to read transcription: ${readError.message}`);
      } finally {
        fs.unlinkSync(filePath);
        fs.rmSync(outputFolder, { recursive: true, force: true });
      }
    });
  });
};

const sendToGrading = async (gradingData) => {
  try {
    // Example: Sending data to a remote grading API (placehodler for now)
    const response = await fetch("https://api.example.com/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gradingData),
    });
    if (!response.ok) throw new Error("Failed to send data for grading");
    const result = await response.json();
    console.log("Grading complete:", result);
    return result;
  } catch (error) {
    console.error("Error sending data for grading:", error);
    throw error; // Optionally rethrow to handle upstream
  }
};

const handleAudioUpload = (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ error: `Multer uploading error: ${error.message}` });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!req.body.textAnswer) {
      return res.status(400).json({ error: "Text answer is missing" });
    }

    const filePath = path.join(uploadDirectory, req.file.filename);

    try {
      const transcription = await transcribeAudio(filePath);
      const gradingData = {
        transcription,
        textAnswer: req.body.textAnswer,
      };
      // Placeholder to send data for AI grading
      sendToGrading(gradingData);
      res.json({ success: true, ...gradingData });
    } catch (transcriptionError) {
      res.status(500).json({ error: `Transcription failed: ${transcriptionError.message}` });
    }
  });
};

module.exports = {
  handleAudioUpload,
};
