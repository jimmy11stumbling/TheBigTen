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

  const apiKey = userApiKey;

  const systemPrompt = getSystemPrompt(platform);
  console.log(`[DEBUG] System prompt length: ${systemPrompt.length}`);
  console.log(`[DEBUG] Contains [object Object]: ${systemPrompt.includes('[object Object]')}`);
  console.log(`[DEBUG] Contains object serialization: ${systemPrompt.includes('object Object')}`);
  console.log(`[DEBUG] Contains workout: ${systemPrompt.includes('workout')}`);
  console.log(`[DEBUG] Contains SQL example: ${systemPrompt.includes('CREATE TABLE users')}`);
  const platformDB = getPlatformDatabase(platform);
  console.log(`[DEBUG] Platform DB type: ${typeof platformDB}`);
  console.log(`[DEBUG] Platform DB exists: ${!!platformDB}`);
  console.log(`[DEBUG] First 200 chars: ${systemPrompt.substring(0, 200)}...`);
  
  // Check if system prompt contains serialization errors
  if (systemPrompt.includes('[object Object]') || systemPrompt.includes('object Object')) {
    console.error('[ERROR] System prompt contains object serialization errors!');
    console.error('[ERROR] This will cause AI to generate placeholder text instead of real code');
    console.error('[ERROR] Platform DB:', platformDB ? 'exists' : 'is undefined');
  }

  const request: DeepSeekRequest = {
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Generate a comprehensive technical blueprint for: ${prompt}`
      }
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 8192
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
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
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