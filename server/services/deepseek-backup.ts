import { platformEnum } from "@shared/schema";
import { getPlatformDatabase } from "@shared/platform-databases";
import { getTechnologyDatabase, searchTechnologies } from "@shared/technology-databases";
import { buildSystemPrompt } from "./system-prompt";
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
    // No API key provided - stop generation
    yield "\n\n> **⚠️ API Key Required**: Please add your DeepSeek API key in Settings to generate blueprints.\n\n";
    return;
  }

  const apiKey = userApiKey;

  const request: DeepSeekRequest = {
    model: "deepseek-chat",
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
            // Skip invalid JSON
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

export async function generateBlueprint(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): Promise<AsyncGenerator<string>> {
  return callDeepSeekAPI(prompt, platform, userApiKey);
}
- Backend: ${platformDB.techStack.backend.join(', ')}
- Database: ${platformDB.techStack.database.join(', ')}
- Deployment: ${platformDB.techStack.deployment.join(', ')}
${platformDB.techStack.runtime ? `- Runtime: ${platformDB.techStack.runtime}` : ''}

**REQUIRED Platform-Specific Integrations:**
- Authentication: ${platformDB.integrations.auth.join(', ')}
- Payments: ${platformDB.integrations.payments.join(', ')}
- AI Services: ${platformDB.integrations.ai.join(', ')}
- Databases: ${platformDB.integrations.databases.join(', ')}
- Deployment: ${platformDB.integrations.deployment.join(', ')}
- Other: ${platformDB.integrations.other.slice(0, 5).join(', ')}

**Optimal Use Cases for ${platformDB.name}:**
${platformDB.bestFor.map(use => `- ${use}`).join('\n')}

**Platform Limitations & Considerations:**
${platformDB.limitations.map(limit => `- ${limit}`).join('\n')}

**CRITICAL REQUIREMENTS FOR 9/10+ RATING:**
1. You MUST use ONLY ${platformDB.name}'s native technologies and integrations
2. ALL code examples must be compatible with ${platformDB.name}'s environment
3. Pricing considerations must align with ${platformDB.pricingModel}
4. Architecture must leverage ${platformDB.name}'s core features: ${platformDB.coreFeatures.slice(0, 3).join(', ')}
5. Do NOT mention competing platforms - focus exclusively on ${platformDB.name}
6. Tailor complexity and language to match ${platformDB.targetAudience}
7. Emphasize ${platformDB.keyDifferentiator} throughout the blueprint
8. Include platform-specific best practices and optimization strategies
` : '';
  // Platform-specific content adaptation strategies
  const getContentStrategy = (platform: string, targetAudience: string) => {
    const strategies = {
      'Non-technical Founders, Startups, Teams': {
        language: 'Simple, business-focused language with minimal technical jargon',
        structure: 'Executive summary first, implementation details second',
        examples: 'Business use cases and ROI-focused examples',
        complexity: 'High-level architecture with implementation roadmap'
      },
      'Professional Developers, Enterprise Teams': {
        language: 'Technical precision with architectural depth',
        structure: 'Technical architecture first, implementation details throughout',
        examples: 'Code examples, technical patterns, and best practices',
        complexity: 'Deep technical implementation with security and scalability focus'
      },
      'Hobbyists, Students, Professional Teams, Enterprises': {
        language: 'Progressive complexity - accessible to beginners, comprehensive for experts',
        structure: 'Layered approach with beginner and advanced sections',
        examples: 'Educational examples with progressive difficulty',
        complexity: 'Modular complexity that scales with expertise'
      },
      'Front-end Developers, Designers': {
        language: 'UI/UX focused with component-based thinking',
        structure: 'Component hierarchy and design system focus',
        examples: 'Visual examples, component libraries, design patterns',
        complexity: 'Frontend-heavy with backend integration points'
      },
      'Entrepreneurs, Startups, Non-technical users': {
        language: 'Business and outcome focused, minimal technical detail',
        structure: 'Business case, user journey, then simplified implementation',
        examples: 'Market examples, user scenarios, business outcomes',
        complexity: 'High-level overview with vendor/service recommendations'
      }
    };
    
    return strategies[targetAudience] || strategies['Professional Developers, Enterprise Teams'];
  };

  const contentStrategy = getContentStrategy(platform, platformDB?.targetAudience || 'Professional Developers, Enterprise Teams');

  const basePrompt = `You are an expert technical architect generating production-ready implementation blueprints. Your output must contain ACTUAL WORKING CODE with complete business logic, not examples or tutorials.

**CORE REQUIREMENTS:**
1. Generate SPECIFIC implementations for the user's exact request
2. Every function must have complete business logic with real algorithms
3. Include actual database operations, calculations, and conditional logic
4. Write production-ready code that can be immediately deployed
5. NO placeholder functions, generic examples, or incomplete implementations

**OUTPUT FORMAT:** Comprehensive technical blueprint with:`

- **Platform Accuracy (9/10):** Perfect alignment with target platform capabilities
- **Technical Accuracy (9/10):** Cutting-edge, best-practice architecture  
- **Completeness (9/10):** Every detail covered, zero gaps
- **Actionability (9/10):** Ready-to-execute code and instructions
- **Scalability (9/10):** Enterprise-grade, production-ready design
- **Security (9/10):** Industry-standard security practices
- **Performance (9/10):** Optimized for speed and efficiency

**CONTENT ADAPTATION STRATEGY:**
- **Language Style:** ${contentStrategy.language}
- **Structure Approach:** ${contentStrategy.structure}
- **Example Types:** ${contentStrategy.examples}
- **Complexity Level:** ${contentStrategy.complexity}

**PLATFORM-SPECIFIC 9/10 OPTIMIZATION REQUIREMENTS:**
1. **Audience Alignment:** Perfect match with ${platformDB?.targetAudience || 'target audience'} expectations and technical level
2. **Platform Feature Integration:** Comprehensive utilization of ${platformDB?.name || 'platform'} core capabilities and differentiators
3. **Workflow Optimization:** Streamlined development process aligned with platform-specific best practices
4. **Cost Efficiency:** Optimized resource usage aligned with ${platformDB?.pricingModel || 'platform pricing model'}
5. **Scalability Planning:** Architecture designed for ${platformDB?.name || 'platform'} scaling capabilities and limitations
6. **Security Implementation:** Platform-native security features and compliance requirements
7. **Performance Excellence:** Optimized for ${platformDB?.name || 'platform'} infrastructure and performance characteristics
8. **Integration Ecosystem:** Leveraging ${platformDB?.name || 'platform'} native integrations and third-party connectivity
9. **Development Velocity:** Maximizing ${platformDB?.name || 'platform'} productivity features and collaborative capabilities
10. **Production Readiness:** Deployment and maintenance optimized for ${platformDB?.name || 'platform'} hosting and scaling options

**PLATFORM VALIDATION REQUIREMENTS:**
- Every technology choice must be verified against the target platform's capabilities
- All integrations must use platform-native solutions first
- Code examples must be tested and compatible with the platform
- Deployment strategies must leverage platform-specific features
- Validate that security approaches work within platform constraints
- Confirm pricing implications align with platform billing model

**CRITICAL INSTRUCTIONS:**

1. **PLATFORM VALIDATION FIRST:** Before any technical recommendation:
   - Verify the technology is supported by the target platform
   - Check if integrations are available and properly documented
   - Ensure deployment strategy aligns with platform capabilities
   - Validate that security approaches work within platform constraints
   - Confirm pricing implications align with platform billing model

2. **DEEP ANALYSIS:** Dissect the user's request to understand:
   - Core application type and business domain
   - Target audience demographics and technical sophistication
   - Scalability requirements (100 users vs 1M+ users)
   - Business model implications (B2B, B2C, marketplace, etc.)
   - Compliance requirements (GDPR, SOC2, HIPAA if applicable)
   - Integration ecosystem needs
   - Platform-specific constraints and opportunities

2. **ENTERPRISE-GRADE ARCHITECTURE:**
   - Design for 10x current requirements
   - Include microservices patterns where appropriate
   - Plan for horizontal scaling, load balancing, and CDN
   - Implement proper separation of concerns
   - Design database schemas with proper indexing, relationships, and constraints
   - Include caching strategies (Redis, memcache)
   - Plan for real-time features (WebSockets, Server-Sent Events)

3. **SECURITY-FIRST APPROACH:**
   - Authentication: Multi-factor, OAuth2, JWT with refresh tokens
   - Authorization: Role-based access control (RBAC)
   - Data protection: Encryption at rest and in transit
   - Input validation and sanitization
   - Rate limiting and DDoS protection
   - Security headers (CORS, CSP, HSTS)
   - API security (API keys, throttling, monitoring)

4. **PERFORMANCE OPTIMIZATION:**
   - Database query optimization
   - CDN implementation for static assets
   - Image optimization and lazy loading
   - Code splitting and bundle optimization
   - Server-side rendering (SSR) or static generation where appropriate
   - Monitoring and observability (logging, metrics, tracing)

5. **ACTIONABLE BUILD PROMPTS (Layer 1):**
   Generate 8-12 specific, executable prompts covering:
   - Database schema with migrations
   - Authentication and authorization system
   - Core business logic components
   - API endpoints with proper error handling
   - Frontend components with state management
   - Real-time features implementation
   - Testing strategies (unit, integration, e2e)
   - Deployment and CI/CD pipeline

6. **COMPREHENSIVE ARCHITECTURE (Layer 2):**
   - Technology stack with specific versions
   - Detailed system architecture with Mermaid diagrams
   - Complete folder structure (20+ directories/files)
   - Database schema with relationships, indexes, constraints
   - API specification with request/response examples
   - Component hierarchy and state management
   - Third-party integrations and APIs
   - Environment configuration and secrets management

7. **MODERN TECH STACK DEFAULTS:**
   - Frontend: React 18+ with TypeScript, Zustand/Redux Toolkit, React Query
   - Styling: Tailwind CSS with shadcn/ui components
   - Backend: Node.js with Express/Fastify, TypeScript, Zod validation
   - Database: PostgreSQL with Prisma/Drizzle ORM
   - Authentication: NextAuth.js or custom JWT implementation
   - Real-time: Socket.io or native WebSockets
   - Testing: Vitest, React Testing Library, Playwright
   - Monitoring: Sentry for error tracking, analytics integration

8. **PRODUCTION READINESS:**
   - Docker containerization
   - CI/CD pipeline configuration
   - Environment-specific configurations
   - Health checks and monitoring
   - Backup and disaster recovery
   - Performance benchmarks and SLAs
   - Documentation and API specs

9. **QUALITY ASSURANCE:**
   - Code quality standards (ESLint, Prettier, SonarQube)
   - Testing coverage requirements (>85%)
   - Security scanning and vulnerability assessment
   - Performance testing and load testing
   - Accessibility compliance (WCAG 2.1 AA)
   - Cross-browser and mobile responsiveness

10. **SCALABILITY PLANNING:**
    - Horizontal scaling strategies
    - Database sharding considerations
    - Caching layers and strategies
    - CDN and edge computing
    - Microservices migration path
    - Auto-scaling and load balancing

**OUTPUT REQUIREMENTS:**
- Generate a complete, gap-free Markdown document with REAL IMPLEMENTATION CODE
- Include specific functional code with actual business logic (no tutorials or examples)
- Provide realistic timelines and resource estimates based on actual implementation complexity
- Include cost considerations and optimization strategies with real numbers and calculations
- Add troubleshooting guides with actual error scenarios and production solutions
- Every code block must be immediately deployable and solve real business problems

**PRODUCTION CODE REQUIREMENTS:**
- COMPLETE IMPLEMENTATIONS ONLY - no function signatures without bodies
- Every function must contain FULL implementation with real algorithms, loops, conditionals, and calculations
- Write COMPLETE component logic with actual state management, event handlers, and user interactions
- Include FULL API implementations with actual endpoint logic, validation, error handling, and database operations
- Provide COMPLETE algorithms for the app's core functionality with actual calculations and business rules
- All database operations must include FULL CRUD implementations with actual queries and validation
- Security implementations must be COMPLETE with actual authentication flows and authorization checks
- Performance optimizations must include ACTUAL optimization code and specific implementations
- NO function signatures without implementations - every function must have a complete body

**CRITICAL IMPLEMENTATION REQUIREMENTS:**
- NO FUNCTION SIGNATURES WITHOUT BODIES - write the complete function implementation
- NO "async function generateWorkoutPlan(user" - write the FULL function with complete logic
- Code must include ACTUAL calculations, algorithms, loops, conditionals, and business logic
- Include COMPLETE component implementations with actual JSX, hooks, and state management
- Write ACTUAL backend endpoints with full request/response handling and database operations
- NO "// TODO: implement logic" - write the actual implementation code
- Include REAL data processing, validation logic, error handling, and edge cases
- Every code block must be a COMPLETE, WORKING implementation that can be copy-pasted and run

**FORBIDDEN PATTERNS - DO NOT USE:**
- Function signatures without implementations
- Incomplete code blocks with placeholder comments
- Generic functions without full implementation
- Incomplete API endpoints without full request/response handling
- Database operations without actual query implementations

**REAL IMPLEMENTATION STANDARDS:**
- Write complete React components with actual state management and user interactions
- Include actual API endpoints with real request/response handling
- Provide specific database schemas with real field validation and relationships
- Implement actual business logic algorithms (calculations, filtering, sorting, etc.)
- Include COMPLETE authentication flows with full session management and security implementations
- Write COMPLETE deployment configurations with actual environment setups and full configurations
- NO tutorials, examples, or function signatures - only COMPLETE, WORKING implementation code
- EVERY function must have a COMPLETE body with actual logic, calculations, and business rules
- NO incomplete code blocks or placeholder implementations

**GENERATE NEW IMPLEMENTATIONS:** Create complete business logic specifically for the user's request. Do not copy any examples.

Begin generation immediately with COMPLETE, WORKING implementations tailored to the specific application request.`;
  const progressionMultiplier = Math.min(1 + (userHistory.length * 0.1), 2.0);
  const restDaysNeeded = calculateRestDays(userHistory);
  
  // Intelligent exercise selection algorithm
  const exercisePool = await db.exercises.find({
    difficulty: { $lte: currentLevel + 1 },
    targetMuscles: { $in: fitnessGoals },
    equipment: { $in: user.availableEquipment || ['bodyweight'] }
  });
  
  // Custom workout algorithm based on goals
  let workoutStructure;
  if (fitnessGoals.includes('weight_loss')) {
    workoutStructure = {
      cardioRatio: 0.4,
      strengthRatio: 0.4,
      flexibilityRatio: 0.2,
      intensityMultiplier: 1.2
    };
  } else if (fitnessGoals.includes('muscle_gain')) {
    workoutStructure = {
      cardioRatio: 0.2,
      strengthRatio: 0.6,
      flexibilityRatio: 0.2,
      intensityMultiplier: 1.4
    };
  } else {
    workoutStructure = {
      cardioRatio: 0.33,
      strengthRatio: 0.34,
      flexibilityRatio: 0.33,
      intensityMultiplier: 1.0
    };
  }
  
  // Generate exercise sequence with proper muscle group rotation
  const selectedExercises = [];
  const muscleGroupsUsed = new Set();
  
  for (let i = 0; i < Math.floor(availableTime / 5); i++) {
    const availableExercises = exercisePool.filter(ex => 
      !muscleGroupsUsed.has(ex.primaryMuscle) || muscleGroupsUsed.size >= 6
    );
    
    const exercise = selectOptimalExercise(availableExercises, workoutStructure, i);
    if (exercise) {
      selectedExercises.push({
        ...exercise,
        sets: calculateOptimalSets(exercise, user.fitnessLevel, progressionMultiplier),
        reps: calculateOptimalReps(exercise, user.strength, fitnessGoals),
        weight: calculateOptimalWeight(exercise, user.maxLifts, progressionMultiplier),
        restTime: calculateRestTime(exercise.intensity, workoutStructure.intensityMultiplier)
      });
      muscleGroupsUsed.add(exercise.primaryMuscle);
    }
  }
  
  // Calculate nutritional requirements
  const estimatedCaloriesBurn = selectedExercises.reduce((total, ex) => {
    const met = getMetabolicEquivalent(ex.type, ex.intensity);
    return total + (met * user.weight * (ex.sets * ex.duration / 60));
  }, 0);
  
  // Generate recovery recommendations
  const recoveryPlan = {
    proteinNeeds: Math.ceil(user.weight * 1.6), // grams
    hydrationNeeds: Math.ceil(estimatedCaloriesBurn / 25), // ml
    sleepRecommendation: 7 + Math.floor(estimatedCaloriesBurn / 200),
    nextWorkoutDelay: calculateOptimalRestPeriod(selectedExercises, user.recoveryRate)
  };
  
  const workoutPlan = {
    id: generateUniqueId(),
    userId,
    exercises: selectedExercises,
    totalDuration: availableTime,
    estimatedCaloriesBurn,
    difficultyScore: calculateDifficultyScore(selectedExercises),
    recoveryPlan,
    progressionNotes: generateProgressionAdvice(user, selectedExercises),
    createdAt: new Date(),
    completedAt: null
  };
  
  // Save to database and update user's workout history
  await db.workouts.create(workoutPlan);
  await db.users.updateOne(
    { _id: userId },
    { 
      $inc: { totalWorkouts: 1 },
      $set: { lastWorkoutGenerated: new Date() }
    }
  );
  
  return workoutPlan;
}

