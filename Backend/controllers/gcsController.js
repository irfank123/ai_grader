// const express = require('express');
// const multer = require('multer');
// const { Storage } = require('@google-cloud/storage');
// const path = require('path');

// const router = express.Router();
// const storage = new Storage({ keyFilename: '/Users/irfank/Downloads/ppds-f-24-470a0a2126e6.json' });

// const bucket = storage.bucket('ai-grader-storage');

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// });

// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     const blob = bucket.file(req.file.originalname);
//     const blobStream = blob.createWriteStream({
//       resumable: false,
//       contentType: req.file.mimetype,
//     });

//     blobStream.on('error', (err) => {
//       res.status(500).send({ message: err.message });
//     });

//     blobStream.on('finish', () => {
//       const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//       res.status(200).send({ publicUrl });
//     });

//     blobStream.end(req.file.buffer);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// module.exports = router;

// const express = require('express');
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

// // const router = express.Router();
// const storage = new Storage({
//   keyFilename: "/Users/irfank/Downloads/ppds-f-24-470a0a2126e6.json",
// });


const storage = new Storage({credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)});

const bucket = storage.bucket("ai-grader-storage");

// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased file size limit for audio files (10MB)
});

// Generic upload handler
async function uploadToGCS(file, res) {
  try {
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).send({ publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function uploadToResearchStorage(file, res) {
  try {
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Construct the full path with the directory
    const directoryPath = 'future_research_storage/';
    const fullPath = `${directoryPath}${file.originalname}`;
    
    const blob = bucket.file(fullPath);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("error", (err) => {
      console.error('Upload error:', err);
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fullPath}`;
      res.status(200).send({
        message: 'Upload successful',
        fileName: file.originalname,
        storagePath: fullPath,
        publicUrl
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).send({ 
      message: 'Failed to process upload',
      error: error.message 
    });
  }
}







async function deleteAllFilesfromRoot() {
  const bucketName = 'ai-grader-storage';
  const bucket = storage.bucket(bucketName);
  const directoryToSkip = 'future_research_storage/';

  try {
    const [files] = await bucket.getFiles();
    console.log(`Found ${files.length} files in bucket ${bucketName}.`);

    for (const file of files) {
      // Skip the specified directory and its contents
      if (file.name.startsWith(directoryToSkip)) {
        console.log(`Skipping deletion of file in protected directory: ${file.name}`);
        continue;
      }

      try {
        await file.delete();
        console.log(`Deleted file: ${file.name}`);
      } catch (error) {
        console.error(`Error deleting file ${file.name}:`, error);
      }
    }

    console.log('File deletion completed (protected directory preserved).');
  } catch (error) {
    console.error('Error listing or deleting files:', error);
  }
}















// // Route for image uploads
// router.post('/upload/image', upload.single('file'), (req, res) => {
//   uploadToGCS(req.file, res);
// });

// // Route for audio uploads
// router.post('/upload/audio', upload.single('file'), (req, res) => {
//   uploadToGCS(req.file, res);
// });

// module.exports = router;
module.exports = {
  uploadToGCS,
  uploadToResearchStorage,
  deleteAllFilesfromRoot,
  upload,
};
