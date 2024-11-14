const fs = require('fs');
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//fucntion to transcribe audio to text with the help openai api
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

// function that uses openai api and question details to grade the answer
async function gradeSubmission(imagePath, transcription, question, officialAnswer) {
    try {
      const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
      
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI grading assistant for a precalculus course in high school and university.Your task is to analyze a student's written work (image) and verbal explanation for a math problem. Provide a comprehensive assessment that includes:

                    1. An overall letter grade (A, B, C, D, F with + or - if applicable)
                    2. Detailed feedback on the written work
                    3. Specific feedback on the verbal explanation

                    In your assessment, pay special attention to:
                    - Conceptual understanding: Identify and explain any misconceptions or incorrect assumptions.
                    - Mathematical reasoning: Evaluate the student's logical approach and problem-solving strategy.
                    - Procedural knowledge: Assess the correct application of mathematical operations and techniques.
                    - Communication: Evaluate how well the student explains their thought process and justifies their steps.

                    Importantly, highlight any instances where the student might be using tricks or shortcuts without demonstrating a deep understanding of the underlying principles. For example, if a student "moves" a term to the other side of an equation by changing its sign, explain why this works mathematically (in terms of performing the same operation on both sides).

                    Your goal is to not only grade the work but also to provide constructive feedback that enhances the student's conceptual understanding and mathematical reasoning skills.

                    Format your response as a JSON object with keys: 'grade', 'writtenFeedback', and 'spokenFeedback'. Ensure each feedback section addresses conceptual understanding, correct application of methods, and areas for improvement.
            
            `
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: `Question: ${question}\n\nOfficial Answer: ${officialAnswer}\n\nStudent's Verbal Explanation: ${transcription}\n\nProvide a comprehensive assessment based on both the written solution in the image and the verbal explanation. Consider accuracy, methodology, presentation, and clarity. Structure your response as follows:\n\n{
    "grade": "A letter grade (A, B, C, D, or F, with + or - if applicable)",
    "writtenFeedback": "Detailed feedback on the written solution, including strengths, weaknesses, and suggestions for improvement",
    "spokenFeedback": "Evaluation of the verbal explanation, including clarity, completeness, and understanding demonstrated"
  }\n\nEnsure your response is valid JSON.`
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
        max_tokens: 3200
      });
  
      // Parse the JSON response
      //const feedbackObject = JSON.parse(response.choices[0].message.content);
      // Clean the response content by removing Markdown code block markers (` ```json`)
      let cleanedContent = response.choices[0].message.content;
      cleanedContent = cleanedContent.replace(/```json/g, '').replace(/```/g, ''); // Remove the ```json and closing ```

        // Now parse the cleaned content as JSON
      const feedbackObject = JSON.parse(cleanedContent);

      return feedbackObject;
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
      console.log(JSON.stringify(feedback, null, 2));
      
      // Here you can save the feedback object directly to your database
      return feedback;
    } catch (error) {
      console.error("An error occurred during submission processing:", error);
      throw error;
    }
  }
  
  // Usage
  // Retrive the things below from mongo db
  const imagePath = '/Users/irfank/Downloads/testvideodomainlastframe.png';
  const audioPath = '/Users/irfank/Downloads/domainvideo.mp3';
  const question = "Find the domain of the function: f(x) = x^4 / (x^2 + x - 42)";
  const officialAnswer = "(-∞, -7) ∪ (-7, 6) ∪ (6, ∞)";

  
  processSubmission(imagePath, audioPath, question, officialAnswer)
.then(feedback => {
      // feedback object will have the structure:
      // {
      //   grade: "A-",
      //   writtenFeedback: "The solution is correct and well-presented...",
      //   spokenFeedback: "The verbal explanation was clear and demonstrated good understanding..."
      // }
      
      // Save to database or send response to client
    })
    .catch(error => {
      // Handle any errors
    });