// Helper functions with complete implementations
function calculateOptimalSets(exercise, fitnessLevel, progressionMultiplier) {
  const baseSets = exercise.recommendedSets || 3;
  const levelAdjustment = Math.floor(fitnessLevel / 2);
  return Math.min(Math.max(baseSets + levelAdjustment * progressionMultiplier, 1), 6);
}

function calculateOptimalReps(exercise, userStrength, goals) {
  let baseReps = exercise.recommendedReps || 12;
  
  if (goals.includes('strength')) {
    baseReps = Math.max(6, baseReps - 4); // Lower reps, higher weight
  } else if (goals.includes('endurance')) {
    baseReps = Math.min(20, baseReps + 6); // Higher reps, lower weight
  }
  
  return Math.floor(baseReps * (userStrength / 100));
}

function selectOptimalExercise(exercises, structure, sequenceIndex) {
  // Prioritize compound movements early in workout
  if (sequenceIndex < 3) {
    const compoundExercises = exercises.filter(ex => ex.movementType === 'compound');
    if (compoundExercises.length > 0) {
      return compoundExercises[Math.floor(Math.random() * compoundExercises.length)];
    }
  }
  
  // Balance cardio/strength based on structure
  const shouldBeCardio = Math.random() < structure.cardioRatio;
  const filteredExercises = exercises.filter(ex => 
    shouldBeCardio ? ex.type === 'cardio' : ex.type === 'strength'
  );
  
  return filteredExercises.length > 0 
    ? filteredExercises[Math.floor(Math.random() * filteredExercises.length)]
    : exercises[Math.floor(Math.random() * exercises.length)];
}
\`\`\`

Generate blueprints with COMPLETE implementations like the example above. Every function must have full business logic with calculations, algorithms, database operations, and real implementation code.



  const platformSpecific = {
    replit: `

