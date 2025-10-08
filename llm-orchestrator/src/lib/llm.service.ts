import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Sends a prompt to a locally hosted LLM via OpenWebUI.
 * Assumes the UI is running in OpenAI-compatible API mode.
 */
export async function askAI(prompt: string): Promise<string> {
  const apiUrl = process.env['LLM_API_URL'] || 'http://localhost:8080/v1/chat/completions';
  const model = process.env['LLM_MODEL'] || 'llama3';
  const apiKey = process.env['LLM_API_KEY'];
  const temperature = parseFloat(process.env['LLM_TEMPERATURE'] || '0.7');
  const timeout = parseInt(process.env['LLM_TIMEOUT'] || '30000');

  try {
    const response = await axios.post(
      apiUrl,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
        },
        timeout,
      }
    );

    // Validate response
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from LLM service');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('LLM service is not running. Please ensure the AI server is started.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('LLM service request timed out. The AI server may be overloaded.');
      } else if (error.response?.status === 401) {
        throw new Error('LLM service authentication failed. Check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('LLM service rate limit exceeded. Please try again later.');
      }
    }
    
    throw new Error(`LLM service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
