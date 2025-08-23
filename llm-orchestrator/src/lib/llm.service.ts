import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

/**
 * Sends a prompt to the Google Gemini API and returns the response.
 */
export async function askAI(prompt: string): Promise<string> {
  const apiKey = process.env.LLM_API_KEY;
  // This is the API endpoint for the Gemini Pro model
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  if (!apiKey) {
    throw new Error('LLM_API_KEY is not set in the .env file.');
  }

  try {
    const response = await axios.post(
      apiUrl,
      {
        // This is the request body structure for the Gemini API
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // This is how we parse the response from the Gemini API
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data?.error || error.message);
    return 'Sorry, I encountered an error with the Gemini API.';
  }
}
