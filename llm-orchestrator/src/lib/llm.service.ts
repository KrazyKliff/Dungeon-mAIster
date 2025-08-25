import axios from 'axios';

/**
 * Sends a prompt to a locally hosted LLM via OpenWebUI.
 * Assumes the UI is running in OpenAI-compatible API mode.
 */
export async function askAI(prompt: string): Promise<string> {
  // Default URL for a local OpenWebUI instance.
  // You may need to change this port if your setup is different.
  const apiUrl = 'http://localhost:8080/v1/chat/completions';

  try {
    const response = await axios.post(
      apiUrl,
      {
        // This is a standard OpenAI-compatible request body.
        // You can specify the model you have loaded in OpenWebUI here.
        model: 'llama3', // <-- IMPORTANT: Change this to your loaded model name
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // OpenWebUI running locally typically doesn't require an API key
        },
      }
    );

    // This is the standard path for the response text.
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling local OpenWebUI API:', error.response?.data || error.message);
    return 'Sorry, the local AI server is not responding. Please ensure OpenWebUI is running.';
  }
}
