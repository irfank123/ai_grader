// controllers/audioTranscriptionController.js
const path = require('path');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = 'your_mongodb_connection_string';
const client = new MongoClient(uri);
const dbName = 'your_database_name';
const collectionName = 'transcriptions';

// Define upload directory
const uploadDirectory = path.join(__dirname, '../uploads');

// Function to transcribe audio and retrieve `out.txt`
const transcribeAudio = (filePath) => {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname, '../../transcribe-anything'),
      args: [filePath],
    };

    PythonShell.run('transcribe.py', options, async (err, results) => {
      if (err) return reject(err);

      // Identify the generated folder, e.g., `text_yay` for `yay.m4a`
      const folderName = `text_${path.basename(filePath, path.extname(filePath))}`;
      const outputFolder = path.join(__dirname, '../../transcribe-anything', folderName);
      const outputFilePath = path.join(outputFolder, 'out.txt');

      try {
        // Read the transcription from `out.txt`
        const transcription = fs.readFileSync(outputFilePath, 'utf8');
        
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

// Function to save transcription to MongoDB
const saveTranscriptionToMongoDB = async (transcription) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne({ transcription, createdAt: new Date() });
  } finally {
    await client.close();
  }
};

// Express route handler
exports.uploadAndTranscribe = async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = path.join(uploadDirectory, file.filename);

  try {
    const transcription = await transcribeAudio(filePath);
    res.json({ transcription });
  } catch (error) {
    res.status(500).json({ error: `Transcription failed: ${error.message}` });
  }
};
