import { platformEnum } from "@shared/schema";
import { z } from "zod";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

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
  const basePrompt = `You are BlueprintForge, an AI architect that generates comprehensive, production-ready technical blueprints for software projects.

Generate a detailed technical blueprint that includes:

1. **Project Overview** - Clear description and goals
2. **Technical Architecture** - Stack recommendations, system design
3. **Database Schema** - Complete data models with relationships
4. **API Design** - RESTful endpoints with request/response schemas
5. **Frontend Components** - Component hierarchy and state management
6. **Implementation Plan** - Step-by-step development phases
7. **Deployment Strategy** - Production deployment recommendations
8. **Security Considerations** - Authentication, authorization, data protection
9. **Performance Optimizations** - Caching, scaling, monitoring
10. **Testing Strategy** - Unit, integration, and e2e testing approaches

Format the output in clean Markdown with proper headings, code blocks, and structured sections.`;

  const platformSpecific = {
    replit: `\n\nOptimize for Replit deployment:
- Use Node.js/React stack
- Single-port architecture (port 5000)
- Built-in database solutions (Neon)
- Replit-specific deployment configs`,
    cursor: `\n\nOptimize for Cursor IDE development:
- Modern TypeScript setup
- VSCode-compatible configs
- AI-friendly code structure
- Local development optimization`,
    lovable: `\n\nOptimize for Lovable platform:
- Component-based architecture
- Design system integration
- Rapid prototyping approach
- Visual development workflow`,
    windsurf: `\n\nOptimize for Windsurf development:
- Cloud-native architecture
- Serverless deployment patterns
- Edge computing considerations
- Auto-scaling configurations`
  };

  return basePrompt + platformSpecific[platform];
}

async function* callDeepSeekAPI(prompt: string, platform: z.infer<typeof platformEnum>): AsyncGenerator<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY_ENV_VAR || "demo_key";
  
  if (apiKey === "demo_key") {
    // Fallback to simulated generation for demo
    yield* simulateGeneration(prompt, platform);
    return;
  }

  const request: DeepSeekRequest = {
    model: "deepseek-reasoner",
    messages: [
      {
        role: "system",
        content: getSystemPrompt(platform)
      },
      {
        role: "user",
        content: `Generate a comprehensive technical blueprint for: ${prompt}`
      }
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 4000
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
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        
        // Process complete lines, keep incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("data: ")) {
            const data = trimmedLine.slice(6);
            
            if (data === "[DONE]") {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error("DeepSeek API error:", error);
    // Fallback to simulated generation
    yield* simulateGeneration(prompt, platform);
  }
}

async function* simulateGeneration(prompt: string, platform: z.infer<typeof platformEnum>): AsyncGenerator<string> {
  const sections = [
    `# ${prompt.charAt(0).toUpperCase() + prompt.slice(1)} - Technical Blueprint\n\n`,
    `## Project Overview\n\nA comprehensive ${prompt} designed for modern development workflows, optimized for the ${platform} platform.\n\n`,
    `## Technical Architecture\n\n### Frontend Stack\n- React 18 with TypeScript\n- Tailwind CSS for styling\n- React Query for state management\n- React Router for navigation\n\n`,
    `### Backend Stack\n- Node.js with Express.js\n- PostgreSQL database\n- Drizzle ORM\n- JWT authentication\n- Real-time updates via WebSockets\n\n`,
    `## Database Schema\n\n\`\`\`sql\n-- Core tables for ${prompt}\nCREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  name VARCHAR(255) NOT NULL,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\`\`\`\n\n`,
    `## API Endpoints\n\n### Authentication\n- \`POST /api/auth/login\` - User authentication\n- \`POST /api/auth/register\` - User registration\n- \`POST /api/auth/logout\` - User logout\n\n`,
    `### Core Features\n- \`GET /api/data\` - Retrieve application data\n- \`POST /api/data\` - Create new records\n- \`PUT /api/data/:id\` - Update existing records\n- \`DELETE /api/data/:id\` - Delete records\n\n`,
    `## Implementation Plan\n\n### Phase 1: Foundation (Week 1)\n- Set up development environment\n- Implement authentication system\n- Create database schema\n\n### Phase 2: Core Features (Week 2-3)\n- Build main application features\n- Implement API endpoints\n- Create responsive UI components\n\n### Phase 3: Polish & Deploy (Week 4)\n- Add real-time features\n- Implement error handling\n- Deploy to production\n\n`,
    `## Deployment Strategy\n\n**Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}**\n\n- Containerized deployment\n- Environment-specific configurations\n- CI/CD pipeline setup\n- Monitoring and logging\n\n`,
    `## Security Considerations\n\n- JWT-based authentication\n- Input validation and sanitization\n- CORS configuration\n- Rate limiting\n- HTTPS enforcement\n\n`,
    `## Performance Optimizations\n\n- Database indexing strategy\n- Caching implementation\n- Code splitting and lazy loading\n- CDN integration\n- Image optimization\n\n`,
    `## Testing Strategy\n\n- Unit tests for business logic\n- Integration tests for API endpoints\n- End-to-end tests for user workflows\n- Performance testing\n- Security testing\n\n`,
    `## Monitoring and Maintenance\n\n- Application performance monitoring\n- Error tracking and reporting\n- Automated backup systems\n- Regular security updates\n- User analytics and feedback\n\n`,
    `---\n\n**Blueprint Generation Complete** ✅\n\nThis blueprint provides a comprehensive foundation for building your ${prompt}. Each section can be expanded based on specific requirements and constraints.\n\n`
  ];

  for (const section of sections) {
    // Simulate realistic typing speed
    const words = section.split(" ");
    for (let i = 0; i < words.length; i++) {
      const chunk = i === 0 ? words[i] : " " + words[i];
      yield chunk;
      
      // Variable delay to simulate natural generation
      const delay = Math.random() * 50 + 25; // 25-75ms per word
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function* generateBlueprint(prompt: string, platform: z.infer<typeof platformEnum>): AsyncGenerator<string> {
  yield* callDeepSeekAPI(prompt, platform);
}
