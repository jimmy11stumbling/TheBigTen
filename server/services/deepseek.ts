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
  const basePrompt = `You are an expert AI system architect known as the "NoCodeLos Blueprint Engine". Your purpose is to receive a user's application idea and generate a complete, production-ready "Unified Project Blueprint & Requirements Document" based on the proprietary NoCodeLos methodology.

Your entire output MUST be a single, complete Markdown document based on the template provided below.

**CRITICAL INSTRUCTIONS:**

1. **Analyze the User's Request:** Carefully analyze the user's prompt to identify the core application type (e.g., blog, CRM, e-commerce), key features, target audience, and any specified technologies (e.g., React, Python, Supabase, Replit).

2. **Populate Every Section:** You must fill in every placeholder [like this] in the template with specific, relevant, and actionable information derived from the user's request. Do not leave any placeholders. Be decisive and make educated assumptions where necessary.

3. **Generate Actionable Prompts (Layer 1):** In the "Core Build Prompts & Tasks" section, generate 3-5 concrete, high-quality prompts that a developer could give to another AI to start building the specific features of the requested application.

4. **Define a Coherent Architecture (Layer 2):** Based on the user's request, define a logical technology stack, draw a simple Mermaid diagram, outline a specific folder structure, and define the primary data models and API endpoints.

5. **Adapt Technology Stacks:** The template's examples use certain technologies. You MUST adapt all code snippets, build prompts, and technical recommendations to match the user's requested tech stack. If they ask for Vue.js, provide Vue.js code. If they ask for a Go backend, provide Go code. If no stack is specified, default to a modern stack like React/TypeScript and a Python/FastAPI backend.

6. **Maintain Brand Identity:** Sections like "Quality & Execution Framework" and "Project Management & Logistics" are part of the brand. Populate them with realistic data but keep their structure and tone intact to maintain the official format.

Your final output must be the fully populated Markdown document. Do not ask for more details. Begin generation immediately.`;

  const platformSpecific = {
    replit: `

**PLATFORM OPTIMIZATION FOR REPLIT:**
- Prioritize single-port architecture (port 5000)
- Use Node.js/React stack for compatibility
- Leverage Neon PostgreSQL for database
- Include Replit-specific deployment configurations
- Focus on file-based development workflow`,
    cursor: `

**PLATFORM OPTIMIZATION FOR CURSOR:**
- Emphasize modern TypeScript setup
- Include VSCode-compatible configurations
- Structure code for AI-assisted development
- Optimize for local development environment
- Include intelligent code completion considerations`,
    lovable: `

**PLATFORM OPTIMIZATION FOR LOVABLE:**
- Focus on component-based architecture
- Include design system integration
- Emphasize rapid prototyping capabilities
- Structure for visual development workflow
- Include no-code/low-code considerations`,
    windsurf: `

**PLATFORM OPTIMIZATION FOR WINDSURF:**
- Emphasize cloud-native architecture
- Include serverless deployment patterns
- Consider edge computing requirements
- Focus on auto-scaling configurations
- Include distributed system considerations`
  };

  return basePrompt + platformSpecific[platform];
}

