// controllers/audioTranscriptionController.js
const path = require("path");
const { PythonShell } = require("python-shell");
const fs = require("fs");

// Define upload directory
// const uploadDirectory = path.join(__dirname, '../uploads');

// Function to transcribe audio and retrieve `out.txt`
const transcribeAudio = (filePath) => {
  return new Promise((resolve, reject) => {
    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: path.join(__dirname, "../../transcribe-anything"),
      args: [filePath],
    };

    PythonShell.run("transcribe.py", options, async (err, results) => {
      if (err) return reject(err);

      // Identify the generated folder, e.g., `text_yay` for `yay.m4a`
      const folderName = `text_${path.basename(filePath, path.extname(filePath))}`;
      const outputFolder = path.join(__dirname, "../../transcribe-anything", folderName);
      const outputFilePath = path.join(outputFolder, "out.txt");

      try {
        // Read the transcription from `out.txt`
        const transcription = fs.readFileSync(outputFilePath, "utf8");

        // Save transcription to MongoDB
        await saveTranscriptionToMongoDB(transcription);
        resolve(transcription);
      } catch (readError) {
        reject(`Failed to read transcription: ${readError.message}`);
      } finally {
        // Clean up temporary files
        fs.unlinkSync(filePath);
        fs.rmSync(outputFolder, { recursive: true, force: true });
      }
    });
  });
};

module.exports = {
  transcribeAudio,
};
