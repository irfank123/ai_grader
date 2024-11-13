const fs = require('fs');
const OpenAI = require('openai');
const path = require('path');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function encodeImageToBase64(imagePath) {
  return fs.readFileSync(imagePath).toString('base64');
}

async function sendImageAndTextToOpenAI(imagePath, textInput) {
  // Encode the image
  const base64Image = encodeImageToBase64(imagePath);

  // Create the message with the image and text
  const message = {
    role: "user",
    content: [
      { type: "text", text: textInput },
      {
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`
        }
      }
    ]
  };

  try {
    // Send the request to OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o",  // Make sure this is the correct model name
      messages: [message],
      max_tokens: 300
    });

    // Print the response
    const markdownContent = response.choices[0].message.content;
    console.log(markdownContent);

    // Write the markdown content to a .md file
    const filePath = 'function_domain_solution.md';
    fs.writeFileSync(filePath, markdownContent);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Main execution
const imagePath = "/Users/irfank/Downloads/testvideodomainlastframe.png"; // Retrieving image from mongo part
const textInput = "Analyze the image and solve the problem for me and grade how well the problem was done. Write a breakdown on how the problem was solved and give it a grade.";

sendImageAndTextToOpenAI(imagePath, textInput);