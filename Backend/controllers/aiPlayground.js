
const fs = require('fs');
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function transcribeAudio(audioFilePath) {
  try {
    const transcription = await client.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(audioFilePath)
    });
    return transcription.text;
  } catch (error) {
    console.error(`An error occurred during transcription: ${error}`);
    throw error;
  }
}


async function gradeSubmission(imagePath, transcription, question, officialAnswer) {
    try {
      const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
      
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI grading assistant tasked with providing comprehensive feedback on a student's math solution and explanation. Analyze the image of the student's written work and their verbal explanation, then provide a detailed assessment."
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: `Question: ${question}\n\nOfficial Answer: ${officialAnswer}\n\nStudent's Verbal Explanation: ${transcription}\n\nPlease provide a comprehensive grade and feedback based on both the written solution in the image and the verbal explanation. Consider the following aspects:\n1. Accuracy of the solution\n2. Problem-solving methodology\n3. Presentation and clarity of written work\n4. Completeness and clarity of verbal explanation\n5. Understanding of concepts\n\nProvide a detailed analysis, constructive feedback, and an overall grade (e.g., A, B, C, D, F with + or - if applicable).`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 800
      });
  
      return response.choices[0].message.content;
    } catch (error) {
      console.error("An error occurred during grading:", error);
      throw error;
    }
  }


async function processSubmission(imagePath, audioPath, question, officialAnswer) {
    try {
      // Step 1: Transcribe the audio
      const transcription = await transcribeAudio(audioPath);
      
      // Step 2: Grade the submission
      const feedback = await gradeSubmission(imagePath, transcription, question, officialAnswer);
      
      console.log("Grading Feedback:");
      console.log(feedback);
      
      // Here you can save the feedback to a database, send it to the student, etc.
      return feedback;
    } catch (error) {
      console.error("An error occurred during submission processing:", error);
      throw error;
    }
  }
  
  // Usage
  const imagePath = '/path/to/student/solution.jpg';
  const audioPath = '/path/to/student/explanation.mp3';
  const question = "Solve the quadratic equation: x^2 + 5x + 6 = 0";
  const officialAnswer = "x = -2 or x = -3";
  
  processSubmission(imagePath, audioPath, question, officialAnswer)
    .then(feedback => {
      // Handle the feedback (e.g., save to database, send to student)
    })
    .catch(error => {
      // Handle any errors
    });