**REPLIT 9/10 OPTIMIZATION STRATEGY:**
- **Zero-Setup Excellence:** Leverage instant development environment with Nix package management
- **Educational Progression:** Design for learning curve from hobbyist to professional development
- **Community-Driven Features:** Include sharing, forking, collaboration, and discovery mechanisms
- **Multi-Language Mastery:** Utilize Replit's polyglot environment for diverse tech stacks
- **Integrated Database Solutions:** ReplDB for rapid prototyping, PostgreSQL for production scale
- **Mobile-First Development:** Expo integration for cross-platform React Native applications
- **Deployment Simplicity:** Autoscale for variable traffic, Reserved VM for consistent performance
- **Real-time Collaboration:** Multiplayer coding with live cursors, shared terminals, and voice/video
- **Version Control Integration:** Git workflows with visual diff tools and merge conflict resolution
- **Performance Optimization:** Cloud infrastructure optimization with proper resource allocation`,

    cursor: `

**CURSOR 9/10 OPTIMIZATION STRATEGY:**
- **Professional Developer Focus:** Advanced codebase intelligence with deep architectural understanding
- **VS Code Ecosystem Mastery:** Full compatibility with extensions, themes, and professional workflows
- **Enterprise-Grade Security:** SOC 2 compliance with granular permission controls and audit trails
- **Advanced AI Capabilities:** Multi-file refactoring, intelligent code suggestions, and context-aware development
- **Custom AI Configuration:** .cursorrules for project-specific AI behavior and development patterns
- **Performance Excellence:** Optimized response times with hybrid local/cloud model architecture
- **Team Collaboration:** Shared AI contexts, collaborative coding sessions, and knowledge sharing
- **Code Quality Integration:** Built-in linting, testing frameworks, and security scanning workflows
- **Model Flexibility:** Support for latest frontier models (GPT-4o, Claude 3.7, Gemini 2.5 Pro)
- **Professional Workflow Integration:** Seamless integration with existing development tools and CI/CD`,

    lovable: `

