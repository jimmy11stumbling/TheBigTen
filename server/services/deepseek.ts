import { platformEnum } from "@shared/schema";
import { getPlatformDatabase } from "@shared/platform-databases";
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
  const platformDB = getPlatformDatabase(platform);
  
  const platformContext = platformDB ? `

## TARGET PLATFORM: ${platformDB.name}

**Platform Overview:**
- Vendor: ${platformDB.vendor}
- Primary Function: ${platformDB.primaryFunction}
- Target Audience: ${platformDB.targetAudience}
- Key Differentiator: ${platformDB.keyDifferentiator}

**Recommended Tech Stack:**
- Frontend: ${platformDB.techStack.frontend.join(', ')}
- Backend: ${platformDB.techStack.backend.join(', ')}
- Database: ${platformDB.techStack.database.join(', ')}
- Deployment: ${platformDB.techStack.deployment.join(', ')}

**Platform-Specific Integrations:**
- Authentication: ${platformDB.integrations.auth.join(', ')}
- Payments: ${platformDB.integrations.payments.join(', ')}
- AI Services: ${platformDB.integrations.ai.join(', ')}
- Databases: ${platformDB.integrations.databases.join(', ')}

**Best Use Cases:**
${platformDB.bestFor.map(use => `- ${use}`).join('\n')}

**Platform Limitations:**
${platformDB.limitations.map(limit => `- ${limit}`).join('\n')}

**IMPORTANT:** Tailor ALL technical recommendations to ${platformDB.name}'s capabilities and ecosystem. Use the platform's preferred tech stack, integrations, and deployment methods.
` : '';

  const basePrompt = `You are the "NoCodeLos Blueprint Engine" - an expert AI system architect that generates comprehensive, production-ready technical blueprints. You must create a complete "Unified Project Blueprint & Requirements Document" that transforms user ideas into detailed implementation specifications.

**CRITICAL INSTRUCTIONS:**

1. **Analyze & Extract**: Parse the user's request to identify:
   - Application type (e-commerce, SaaS, CRM, etc.)
   - Core features and functionality requirements
   - Technical stack preferences (React, Node.js, PostgreSQL, etc.)
   - Business requirements and target audience
   - Scale and performance requirements

2. **Generate Clean Project Names**: Create a concise, professional project name from the user's idea. Avoid using the full requirement text as the project name. Examples:
   - "E-commerce platform" → "CommerceHub"
   - "Task management app" → "TaskFlow"
   - "Social media platform" → "SocialConnect"

3. **Create Implementation-Ready Architecture**: 
   - Define proper file structures with realistic component names
   - Specify exact technology stacks and integration patterns
   - Include complete database schemas with relationships
   - Detail API endpoints with proper REST conventions
   - Provide security, caching, and deployment strategies

4. **Full-Stack Implementation Details**: Include:
   - Frontend component architecture with state management
   - Backend API design with middleware and authentication
   - Database design with proper normalization and indexing
   - Third-party service integrations (Stripe, email, storage)
   - Performance optimization and caching strategies
   - Security measures and error handling
   - Testing frameworks and deployment pipelines

5. **Platform-Specific Optimization**: Adapt all recommendations for the target platform's capabilities and constraints.

6. **Maximum Detail Within 8192 Tokens**: Provide comprehensive technical specifications while staying within token limits.

**OUTPUT REQUIREMENTS:**
- Single, complete Markdown document
- All sections fully populated with specific, actionable content
- No placeholder text or generic examples
- Production-ready technical specifications
- Realistic timelines and implementation phases

Begin generating the complete blueprint immediately.`;

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

  return platformContext + basePrompt + platformSpecific[platform];
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
  // Generate clean project name from prompt
  const getCleanProjectName = (prompt: string): string => {
    const words = prompt.toLowerCase().split(' ');
    if (words.includes('e-commerce') || words.includes('ecommerce') || words.includes('shop') || words.includes('store')) {
      return 'CommerceHub';
    }
    if (words.includes('task') || words.includes('todo') || words.includes('project')) {
      return 'TaskFlow';
    }
    if (words.includes('social') || words.includes('community')) {
      return 'SocialConnect';
    }
    if (words.includes('blog') || words.includes('content')) {
      return 'ContentHub';
    }
    if (words.includes('fitness') || words.includes('health')) {
      return 'FitnessTracker';
    }
    // Default fallback
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'App';
  };

  const appName = getCleanProjectName(prompt);
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Detect if this is an e-commerce request
  const isEcommerce = prompt.toLowerCase().includes('e-commerce') || 
                     prompt.toLowerCase().includes('ecommerce') || 
                     prompt.toLowerCase().includes('shop') || 
                     prompt.toLowerCase().includes('store') ||
                     prompt.toLowerCase().includes('marketplace') ||
                     prompt.toLowerCase().includes('payment') ||
                     prompt.toLowerCase().includes('product') ||
                     prompt.toLowerCase().includes('cart');

  const sections = [
    `# **Unified Project Blueprint & Requirements Document (PRD)**\n## From Vision to Production-Ready Code in a Single Document\n\n---\n\n`,
    `### **Project Metadata**\n- **Project Name:** \`${appName}\`\n- **Version:** \`1.0\`\n- **Status:** \`Approved\`\n- **Owner(s):** \`Development Team\`\n- **Last Updated:** \`${currentDate}\`\n\n---\n\n`,
    `## **1. The Product Vision (The "What & Why")**\n\n### **1.1. Executive Summary**\n*   **The Idea:** ${isEcommerce ? 'A comprehensive e-commerce platform that enables businesses to sell products online with advanced features like multi-vendor support, payment processing, and inventory management.' : `A modern ${prompt} application designed to streamline workflows and enhance user productivity.`}\n*   **The Goal:** ${isEcommerce ? 'Create a scalable, secure, and user-friendly e-commerce solution that supports small to medium businesses in building their online presence.' : 'Enable users to efficiently manage their tasks and collaborate effectively within a modern, intuitive platform.'}\n\n`,
    `### **1.2. Problem Statement**\n${isEcommerce ? 'Small to medium businesses struggle with complex, expensive e-commerce solutions that lack flexibility and modern features. Current platforms often have high transaction fees, limited customization, and poor integration capabilities.' : `Users struggle with fragmented tools and inefficient workflows when trying to ${prompt.toLowerCase()}. Current solutions lack integration and user-friendly interfaces, leading to decreased productivity and user frustration.`}\n\n`,
    `### **1.3. Target Audience & User Personas**\n- **Primary Audience:** ${isEcommerce ? 'Small to medium businesses wanting to sell products online' : 'Professionals and teams seeking efficient workflow management'}\n- **User Persona 1:**\n    - **Goal:** ${isEcommerce ? 'Launch and manage an online store with professional features' : 'Streamline daily tasks and improve team collaboration'}\n    - **Pain Point:** ${isEcommerce ? 'Complex setup processes and high platform fees' : 'Struggles with disconnected tools and complex interfaces'}\n\n`,
    `### **1.4. Core User Stories / Epics**\n${isEcommerce ? 
      '- **(Epic 1):** As a business owner, I want to easily add products with images, descriptions, and inventory tracking.\n- **(Epic 2):** As a customer, I want to browse products, add them to cart, and checkout securely with multiple payment options.\n- **(Epic 3):** As an admin, I want to manage orders, track inventory, and view sales analytics.\n- **(Epic 4):** As a vendor, I want to manage my own products and view my sales performance.\n' :
      '- **(Epic 1):** As a user, I want to create, manage, and track my tasks seamlessly across different devices and platforms.\n- **(Epic 2):** As a team member, I want to collaborate with others in real-time and share updates efficiently.\n'
    }\n`,
    `### **1.5. Success Metrics (KPIs)**\n${isEcommerce ? 
      '- **Adoption:** 100 active stores within the first 3 months\n- **Revenue:** $50k+ in transaction volume within 6 months\n- **Performance:** < 2s page load times and 99.9% uptime' :
      '- **Adoption:** 500 active users within the first 2 months of launch\n- **Engagement:** Average session time of 8+ minutes per user visit'
    }\n\n---\n\n`,
    `## **2. The Technical Blueprint (The "How")**\n\n### **2.1. Layer 1: Core Build Prompts & Tasks**\n*These are actionable, AI-ready prompts to kickstart development.*\n\n`,
    isEcommerce ? 
      `- **Product Catalog Component:** "Build a React TypeScript product catalog with search, filtering by category/price, pagination, and responsive grid layout using Tailwind CSS. Include product cards with images, ratings, and add-to-cart functionality."\n\n- **Shopping Cart System:** "Create a persistent shopping cart using Redux Toolkit with local storage sync, quantity updates, price calculations, and checkout flow integration."\n\n- **Payment Integration:** "Implement Stripe payment processing with React Stripe.js, including payment methods, checkout sessions, webhook handling for order confirmation, and error handling."\n\n- **Admin Dashboard:** "Build an admin panel with order management, product CRUD operations, inventory tracking, sales analytics charts using Chart.js, and user management."\n\n- **API Backend:** "Create Express.js API with TypeScript featuring product endpoints, cart management, order processing, Stripe integration, JWT authentication, and PostgreSQL database with Drizzle ORM."\n\n` :
      `- **UI Component:** "Build a React TypeScript component library with Tailwind CSS that includes a responsive dashboard layout, data tables with sorting/filtering, and form components with validation for ${prompt} management."\n\n- **API Endpoint:** "Create a RESTful Express.js API with TypeScript that handles CRUD operations for ${prompt.toLowerCase()}, includes authentication middleware, input validation with Zod, and proper error handling."\n\n- **Database Schema:** "Design a PostgreSQL schema using Drizzle ORM with tables for users, ${prompt.toLowerCase().replace(/\s+/g, '_')}, categories, and audit logs, including proper relationships and indexes."\n\n`,
    `### **2.2. Layer 2: Master Architecture**\n- **Technology Stack:**\n    - **Frontend:** React 18, TypeScript, Tailwind CSS, ${isEcommerce ? 'Redux Toolkit, React Query, React Hook Form' : 'React Query'}\n    - **Backend:** Node.js, Express.js, TypeScript${isEcommerce ? ', Stripe SDK' : ''}\n    - **Database:** PostgreSQL with Drizzle ORM${isEcommerce ? ', Redis for caching' : ''}\n    - **Authentication:** JWT with bcrypt${isEcommerce ? ' and refresh tokens' : ''}\n    ${isEcommerce ? '- **Payments:** Stripe for payment processing\n    - **File Storage:** AWS S3 or Cloudinary for product images\n    - **Email:** SendGrid for transactional emails\n' : ''}    - **Primary Hosting Platform:** ${platform.charAt(0).toUpperCase() + platform.slice(1)}\n\n`,
    isEcommerce ? 
      `- **System Architecture Diagram:**\n\`\`\`mermaid\ngraph TD\n    A[Customer Frontend] --> B[React E-commerce App]\n    C[Admin Dashboard] --> B\n    B --> D[Express API Gateway]\n    D --> E[Authentication Service]\n    D --> F[Product Service]\n    D --> G[Order Service]\n    D --> H[Payment Service - Stripe]\n    F --> I[PostgreSQL Database]\n    G --> I\n    E --> I\n    D --> J[Redis Cache]\n    D --> K[File Storage - S3]\n    D --> L[Email Service - SendGrid]\n\`\`\`\n\n` :
      `- **System Architecture Diagram:**\n\`\`\`mermaid\ngraph TD\n    A[User Interface] --> B[React Frontend]\n    B --> C[Express API Server]\n    C --> D[PostgreSQL Database]\n    C --> E[Authentication Service]\n    B --> F[Real-time Updates]\n    C --> G[File Storage]\n\`\`\`\n\n`,
    isEcommerce ?
      `- **Folder & Component Structure:**\n\`\`\`\n/client\n  /src\n    /components\n      /common\n        - Header.tsx\n        - Footer.tsx\n        - LoadingSpinner.tsx\n      /product\n        - ProductCard.tsx\n        - ProductDetail.tsx\n        - ProductFilters.tsx\n      /cart\n        - ShoppingCart.tsx\n        - CartItem.tsx\n        - CheckoutForm.tsx\n      /admin\n        - AdminDashboard.tsx\n        - ProductManager.tsx\n        - OrderManager.tsx\n    /pages\n      - HomePage.tsx\n      - ProductPage.tsx\n      - CartPage.tsx\n      - CheckoutPage.tsx\n      - AdminPage.tsx\n    /hooks\n      - useCart.ts\n      - useProducts.ts\n      - useAuth.ts\n    /store\n      - cartSlice.ts\n      - userSlice.ts\n      - store.ts\n    /types\n      - product.ts\n      - order.ts\n      - user.ts\n/server\n  /routes\n    - products.ts\n    - orders.ts\n    - auth.ts\n    - payments.ts\n  /models\n    - Product.ts\n    - Order.ts\n    - User.ts\n  /middleware\n    - auth.ts\n    - validation.ts\n  /services\n    - stripe.ts\n    - email.ts\n/shared\n  - schema.ts\n  - types.ts\n\`\`\`\n\n` :
      `- **Folder & Component Structure:**\n\`\`\`\n/client\n  /src\n    /components\n      - Header.tsx\n      - Sidebar.tsx\n      - ${appName}List.tsx\n      - ${appName}Form.tsx\n    /pages\n      - Dashboard.tsx\n      - ${appName}Page.tsx\n    /hooks\n      - use${appName}.ts\n    /types\n      - ${appName.toLowerCase()}.ts\n/server\n  /routes\n    - ${appName.toLowerCase()}.ts\n    - auth.ts\n  /models\n    - ${appName}.ts\n  /middleware\n    - auth.ts\n/shared\n  - schema.ts\n  - types.ts\n\`\`\`\n\n`,
    isEcommerce ?
      `- **Data Models & Schema:**\n\`\`\`typescript\ninterface Product {\n  id: string;\n  name: string;\n  description: string;\n  price: number;\n  images: string[];\n  categoryId: string;\n  inventory: number;\n  vendorId: string;\n  createdAt: Date;\n  updatedAt: Date;\n}\n\ninterface Order {\n  id: string;\n  userId: string;\n  items: OrderItem[];\n  totalAmount: number;\n  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';\n  shippingAddress: Address;\n  paymentId: string;\n  createdAt: Date;\n}\n\ninterface User {\n  id: string;\n  email: string;\n  name: string;\n  role: 'customer' | 'vendor' | 'admin';\n  addresses: Address[];\n  createdAt: Date;\n}\n\ninterface CartItem {\n  productId: string;\n  quantity: number;\n  price: number;\n}\n\`\`\`\n\n` :
      `- **Data Models & Schema:**\n\`\`\`typescript\ninterface ${appName} {\n  id: string;\n  title: string;\n  description: string;\n  status: 'active' | 'inactive' | 'completed';\n  userId: string;\n  createdAt: Date;\n  updatedAt: Date;\n}\n\ninterface User {\n  id: string;\n  email: string;\n  name: string;\n  role: 'admin' | 'user';\n  createdAt: Date;\n}\n\`\`\`\n\n`,
    isEcommerce ?
      `- **API Endpoints (Contract):**\n    - \`GET /api/products\` - Retrieve products with filtering and pagination\n    - \`POST /api/products\` - Create new product (admin/vendor only)\n    - \`PUT /api/products/:id\` - Update product details\n    - \`DELETE /api/products/:id\` - Delete product\n    - \`POST /api/cart/add\` - Add item to cart\n    - \`GET /api/cart\` - Get user's cart items\n    - \`POST /api/orders\` - Create new order\n    - \`GET /api/orders\` - Get user's order history\n    - \`POST /api/payments/stripe-session\` - Create Stripe checkout session\n    - \`POST /api/webhooks/stripe\` - Handle Stripe webhooks\n\n` :
      `- **API Endpoints (Contract):**\n    - \`POST /api/${appName.toLowerCase()}\` - Creates a new ${prompt.toLowerCase()}\n    - \`GET /api/${appName.toLowerCase()}\` - Retrieves all ${prompt.toLowerCase()}\n    - \`PUT /api/${appName.toLowerCase()}/:id\` - Updates a specific ${prompt.toLowerCase()}\n    - \`DELETE /api/${appName.toLowerCase()}/:id\` - Deletes a ${prompt.toLowerCase()}\n\n`,
    `### **2.3. Layer 3: Refactor & Optimization Engine**\n- **Component Splitting:** ${isEcommerce ? 'Separate product listing logic into reusable components, implement lazy loading for product images, and create shared cart utilities across components.' : 'Separate data fetching logic into custom hooks, split large components into smaller, reusable pieces, and implement proper component composition patterns.'}\n\n- **Performance Bottlenecks:** ${isEcommerce ? 'Implement product image optimization with lazy loading, add Redis caching for product queries, implement infinite scroll for large product catalogs, and optimize Stripe payment forms.' : 'Implement virtual scrolling for large lists, add pagination for data tables, and use React.memo for expensive component renders.'}\n\n`,
    `### **2.4. Layer 4: Error Recovery & Resilience**\n- **Error Patterns:** ${isEcommerce ? 'Handle payment failures with retry logic, implement inventory conflict resolution, manage order state consistency, and provide graceful cart recovery.' : 'Handle network failures with exponential backoff retry logic, implement proper form validation with user-friendly error messages.'}\n\n- **Debugging Strategies:** ${isEcommerce ? 'Implement comprehensive order tracking logs, Stripe webhook monitoring, inventory audit trails, and customer support tools.' : 'Use React Developer Tools for component debugging, implement comprehensive logging with structured error tracking.'}\n\n`,
    `### **2.5. Layer 5: Platform & Deployment Strategy**\n- **Target Platform(s):** ${platform.charAt(0).toUpperCase() + platform.slice(1)} for development and initial deployment\n- **Deployment Workflow:** ${isEcommerce ? 'Git push → automated testing → Stripe test mode validation → production deployment with blue-green strategy' : 'Git push → automatic build → deploy to production with health checks'}\n- **Environment Variables:** ${isEcommerce ? '`DATABASE_URL`, `REDIS_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `JWT_SECRET`, `AWS_S3_BUCKET`, `SENDGRID_API_KEY`' : '`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`'}\n\n---\n\n`,
    `## **3. Quality & Execution Framework**\n\n### **3.1. Development Standards**\n□ **Code Style:** Prettier + ESLint with TypeScript strict mode\n□ **Testing:** ${isEcommerce ? 'Vitest for unit tests, Playwright for E2E testing, Stripe test mode for payment flows, aim for 85%+ coverage' : 'Vitest for unit tests, React Testing Library for component tests, aim for 80%+ coverage'}\n□ **Version Control:** All work on feature branches, merged via Pull Requests\n\n`,
    `### **3.2. Performance Benchmarks**\n□ **First Contentful Paint (FCP):** \`< 1.8s\`\n□ **Largest Contentful Paint (LCP):** \`< 2.5s\`\n□ **API Response Time (p95):** \`< 200ms\`\n${isEcommerce ? '□ **Payment Processing:** < 3s checkout completion\n□ **Search Performance:** < 500ms for product queries' : ''}\n\n`,
    `### **3.3. User Experience & Accessibility (UX/UI)**\n□ **Responsive Design:** Mobile-first approach${isEcommerce ? ' with touch-optimized cart and checkout' : ''}\n□ **Accessibility:** WCAG 2.1 AA compliant\n□ **UI States:** Clear loading, error, and empty states implemented${isEcommerce ? '\n□ **Payment UX:** Secure, intuitive checkout flow with progress indicators' : ''}\n\n---\n\n`,
    `## **4. Project Management & Logistics**\n\n### **4.1. Implementation Phases & Timeline**\n${isEcommerce ? 
      '- **Phase 1: Core Backend (2 Days):** Database schema, authentication, product/user APIs\n- **Phase 2: Product Catalog (2 Days):** Frontend product listing, search, filtering\n- **Phase 3: Cart & Checkout (2 Days):** Shopping cart, Stripe integration, order processing\n- **Phase 4: Admin Panel (1 Day):** Product management, order dashboard\n- **Phase 5: Testing & Deployment (1 Day):** E2E testing, production deployment' :
      '- **Phase 1: Backend Setup (1 Day):** Database schema, API endpoints, authentication\n- **Phase 2: Frontend Development (2 Days):** Core components, state management, UI integration\n- **Phase 3: Integration & Deployment (1 Day):** E2E testing, deployment setup, go-live'
    }\n\n`,
    `### **4.2. Future Scope & Version 2.0 Ideas**\n${isEcommerce ?
      '- Multi-language support and international shipping\n- Advanced analytics dashboard with sales forecasting\n- Mobile app for iOS and Android\n- AI-powered product recommendations\n- Advanced inventory management with automatic reordering' :
      '- Advanced analytics and reporting dashboard\n- Mobile application for iOS and Android\n- Third-party integrations (Slack, email, calendar)'
    }\n\n---\n\n`,
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
