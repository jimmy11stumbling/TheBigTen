import { platformEnum } from "@shared/schema";
import { buildSystemPrompt } from "./system-prompt";
import { getPlatformDatabase } from "@shared/platform-databases";
import { z } from "zod";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  stream: boolean;
  temperature?: number;
  max_tokens?: number;
}

function getSystemPrompt(platform: z.infer<typeof platformEnum>): string {
  const platformDB = getPlatformDatabase(platform);
  return buildSystemPrompt(platform, platformDB);
}

async function* callDeepSeekAPI(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  if (!userApiKey) {
    yield "\n\n> **⚠️ API Key Required**: Please add your DeepSeek API key in Settings to generate blueprints.\n\n";
    return;
  }

  console.log(`[DEBUG] Starting blueprint generation for prompt: "${prompt.substring(0, 50)}..."`);
  let totalTokens = 0;

  const apiKey = userApiKey;

  const systemPrompt = getSystemPrompt(platform);
  console.log(`[DEBUG] System prompt length: ${systemPrompt.length}`);
  console.log(`[DEBUG] Contains serialization errors: ${systemPrompt.includes('object Object')}`);
  console.log(`[DEBUG] Contains workout: ${systemPrompt.includes('workout')}`);
  console.log(`[DEBUG] Contains SQL example: ${systemPrompt.includes('CREATE TABLE users')}`);
  console.log(`[DEBUG] First 200 chars: ${systemPrompt.substring(0, 200)}...`);

  const request: DeepSeekRequest = {
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Generate a comprehensive technical blueprint for: ${prompt}

CRITICAL COMPLETION REQUIREMENTS:
- Every function MUST have complete implementation with closing braces
- Every code block MUST be syntactically complete and runnable
- Never stop mid-function or leave incomplete implementations
- Complete all sections with working code examples
- If you start a function, database schema, or component, finish it completely`
      }
    ],
    stream: true,
    temperature: 0.3,  // Lower temperature for more focused, complete responses
    max_tokens: 16384,
    top_p: 0.95,       // Add top_p for better completion consistency
    frequency_penalty: 0.1  // Slight penalty to encourage completion
  };

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    if (!response.body) {
      throw new Error("No response body received");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            console.log(`[DEBUG] Stream completed normally with [DONE] signal. Total content: ${totalTokens} chars`);
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            const finishReason = parsed.choices?.[0]?.finish_reason;
            
            if (content) {
              totalTokens += content.length;
              console.log(`[DEBUG] Received chunk: ${content.length} chars, total: ${totalTokens}`);
              yield content;
            }
            
            // Log finish reason to debug early termination
            if (finishReason) {
              console.log(`[DEBUG] API finished with reason: ${finishReason}, total content: ${totalTokens} chars`);
              if (finishReason === 'length') {
                console.log('[WARNING] API terminated due to max tokens - content may be incomplete');
              } else if (finishReason === 'stop') {
                console.log('[INFO] API completed normally (stop token reached)');
              }
            }
          } catch (e) {
            console.error('[DEBUG] Error parsing SSE data:', e, 'Raw data:', data);
            continue;
          }
        }
      }
    }
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    yield `\n\n> **Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n`;
  }
}

export async function* generateBlueprint(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  yield* callDeepSeekAPI(prompt, platform, userApiKey);
}