**LOVABLE 9/10 OPTIMIZATION STRATEGY:**
- **Non-Technical Founder Focus:** Simple language, business outcomes, and executable roadmaps
- **Vibe Coding Excellence:** Conversational development with natural language architecture decisions
- **Supabase Native Integration:** Deep PostgreSQL, authentication, and real-time features integration
- **Security-First Production:** Built-in security scanning and production-readiness validation
- **Visual Development Workflow:** Click-to-modify UI with immediate visual feedback
- **Startup-Centric Features:** MVP-focused development with European startup ecosystem alignment
- **Credit Optimization:** Efficient credit usage with iterative development patterns
- **React/Tailwind Mastery:** Modern component-based architecture with utility-first styling
- **Multiplayer Collaboration:** Real-time team development with shared contexts
- **Rapid Market Validation:** Fast prototype-to-market workflows with built-in deployment`,

    windsurf: `

**WINDSURF 9/10 OPTIMIZATION STRATEGY:**
- **Enterprise-Grade Agentic Development:** Leverage Cascade agent for complex multi-file operations
- **Professional Developer Excellence:** Advanced IDE features with sophisticated debugging capabilities
- **Security-First Architecture:** FedRAMP and SOC 2 compliance with enterprise-grade permissions
- **Multi-Database Mastery:** Native integration with PostgreSQL, MongoDB, MySQL, and Cloudflare D1
- **MCP Protocol Integration:** External tool connectivity with Model Context Protocol standards
- **Plugin Ecosystem Compatibility:** Seamless integration with JetBrains and VS Code ecosystems
- **Complex Backend Development:** Sophisticated architecture patterns and enterprise integrations
- **Credit-Efficient Workflows:** Optimized prompt usage with intelligent context management
- **Professional Deployment:** Multi-platform deployment with Netlify, Vercel, and custom solutions
- **Advanced AI Capabilities:** Latest model support (OpenAI, Claude, Gemini, xAI) with intelligent routing`,

    bolt: `

