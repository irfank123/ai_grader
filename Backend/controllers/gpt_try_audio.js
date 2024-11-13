const fs = require('fs');
const OpenAI = require('openai');

// Initialize the OpenAI client
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
    return null;
  }
}

async function gradeExplanation(transcribedText) {
  try {// just an example prompt for now, will optimise it later
    const prompt = ` 
      The following text is a transcription of an audio explanation for the following math problem
      To find the domain of the function \( f(x) = \frac{x^4}{x^2 + x - 42} \), we need to determine where the denominator is not equal to zero.

### Step-by-Step Solution

1. **Set the Denominator to Zero:**

   \[
   x^2 + x - 42 = 0
   \]

2. **Factor the Quadratic:**

   \[
   x^2 + 7x - 6x - 42 = 0
   \]

   Group terms:

   \[
   (x + 7)(x - 6) = 0
   \]

3. **Solve for \( x \):**

   \[
   x + 7 = 0 \quad \text{or} \quad x - 6 = 0
   \]

   \[
   x = -7 \quad \text{or} \quad x = 6
   \]

4. **Exclude these values from the domain:**

   The values \( x = -7 \) and \( x = 6 \) make the denominator zero, so these are excluded from the domain.

5. **Write the Domain in Interval Notation:**

   The domain, excluding these points, is:

   \[
   (-\infty, -7) \cup (-7, 6) \cup (6, \infty)
   \]

      Please grade how well the explanation was done, considering factors such as clarity, 
      completeness, accuracy, and organization. Provide a detailed assessment and a letter grade (A, B, C, D, or F).

      Transcribed text:
      ${transcribedText}

      Grade and Assessment:
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o",  // Make sure you have access to GPT-4
      messages: [
        { role: "system", content: "You are an expert educator tasked with grading explanations." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(`An error occurred during grading: ${error}`);
    return null;
  }
}

async function main() {
  const audioFilePath = "/Users/irfank/Downloads/domainvideo.mp3";  // Replace with your audio file path from mongodb

  // Step 1: Transcribe audio
  const transcribedText = await transcribeAudio(audioFilePath);

  if (transcribedText) {
    console.log("Transcription:");
    console.log(transcribedText);
    console.log("\n" + "=".repeat(50) + "\n");

    // Step 2: Grade the explanation
    const gradeResult = await gradeExplanation(transcribedText);

    if (gradeResult) {
      console.log("Grading Result:");
      console.log(gradeResult);
    } else {
      console.log("Grading failed.");
    }
  } else {
    console.log("Transcription failed.");
  }
}

main().catch(console.error);