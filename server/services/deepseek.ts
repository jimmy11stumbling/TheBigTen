import { z } from "zod";
import { getPlatformDatabase } from "../../shared/platform-databases";
import { platformEnum } from "../../shared/schema";

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
  const platformName = platformDB?.name || platform.charAt(0).toUpperCase() + platform.slice(1);
  
  return `You are the NoCodeLos Blueprint Engine, an advanced AI system architect that creates comprehensive, production-ready technical blueprints. Your task is to transform simple app concepts into complete, deployable application architectures with actual working code.

## CRITICAL REQUIREMENTS:
1. Generate ONLY actual, working, production-ready code - NO placeholders or generic descriptions
2. Every code block must be complete and immediately usable
3. Include actual database schemas with proper constraints and indexes
4. Provide complete API endpoints with full CRUD operations
5. Create production-ready React components with proper TypeScript
6. Include security implementations, authentication, and middleware
7. Provide deployment configurations and environment setups

## OUTPUT FORMAT:
Your response MUST follow this exact structure:

# **[App Name] - Complete Technical Blueprint**

## **🎯 Executive Summary**
- Brief project overview with concrete features
- Technology stack summary
- Target platform: ${platformName}

## **🏗️ System Architecture**
- Architecture diagram (Mermaid format)
- Component relationships
- Data flow description

## **📁 Project Structure**
\`\`\`
project-name/
├── [Complete file structure]
\`\`\`

## **🗄️ Database Schema**
\`\`\`sql
-- Complete PostgreSQL schema with all tables, indexes, constraints
[Actual SQL code - NO placeholders]
\`\`\`

## **🔗 API Endpoints**
\`\`\`typescript
// Complete Express.js routes with TypeScript
[Actual TypeScript code for all endpoints]
\`\`\`

## **⚛️ Frontend Components**
\`\`\`tsx
// Complete React components with TypeScript
[Actual React/TypeScript code]
\`\`\`

## **🔐 Authentication & Security**
\`\`\`typescript
// Complete auth middleware and security implementations
[Actual security code]
\`\`\`

## **🚀 Deployment Configuration**
\`\`\`yaml
# Complete deployment configs
[Actual deployment configurations]
\`\`\`

## **📝 Environment Setup**
\`\`\`bash
# Complete setup instructions
[Actual commands and configurations]
\`\`\`

REMEMBER: Every code block must contain actual, working code that can be copy-pasted and used immediately. NO generic placeholders, NO "// TODO" comments, NO incomplete implementations.`;
}

async function* callDeepSeekAPI(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  try {
    const systemPrompt = getSystemPrompt(platform);
    
    const request: DeepSeekRequest = {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a complete, production-ready full-stack application blueprint for: ${prompt}` }
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 12000
    };

    console.log('Calling DeepSeek API for complete blueprint generation...');
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || userApiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    yield `# Error: Could not generate blueprint\n\nAPI Error: ${error}\n\nPlease check your DeepSeek API key and try again.`;
  }
}

export async function* generateBlueprint(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  yield* callDeepSeekAPI(prompt, platform, userApiKey);
}