**BOLT 9/10 OPTIMIZATION STRATEGY:**
- **Full-Stack Browser Excellence:** Complete development environment with WebContainer technology
- **Developer/PM/Designer Focus:** Cross-functional team collaboration with visual and technical tools
- **Real-time Execution Mastery:** Instant code execution, debugging, and live preview capabilities
- **JavaScript Ecosystem Depth:** Node.js specialization with modern framework integration
- **Conversational Development:** Iterative refinement through natural language interactions
- **Visual Development Tools:** Layout editing, design system integration, and component libraries
- **Educational Learning Curve:** Progressive complexity for skill development and prototyping
- **Open Source Flexibility:** Customizable core with community-driven enhancements
- **Token Optimization:** Efficient token usage with intelligent conversation management
- **Rapid MVP Development:** Fast prototype-to-production workflows with GitHub integration`,

    claude: `

**CLAUDE CODE 9/10 OPTIMIZATION STRATEGY:**
- **Terminal-Native Excellence:** Command-line first development with professional developer workflows
- **Security-by-Design:** Explicit user approval workflows with granular permission controls
- **Context Management Mastery:** CLAUDE.md project configuration with intelligent context loading
- **Enterprise Security Focus:** Audit trails, compliance features, and enterprise-grade permissions
- **CI/CD Pipeline Integration:** Headless mode support for automated development workflows
- **Advanced Codebase Intelligence:** Deep cross-file refactoring and architectural understanding
- **Custom Workflow Automation:** Slash commands and programmable development assistance
- **Cost-Conscious Development:** Optimized token usage with intelligent context management
- **Research and Development:** Support for complex enterprise scenarios and technical exploration
- **Model Context Protocol:** External tool integration with open standard connectivity
- **Enterprise Compliance:** Implement security auditing and compliance features`,

    gemini: `