async function* callDeepSeekAPI(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  if (!userApiKey) {
    // No API key provided - use simulation
    yield* simulateGeneration(prompt, platform);
    return;
  }
  
  const apiKey = userApiKey;

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
  const appName = prompt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sections = [
    `# **Unified Project Blueprint & Requirements Document (PRD)**\n## From Vision to Production-Ready Code in a Single Document\n\n---\n\n`,
    `### **Project Metadata**\n- **Project Name:** \`${appName}\`\n- **Version:** \`1.0\`\n- **Status:** \`Approved\`\n- **Owner(s):** \`Development Team\`\n- **Last Updated:** \`${currentDate}\`\n\n---\n\n`,
    `## **1. The Product Vision (The "What & Why")**\n\n### **1.1. Executive Summary**\n*   **The Idea:** A comprehensive ${prompt} designed to streamline workflows and enhance user productivity.\n*   **The Goal:** Enable users to efficiently manage their tasks and collaborate effectively within a modern, intuitive platform.\n\n`,
    `### **1.2. Problem Statement**\nUsers struggle with fragmented tools and inefficient workflows when trying to ${prompt.toLowerCase()}. Current solutions lack integration and user-friendly interfaces, leading to decreased productivity and user frustration.\n\n`,
    `### **1.3. Target Audience & User Personas**\n- **Primary Audience:** Professionals and teams seeking efficient workflow management\n- **User Persona 1:**\n    - **Goal:** Streamline daily tasks and improve team collaboration\n    - **Pain Point:** Struggles with disconnected tools and complex interfaces\n\n`,
    `### **1.4. Core User Stories / Epics**\n- **(Epic 1):** As a user, I want to create, manage, and track my tasks seamlessly across different devices and platforms.\n- **(Epic 2):** As a team member, I want to collaborate with others in real-time and share updates efficiently.\n\n`,
    `### **1.5. Success Metrics (KPIs)**\n- **Adoption:** 500 active users within the first 2 months of launch\n- **Engagement:** Average session time of 8+ minutes per user visit\n\n---\n\n`,
    `## **2. The Technical Blueprint (The "How")**\n\n### **2.1. Layer 1: Core Build Prompts & Tasks**\n*These are actionable, AI-ready prompts to kickstart development.*\n\n`,
    `- **UI Component:** "Build a React TypeScript component library with Tailwind CSS that includes a responsive dashboard layout, data tables with sorting/filtering, and form components with validation for ${prompt} management."\n\n`,
    `- **API Endpoint:** "Create a RESTful Express.js API with TypeScript that handles CRUD operations for ${prompt.toLowerCase()}, includes authentication middleware, input validation with Zod, and proper error handling."\n\n`,
    `- **Database Schema:** "Design a PostgreSQL schema using Drizzle ORM with tables for users, ${prompt.toLowerCase().replace(/\s+/g, '_')}, categories, and audit logs, including proper relationships and indexes."\n\n`,
    `### **2.2. Layer 2: Master Architecture**\n- **Technology Stack:**\n    - **Frontend:** React 18, TypeScript, Tailwind CSS, React Query\n    - **Backend:** Node.js, Express.js, TypeScript\n    - **Database:** PostgreSQL with Drizzle ORM\n    - **Authentication:** JWT with bcrypt\n    - **Primary Hosting Platform:** ${platform.charAt(0).toUpperCase() + platform.slice(1)}\n\n`,
    `- **System Architecture Diagram:**\n\`\`\`mermaid\ngraph TD\n    A[User Interface] --> B[React Frontend]\n    B --> C[Express API Server]\n    C --> D[PostgreSQL Database]\n    C --> E[Authentication Service]\n    B --> F[Real-time Updates]\n    C --> G[File Storage]\n\`\`\`\n\n`,
    `- **Folder & Component Structure:**\n\`\`\`\n/client\n  /src\n    /components\n      - Header.tsx\n      - Sidebar.tsx\n      - ${appName}List.tsx\n      - ${appName}Form.tsx\n    /pages\n      - Dashboard.tsx\n      - ${appName}Page.tsx\n    /hooks\n      - use${appName}.ts\n    /types\n      - ${appName.toLowerCase()}.ts\n/server\n  /routes\n    - ${appName.toLowerCase()}.ts\n    - auth.ts\n  /models\n    - ${appName}.ts\n  /middleware\n    - auth.ts\n/shared\n  - schema.ts\n  - types.ts\n\`\`\`\n\n`,
    `- **Data Models & Schema:**\n\`\`\`typescript\ninterface ${appName} {\n  id: string;\n  title: string;\n  description: string;\n  status: 'active' | 'inactive' | 'completed';\n  userId: string;\n  createdAt: Date;\n  updatedAt: Date;\n}\n\ninterface User {\n  id: string;\n  email: string;\n  name: string;\n  role: 'admin' | 'user';\n  createdAt: Date;\n}\n\`\`\`\n\n`,
    `- **API Endpoints (Contract):**\n    - \`POST /api/${appName.toLowerCase()}\` - Creates a new ${prompt.toLowerCase()}\n    - \`GET /api/${appName.toLowerCase()}\` - Retrieves all ${prompt.toLowerCase()}\n    - \`PUT /api/${appName.toLowerCase()}/:id\` - Updates a specific ${prompt.toLowerCase()}\n    - \`DELETE /api/${appName.toLowerCase()}/:id\` - Deletes a ${prompt.toLowerCase()}\n\n`,
    `### **2.3. Layer 3: Refactor & Optimization Engine**\n- **Component Splitting:** Separate data fetching logic into custom hooks, split large components into smaller, reusable pieces, and implement proper component composition patterns.\n\n- **Performance Bottlenecks:** Implement virtual scrolling for large lists, add pagination for data tables, and use React.memo for expensive component renders.\n\n`,
    `### **2.4. Layer 4: Error Recovery & Resilience**\n- **Error Patterns:** Handle network failures with exponential backoff retry logic, implement proper form validation with user-friendly error messages.\n\n- **Debugging Strategies:** Use React Developer Tools for component debugging, implement comprehensive logging with structured error tracking.\n\n`,
    `### **2.5. Layer 5: Platform & Deployment Strategy**\n- **Target Platform(s):** ${platform.charAt(0).toUpperCase() + platform.slice(1)} for development and initial deployment\n- **Deployment Workflow:** Git push → automatic build → deploy to production with health checks\n- **Environment Variables:** \`DATABASE_URL\`, \`JWT_SECRET\`, \`NODE_ENV\`, \`PORT\`\n\n---\n\n`,
    `## **3. Quality & Execution Framework**\n\n### **3.1. Development Standards**\n□ **Code Style:** Prettier + ESLint with TypeScript strict mode\n□ **Testing:** Vitest for unit tests, React Testing Library for component tests, aim for 80%+ coverage\n□ **Version Control:** All work on feature branches, merged via Pull Requests\n\n`,
    `### **3.2. Performance Benchmarks**\n□ **First Contentful Paint (FCP):** \`< 1.8s\`\n□ **Largest Contentful Paint (LCP):** \`< 2.5s\`\n□ **API Response Time (p95):** \`< 200ms\`\n\n`,
    `### **3.3. User Experience & Accessibility (UX/UI)**\n□ **Responsive Design:** Mobile-first approach\n□ **Accessibility:** WCAG 2.1 AA compliant\n□ **UI States:** Clear loading, error, and empty states implemented\n\n---\n\n`,
    `## **4. Project Management & Logistics**\n\n### **4.1. Implementation Phases & Timeline**\n- **Phase 1: Backend Setup (1 Day):** Database schema, API endpoints, authentication\n- **Phase 2: Frontend Development (2 Days):** Core components, state management, UI integration\n- **Phase 3: Integration & Deployment (1 Day):** E2E testing, deployment setup, go-live\n\n`,
    `### **4.2. Future Scope & Version 2.0 Ideas**\n- Advanced analytics and reporting dashboard\n- Mobile application for iOS and Android\n- Third-party integrations (Slack, email, calendar)\n\n---\n\n`,
    `*Generated by the NoCodeLos Blueprint Stack v3.1*\n*"The single document that replaces meetings."*\n\n`
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

export async function* generateBlueprint(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  yield* callDeepSeekAPI(prompt, platform, userApiKey);
}
