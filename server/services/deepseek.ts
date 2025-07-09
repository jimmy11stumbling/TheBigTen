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

  let totalTokens = 0;
  const apiKey = userApiKey;
  const systemPrompt = getSystemPrompt(platform);

  const request: DeepSeekRequest = {
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Create an extremely comprehensive and detailed technical blueprint for: ${prompt}

CRITICAL REQUIREMENTS:
- MINIMUM 4000+ tokens of detailed content
- Use ONLY natural language descriptions and thorough explanations
- ABSOLUTELY NO code examples, snippets, or technical syntax
- Explain every architectural decision with detailed reasoning
- Provide exhaustive step-by-step implementation guidance
- Include detailed explanations of data flows, user interactions, and system behaviors
- Describe each component with comprehensive detail about its purpose, functionality, and relationships
- Elaborate on integration points with extensive detail about how systems communicate
- Provide thorough explanations of deployment strategies, testing approaches, and maintenance considerations
- Include detailed risk analysis and mitigation strategies
- Write as if explaining to both technical and non-technical stakeholders
- Every section should be thoroughly detailed with multiple paragraphs of explanation
- Focus on comprehensive planning and detailed strategy explanations

The blueprint should be so detailed that any developer could understand exactly what to build and how to build it, even without seeing any code examples.`
      }
    ],
    stream: true,
    temperature: 0.1,  // Very low temperature for consistent, complete responses
    max_tokens: 16384  // Increased to allow for comprehensive blueprints
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
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            const finishReason = parsed.choices?.[0]?.finish_reason;
            
            if (content) {
              totalTokens += content.length;
              yield content;
            }
          } catch (e) {
            // Skip malformed SSE data
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