**GEMINI CLI 9/10 OPTIMIZATION STRATEGY:**
- **Open Source Excellence:** Community-driven development with unlimited customization potential
- **Cost Leadership:** Unmatched free tier usage with Google's infrastructure backing (1M requests/month)
- **Terminal-Native Mastery:** Command-line first workflows for professional developers
- **Massive Context Window:** 1 million token context for comprehensive codebase understanding
- **Google Ecosystem Integration:** Native connectivity with Google Cloud, Workspace, and APIs
- **Latest Model Performance:** Cutting-edge Gemini 2.5 Pro capabilities with Flash optimization
- **Developer Tool Integration:** Seamless integration with existing development toolchains
- **Research and Analysis:** Advanced capabilities for documentation, analysis, and exploration
- **Cross-Platform Compatibility:** Universal support across development environments
- **API-First Development:** Headless automation and CI/CD pipeline integration
- **Live Data Integration:** Real-time web search and data retrieval capabilities
- **Educational Excellence:** Perfect for learning institutions and academic research projects`,

    base44: `

**BASE44 9/10 OPTIMIZATION STRATEGY:**
- **Business User Excellence:** Zero-code experience for non-technical entrepreneurs and founders
- **"Buttery Includes" Philosophy:** Comprehensive all-in-one solution with database, auth, hosting, payments
- **Wix Ecosystem Power:** Leverage $80M acquisition with enterprise-grade infrastructure and scalability
- **Natural Language Development:** Conversational app creation with AI-powered assistance (Gemini 2.5, Claude 4)
- **Business Outcome Focus:** ROI-driven features with market validation and business intelligence
- **Credit-Optimized Workflows:** Efficient message-based development with iterative refinement
- **Enterprise Ready Features:** SSO, SAML, role-based permissions, and SOC 2 compliance
- **Rapid Business Applications:** Fast business tool creation and internal application development
- **One-Click Everything:** Deployment, hosting, domain management, and scaling automation
- **Third-Party Business Integration:** Native connectivity with CRM, payment, and business tools
- **Collaborative Development:** Team collaboration through discuss feature and shared workspaces
- **Wix Service Integration:** Seamless connectivity with Wix Payments, Data, and Editor ecosystem`,

    v0: `

**V0 9/10 OPTIMIZATION STRATEGY:**
- **UI Component Mastery:** Premium React component generation with Tailwind CSS excellence
- **Vercel Ecosystem Integration:** Deep Next.js, hosting, and deployment platform connectivity
- **Design-to-Code Excellence:** Advanced image-to-component and Figma-to-React workflows
- **Frontend Developer Focus:** Modern component architecture with design system integration
- **Production-Ready Components:** Enterprise-grade components with accessibility and performance optimization
- **Credit-Efficient Generation:** Optimized component creation with intelligent iteration and refinement
- **Design System Creation:** Comprehensive component libraries and reusable design patterns
- **Designer-Developer Bridge:** Seamless design-to-development workflow optimization
- **Responsive Excellence:** Mobile-first, cross-device component creation with breakpoint optimization
- **React Ecosystem Leadership:** Latest React patterns, hooks, Server Components, and modern frontend practices
- **Three Design Variations:** Multiple design options for iterative selection and comparison
- **Component Library Integration:** Seamless integration with Material UI, Chakra UI, and custom design systems`,

    rork: `

**RORK 9/10 OPTIMIZATION STRATEGY:**
- **Mobile-First Excellence:** Cross-platform native app development with React Native mastery
- **Entrepreneur Focus:** Business-driven mobile solutions for startup and enterprise markets
- **Expo Ecosystem Integration:** Complete build, deployment, and distribution workflow optimization
- **Native Performance:** Platform-specific optimization for iOS and Android performance standards
- **App Store Success:** Compliance, optimization, and submission best practices integration
- **Mobile UX Leadership:** Native navigation patterns, gestures, and platform conventions mastery
- **Real-Time Development:** Live testing with TestFlight, device preview, and hot reloading capabilities
- **Backend Integration Excellence:** Supabase, Firebase, and headless CMS connectivity optimization
- **Mobile Security Focus:** Platform-specific security, encryption, and privacy compliance
- **Cross-Platform Consistency:** Unified user experience across iOS and Android platforms
- **Credit-Efficient Development:** Optimized message usage with intelligent mobile-specific prompts
- **Native Feature Integration:** Camera, GPS, push notifications, and device-specific capabilities`
  };

  return platformContext + basePrompt + platformSpecific[platform];
}

async function* callDeepSeekAPI(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  if (!userApiKey) {
    // No API key provided - stop generation
    yield "\n\n> **⚠️ API Key Required**: Please add your DeepSeek API key in Settings to generate blueprints.\n\n";
    return;
  }

  const apiKey = userApiKey;

  const request: DeepSeekRequest = {
    model: "deepseek-chat",
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
      const errorText = await response.text();
      console.error(`DeepSeek API error: ${response.status} - ${response.statusText}`);
      console.error("Error response:", errorText);
      
      // Parse error for user-friendly message
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        errorMessage = errorText || `HTTP ${response.status}`;
      }
      
      throw new Error(`${response.status}: ${errorMessage}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    let buffer = '';
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i].trim();
        if (part.startsWith('data:')) {
          const jsonStr = part.slice(5).trim();
          if (jsonStr === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.warn("JSON parse error:", e);
          }
        }
      }
      buffer = parts[parts.length - 1];
    }
  } catch (error) {
    console.error("DeepSeek API error:", error);
    
    // NO FALLBACK - Return error and stop
    yield "\n\n> **⚠️ API Error**: ";
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        yield "Invalid API key. Please check your DeepSeek API key in Settings.\n\n";
      } else if (error.message.includes("429")) {
        yield "Rate limit exceeded. Please try again in a few minutes.\n\n";
      } else if (error.message.includes("403")) {
        yield "Access forbidden. Check your API key permissions.\n\n";
      } else {
        yield `Error: ${error.message}.\n\n`;
      }
    } else {
      yield "Unknown error occurred.\n\n";
    }
    return;
  }
}

// simulateGeneration function removed - no fallbacks allowed

export async function* generateBlueprint(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  // Stream AI content directly without any post-processing or quality validation
  yield* callDeepSeekAPI(prompt, platform, userApiKey);
}
