import { platformEnum } from "@shared/schema";
import { getPlatformDatabase } from "@shared/platform-databases";
import { getTechnologyDatabase, searchTechnologies } from "@shared/technology-databases";
import { blueprintQuality } from "./blueprintQuality";
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

  const platformContext = platformDB ? `

## TARGET PLATFORM: ${platformDB.name} (MANDATORY PLATFORM FOCUS - 9/10 OPTIMIZATION)

**Platform Overview:**
- Vendor: ${platformDB.vendor}
- Primary Function: ${platformDB.primaryFunction}
- Target Audience: ${platformDB.targetAudience}
- Key Differentiator: ${platformDB.keyDifferentiator}
- Pricing Model: ${platformDB.pricingModel}

**REQUIRED Tech Stack for ${platformDB.name}:**
- Frontend: ${platformDB.techStack.frontend.join(', ')}
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

  const basePrompt = `You are the "NoCodeLos Blueprint Engine v4.0" - the world's most advanced AI system architect. Your expertise spans enterprise architecture, full-stack development, DevOps, security, performance optimization, and modern software engineering practices. You generate production-ready, enterprise-grade technical blueprints with REAL IMPLEMENTATION CODE.

**CRITICAL REQUIREMENT:** NO GENERIC PLACEHOLDER CODE. Write actual, specific business logic for the requested application. For fitness apps: write real workout algorithms, calorie calculations, exercise recommendations. For e-commerce: write actual cart logic, payment processing, inventory management. Every code block must be immediately usable production code.

**CORE MISSION:** Transform any application idea into a comprehensive, actionable, production-ready "Unified Project Blueprint & Requirements Document" that achieves 9/10+ ratings across ALL dimensions:

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

**EXAMPLES OF COMPLETE IMPLEMENTATION LOGIC:**
\`\`\`javascript
// AI Workout Generator with Complete Business Logic
async function generateWorkoutPlan(userId, fitnessGoals, currentLevel, availableTime) {
  // Fetch user data and preferences
  const user = await db.users.findById(userId);
  const userHistory = await db.workouts.find({ userId, completedAt: { $exists: true } });
  
  // Calculate user's progression and adaptation needs
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

Begin generation immediately with COMPLETE, WORKING implementations that include full function bodies, actual calculations, and real business logic.`;

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
    // No API key provided - use simulation
    yield "\n\n> **⚠️ Using Demo Mode**: No DeepSeek API key provided. Add your API key in Settings for real AI generation.\n\n";
    yield* simulateGeneration(prompt, platform);
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
    console.error("API Key provided:", !!apiKey);
    console.error("Request details:", JSON.stringify({
      url: DEEPSEEK_API_URL,
      model: "deepseek-chat",
      hasAuth: !!apiKey
    }));
    
    // Provide user-friendly error message
    yield "\n\n> **⚠️ API Error**: Failed to connect to DeepSeek API. ";
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        yield "Invalid API key. Please check your DeepSeek API key in Settings.\n\n";
      } else if (error.message.includes("429")) {
        yield "Rate limit exceeded. Please try again in a few minutes.\n\n";
      } else if (error.message.includes("403")) {
        yield "Access forbidden. Check your API key permissions.\n\n";
      } else {
        yield `Error: ${error.message}. Falling back to demo content.\n\n`;
      }
    } else {
      yield "Unknown error occurred. Falling back to demo content.\n\n";
    }
    
    // Fallback to simulated generation
    yield* simulateGeneration(prompt, platform);
  }
}

async function* simulateGeneration(prompt: string, platform: z.infer<typeof platformEnum>): AsyncGenerator<string> {
  const appName = prompt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/[^A-Za-z0-9]/g, '');
  const currentDate = new Date().toISOString().split('T')[0];
  const projectId = `NC-${appName.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const platformDB = getPlatformDatabase(platform);
  const platformName = platformDB?.name || platform.charAt(0).toUpperCase() + platform.slice(1);

  // Add initial delay for better visual effect
  await new Promise(resolve => setTimeout(resolve, 500));

  const sections = [
    `# **🎬 DEMO: ${appName} - Production Implementation Blueprint**\n## ${platformName}-Optimized Enterprise Architecture\n\n> **⚠️ This is demo content showing actual implementation examples.** Add your DeepSeek API key in Settings for AI-generated blueprints tailored to your specific requirements.\n\n**Project ID:** \`${projectId}\`  \n**Blueprint Engine:** NoCodeLos v4.0 Enhanced (Demo Mode)  \n**Generated:** ${currentDate}  \n**Target Platform:** ${platformName}  \n**Platform Focus:** ${platformDB?.primaryFunction || 'Full-stack development'}  \n**Complexity:** Production-Ready Enterprise\n\n---\n\n`,

    `## **🎯 1. Executive Summary & Vision**\n\n### **1.1. Project Overview**\n**Application Name:** ${appName}  \n**Core Concept:** ${prompt}  \n**Business Model:** Scalable SaaS platform with freemium/enterprise tiers  \n**Target Market Size:** $2.5B+ addressable market  \n\n`,

    `### **1.2. Value Propositions**\n- **Primary:** Streamlines complex workflows through intelligent automation\n- **Secondary:** Reduces operational costs by 40-60%\n- **Tertiary:** Provides actionable insights through advanced analytics\n- **Competitive Edge:** AI-powered optimization and real-time collaboration\n\n`,

    `### **1.3. Target Audience Analysis**\n**Primary Users (70%):** Enterprise teams, 25-45 years old, $50K+ income  \n**Secondary Users (20%):** SMB decision makers, growth-stage companies  \n**Tertiary Users (10%):** Individual professionals and consultants  \n\n**User Personas:**\n- **Sarah (Product Manager):** Needs workflow visibility, team coordination, metrics tracking\n- **Mike (Engineering Lead):** Requires technical integration, automation, performance monitoring\n- **Lisa (Executive):** Wants high-level insights, ROI tracking, strategic overview\n\n`,

    `### **1.4. Success Metrics & KPIs**\n**Adoption Metrics:**\n- 1,000 active users within 3 months\n- 85%+ user retention rate\n- 4.8+ app store rating\n\n**Business Metrics:**\n- $100K ARR within 12 months\n- 15% monthly growth rate\n- 65%+ freemium to paid conversion\n\n**Technical Metrics:**\n- 99.9% uptime SLA\n- <200ms API response time\n- Zero critical security incidents\n\n---\n\n`,

    `## **🏗️ 2. Technical Architecture Blueprint**\n\n### **2.1. Layer 1: Core Development Prompts**\n*Enterprise-grade, production-ready prompts for immediate development*\n\n`,

    `**🗄️ Database Architecture:**\n"Design a PostgreSQL database schema with Drizzle ORM featuring users, ${prompt.toLowerCase().replace(/\s+/g, '_')}, organizations, audit_logs, permissions, and settings tables. Include proper foreign keys, indexes on frequently queried columns, JSONB fields for flexible metadata, row-level security policies, and database triggers for audit trails."\n\n`,

    `**🔐 Authentication System:**\n"Build a comprehensive authentication system with JWT access/refresh tokens, multi-factor authentication (TOTP), OAuth2 providers (Google, GitHub, Microsoft), role-based access control (RBAC), session management, password policies, account verification, and secure password reset flows using Node.js and TypeScript."\n\n`,

    `**🌐 API Layer:**\n"Create a RESTful API with Express.js and TypeScript featuring comprehensive CRUD operations for ${prompt.toLowerCase()}, input validation with Zod schemas, rate limiting, request/response logging, error handling middleware, API versioning, OpenAPI documentation, and health check endpoints."\n\n`,

    `**⚛️ Frontend Components:**\n"Develop a React 18 TypeScript application with shadcn/ui components, featuring a responsive dashboard, data tables with sorting/filtering/pagination, form builders with validation, real-time updates via WebSockets, state management with Zustand, React Query for server state, and comprehensive error boundaries."\n\n`,

    `**🔄 Real-time Features:**\n"Implement WebSocket-based real-time collaboration with Socket.io, featuring live cursors, real-time document editing, presence indicators, conflict resolution, connection recovery, and scalable pub/sub architecture for multi-instance deployments."\n\n`,

    `**📊 Analytics & Monitoring:**\n"Build analytics infrastructure with event tracking, user behavior analysis, performance monitoring, error reporting with Sentry, custom dashboards, A/B testing framework, and automated alerting for critical metrics."\n\n`,

    `**🧪 Testing Strategy:**\n"Create comprehensive testing suite with Vitest for unit tests, React Testing Library for component tests, Playwright for E2E testing, API testing with Supertest, performance testing, security testing, and 90%+ code coverage requirements."\n\n`,

    `**🚀 DevOps Pipeline:**\n"Set up CI/CD pipeline with GitHub Actions, automated testing, security scanning, database migrations, Docker containerization, staging/production deployments, rollback strategies, and infrastructure as code."\n\n`,

    `### **2.2. Layer 2: System Architecture**\n\n**Technology Stack:**\n- **Frontend:** React 18, TypeScript 5.0+, Vite, Tailwind CSS, shadcn/ui\n- **State Management:** Zustand, React Query (TanStack Query)\n- **Backend:** Node.js 20+, Express.js, TypeScript, Zod validation\n- **Database:** PostgreSQL 15+, Drizzle ORM, Redis for caching\n- **Authentication:** JWT, bcrypt, TOTP, OAuth2\n- **Real-time:** Socket.io, Server-Sent Events\n- **Testing:** Vitest, React Testing Library, Playwright\n- **Monitoring:** Sentry, Winston logging, Prometheus metrics\n- **Deployment:** ${platform.charAt(0).toUpperCase() + platform.slice(1)}, Docker, nginx\n\n`,

    `**System Architecture Diagram:**\n\`\`\`mermaid\ngraph TB\n    subgraph "Client Layer"\n        A[React Frontend]\n        B[Mobile PWA]\n    end\n    \n    subgraph "API Gateway"\n        C[Load Balancer]\n        D[Rate Limiter]\n        E[Auth Middleware]\n    end\n    \n    subgraph "Application Layer"\n        F[Express API Server]\n        G[WebSocket Server]\n        H[Background Jobs]\n    end\n    \n    subgraph "Data Layer"\n        I[PostgreSQL]\n        J[Redis Cache]\n        K[File Storage]\n    end\n    \n    subgraph "External Services"\n        L[Email Service]\n        M[Analytics]\n        N[Monitoring]\n    end\n    \n    A --> C\n    B --> C\n    C --> D\n    D --> E\n    E --> F\n    E --> G\n    F --> I\n    F --> J\n    G --> J\n    F --> H\n    H --> I\n    F --> L\n    F --> M\n    F --> N\n\`\`\`\n\n`,

    `**Complete Project Structure:**\n\`\`\`\n${appName.toLowerCase()}/\n├── client/\n│   ├── src/\n│   │   ├── components/\n│   │   │   ├── ui/              # shadcn/ui components\n│   │   │   ├── layout/          # Layout components\n│   │   │   ├── forms/           # Form components\n│   │   │   ├── tables/          # Data table components\n│   │   │   └── charts/          # Analytics components\n│   │   ├── pages/\n│   │   │   ├── auth/            # Authentication pages\n│   │   │   ├── dashboard/       # Dashboard pages\n│   │   │   ├── settings/        # Settings pages\n│   │   │   └── ${prompt.toLowerCase().replace(/\s+/g, '-')}/    # Feature pages\n│   │   ├── hooks/\n│   │   │   ├── auth/            # Authentication hooks\n│   │   │   ├── api/             # API hooks\n│   │   │   └── utils/           # Utility hooks\n│   │   ├── stores/\n│   │   │   ├── auth.ts          # Auth store\n│   │   │   ├── ui.ts            # UI state store\n│   │   │   └── ${prompt.toLowerCase().replace(/\s+/g, '-')}.ts  # Feature store\n│   │   ├── lib/\n│   │   │   ├── api.ts           # API client\n│   │   │   ├── auth.ts          # Auth utilities\n│   │   │   ├── utils.ts         # General utilities\n│   │   │   └── validations.ts   # Form validations\n│   │   └── types/\n│   │       ├── api.ts           # API types\n│   │       ├── auth.ts          # Auth types\n│   │       └── ${prompt.toLowerCase().replace(/\s+/g, '-')}.ts  # Feature types\n├── server/\n│   ├── src/\n│   │   ├── controllers/\n│   │   │   ├── auth.ts          # Auth controller\n│   │   │   ├── users.ts         # Users controller\n│   │   │   └── ${prompt.toLowerCase().replace(/\s+/g, '-')}.ts  # Feature controller\n│   │   ├── middleware/\n│   │   │   ├── auth.ts          # Auth middleware\n│   │   │   ├── validation.ts    # Validation middleware\n│   │   │   ├── rateLimit.ts     # Rate limiting\n│   │   │   └── errorHandler.ts  # Error handling\n│   │   ├── routes/\n│   │   │   ├── auth.ts          # Auth routes\n│   │   │   ├── users.ts         # User routes\n│   │   │   └── ${prompt.toLowerCase().replace(/\s+/g, '-')}.ts  # Feature routes\n│   │   ├── services/\n│   │   │   ├── auth.ts          # Auth service\n│   │   │   ├── email.ts         # Email service\n│   │   │   ├── analytics.ts     # Analytics service\n│   │   │   └── ${prompt.toLowerCase().replace(/\s+/g, '-')}.ts  # Feature service\n│   │   ├── db/\n│   │   │   ├── schema/          # Database schemas\n│   │   │   ├── migrations/      # Database migrations\n│   │   │   ├── seeds/           # Database seeds\n│   │   │   └── index.ts         # Database connection\n│   │   ├── utils/\n│   │   │   ├── logger.ts        # Logging utility\n│   │   │   ├── crypto.ts        # Crypto utilities\n│   │   │   └── helpers.ts       # Helper functions\n│   │   └── types/\n│   │       ├── express.ts       # Express types\n│   │       └── database.ts      # Database types\n├── shared/\n│   ├── types/                   # Shared TypeScript types\n│   ├── validations/             # Shared Zod schemas\n│   └── constants/               # Shared constants\n├── tests/\n│   ├── unit/                    # Unit tests\n│   ├── integration/             # Integration tests\n│   ├── e2e/                     # E2E tests\n│   └── fixtures/                # Test fixtures\n├── docs/\n│   ├── api/                     # API documentation\n│   ├── deployment/              # Deployment guides\n│   └── development/             # Development guides\n├── .github/\n│   └── workflows/               # GitHub Actions\n├── docker/\n│   ├── Dockerfile.client        # Client Dockerfile\n│   ├── Dockerfile.server        # Server Dockerfile\n│   └── docker-compose.yml       # Docker Compose\n└── infrastructure/\n    ├── terraform/               # Infrastructure as Code\n    └── kubernetes/              # Kubernetes manifests\n\`\`\`\n\n`,

    `**Database Schema Design:**\n\`\`\`sql\n-- Users table with comprehensive fields\nCREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  password_hash VARCHAR(255),\n  first_name VARCHAR(100) NOT NULL,\n  last_name VARCHAR(100) NOT NULL,\n  avatar_url TEXT,\n  role user_role DEFAULT 'user',\n  email_verified BOOLEAN DEFAULT false,\n  two_factor_enabled BOOLEAN DEFAULT false,\n  two_factor_secret VARCHAR(32),\n  last_login_at TIMESTAMP,\n  last_seen_at TIMESTAMP,\n  created_at TIMESTAMP DEFAULT NOW(),\n  updated_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Organizations for multi-tenancy\nCREATE TABLE organizations (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name VARCHAR(255) NOT NULL,\n  slug VARCHAR(100) UNIQUE NOT NULL,\n  domain VARCHAR(255),\n  settings JSONB DEFAULT '{}',\n  plan organization_plan DEFAULT 'free',\n  created_at TIMESTAMP DEFAULT NOW(),\n  updated_at TIMESTAMP DEFAULT NOW()\n);\n\n-- User organization memberships\nCREATE TABLE user_organizations (\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,\n  role organization_role DEFAULT 'member',\n  joined_at TIMESTAMP DEFAULT NOW(),\n  PRIMARY KEY (user_id, organization_id)\n);\n\n-- Main feature table\nCREATE TABLE ${prompt.toLowerCase().replace(/\s+/g, '_')} (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  title VARCHAR(255) NOT NULL,\n  description TEXT,\n  status ${prompt.toLowerCase().replace(/\s+/g, '_')}_status DEFAULT 'active',\n  priority priority_level DEFAULT 'medium',\n  metadata JSONB DEFAULT '{}',\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,\n  created_at TIMESTAMP DEFAULT NOW(),\n  updated_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Audit logs for compliance\nCREATE TABLE audit_logs (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id),\n  organization_id UUID REFERENCES organizations(id),\n  action VARCHAR(100) NOT NULL,\n  resource_type VARCHAR(100) NOT NULL,\n  resource_id UUID,\n  old_values JSONB,\n  new_values JSONB,\n  ip_address INET,\n  user_agent TEXT,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Indexes for performance\nCREATE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_users_organization ON user_organizations(organization_id);\nCREATE INDEX idx_${prompt.toLowerCase().replace(/\s+/g, '_')}_user ON ${prompt.toLowerCase().replace(/\s+/g, '_')}(user_id);\nCREATE INDEX idx_${prompt.toLowerCase().replace(/\s+/g, '_')}_status ON ${prompt.toLowerCase().replace(/\s+/g, '_')}(status);\nCREATE INDEX idx_audit_logs_user ON audit_logs(user_id);\nCREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);\n\`\`\`\n\n`,

    `**API Endpoints Specification:**\n\n\`\`\`\nPOST   /api/auth/register          # User registration\nPOST   /api/auth/login             # User login\nPOST   /api/auth/logout            # User logout\nPOST   /api/auth/refresh           # Refresh token\nPOST   /api/auth/forgot-password   # Password reset request\nPOST   /api/auth/reset-password    # Password reset confirmation\nPOST   /api/auth/verify-email      # Email verification\nPOST   /api/auth/enable-2fa        # Enable 2FA\nPOST   /api/auth/verify-2fa        # Verify 2FA token\n\`\`\`\n\n**User Management:**\n\`\`\`\nGET    /api/users/profile          # Get current user profile\nPUT    /api/users/profile          # Update user profile\nPOST   /api/users/avatar           # Upload avatar\nGET    /api/users/organizations    # Get user organizations\nPOST   /api/users/organizations    # Create organization\n\`\`\`\n\n**Core Feature Endpoints:**\n\`\`\`\nGET    /api/${prompt.toLowerCase().replace(/\s+/g, '-')}           # List items with pagination\nPOST   /api/${prompt.toLowerCase().replace(/\s+/g, '-')}           # Create new item\nGET    /api/${prompt.toLowerCase().replace(/\s+/g, '-')}/:id       # Get specific item\nPUT    /api/${prompt.toLowerCase().replace(/\s+/g, '-')}/:id       # Update item\nDELETE /api/${prompt.toLowerCase().replace(/\s+/g, '-')}/:id       # Delete item\nPOST   /api/${prompt.toLowerCase().replace(/\s+/g, '-')}/:id/share  # Share item\nGET    /api/${prompt.toLowerCase().replace(/\s+/g, '-')}/analytics  # Get analytics\n\`\`\`\n\n**Real-time WebSocket Events:**\n\`\`\`\n${prompt.toLowerCase().replace(/\s+/g, '_')}_created    # New item created\n${prompt.toLowerCase().replace(/\s+/g, '_')}_updated    # Item updated\n${prompt.toLowerCase().replace(/\s+/g, '_')}_deleted    # Item deleted\nuser_presence         # User online/offline status\ntyping_indicator      # Real-time typing indicators\n\`\`\`\n\n`,

    `### **2.3. Security & Performance Framework**\n\n**Security Measures:**\n- **Authentication:** JWT with RS256 signing, refresh token rotation\n- **Authorization:** Role-based access control (RBAC) with granular permissions\n- **Data Protection:** Encryption at rest (AES-256), in transit (TLS 1.3)\n- **Input Validation:** Zod schemas, SQL injection prevention, XSS protection\n- **Rate Limiting:** Tiered limits by user role, DDoS protection\n- **API Security:** CORS configuration, security headers, API versioning\n- **Monitoring:** Real-time security alerts, audit logging, anomaly detection\n\n**Performance Optimizations:**\n- **Database:** Connection pooling, query optimization, read replicas\n- **Caching:** Redis for session/query caching, CDN for static assets\n- **Frontend:** Code splitting, lazy loading, virtual scrolling\n- **API:** Response compression, HTTP/2, request batching\n- **Monitoring:** APM tools, performance budgets, Core Web Vitals\n\n`,

    `### **2.4. Error Handling & Resilience**\n\n**Error Recovery Patterns:**\n- **Circuit Breaker:** Prevent cascade failures\n- **Retry Logic:** Exponential backoff with jitter\n- **Graceful Degradation:** Fallback mechanisms\n- **Health Checks:** Database, Redis, external services\n- **Monitoring:** Error tracking, alerting, automated recovery\n\n**User Experience:**\n- **Error Boundaries:** React error boundaries with user-friendly messages\n- **Loading States:** Skeleton screens, progress indicators\n- **Offline Support:** Service workers, local storage fallbacks\n- **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation\n\n---\n\n`,

    `## **⚡ 3. Quality & Performance Standards**\n\n### **3.1. Development Standards**\n□ **Code Quality:** ESLint, Prettier, SonarQube, 0 critical issues\n□ **Type Safety:** TypeScript strict mode, 100% type coverage\n□ **Testing:** 90%+ code coverage, mutation testing\n□ **Documentation:** JSDoc comments, API documentation, README\n□ **Version Control:** Conventional commits, semantic versioning\n\n### **3.2. Performance Benchmarks**\n□ **Core Web Vitals:**\n  - First Contentful Paint (FCP): < 1.2s\n  - Largest Contentful Paint (LCP): < 2.0s\n  - Cumulative Layout Shift (CLS): < 0.1\n  - First Input Delay (FID): < 100ms\n□ **API Performance:**\n  - 95th percentile response time: < 200ms\n  - 99th percentile response time: < 500ms\n  - Throughput: 1000+ requests/second\n□ **Database Performance:**\n  - Query response time: < 50ms average\n  - Connection pool utilization: < 80%\n\n### **3.3. Security Standards**\n□ **OWASP Top 10:** Zero vulnerabilities\n□ **Dependency Scanning:** No high/critical vulnerabilities\n□ **Penetration Testing:** Annual third-party assessment\n□ **Compliance:** SOC 2 Type II, GDPR ready\n\n### **3.4. Reliability Standards**\n□ **Uptime:** 99.9% SLA (< 8.77 hours downtime/year)\n□ **Error Rate:** < 0.1% for critical operations\n□ **Recovery Time:** < 15 minutes for critical issues\n□ **Backup & Recovery:** Daily automated backups, 4-hour RTO\n\n---\n\n`,

    `## **📋 4. Implementation Roadmap**\n\n### **4.1. Development Phases**\n\n**Phase 1: Foundation (Week 1-2)**\n- Database schema and migrations\n- Authentication system\n- Basic API endpoints\n- CI/CD pipeline setup\n- Testing framework\n\n**Phase 2: Core Features (Week 3-5)**\n- Main feature implementation\n- Frontend components\n- Real-time functionality\n- User management\n- Basic analytics\n\n**Phase 3: Enhancement (Week 6-7)**\n- Advanced features\n- Performance optimization\n- Security hardening\n- Comprehensive testing\n- Documentation\n\n**Phase 4: Production (Week 8)**\n- Production deployment\n- Monitoring setup\n- Load testing\n- Security audit\n- Go-live preparation\n\n### **4.2. Resource Requirements**\n- **Development Team:** 2-3 full-stack developers\n- **DevOps Engineer:** 0.5 FTE for infrastructure\n- **Designer:** 0.25 FTE for UI/UX refinements\n- **QA Engineer:** 0.5 FTE for testing\n\n### **4.3. Technology Migration Path**\n- **V1.0:** Monolithic architecture on ${platform}\n- **V1.5:** Microservices extraction for high-load components\n- **V2.0:** Multi-region deployment, advanced analytics\n- **V2.5:** AI/ML features, advanced automation\n\n### **4.4. Cost Estimation**\n**Development Costs:**\n- Development team: $50,000-75,000\n- Infrastructure: $1,000-2,000/month\n- Third-party services: $500-1,000/month\n- Tools and licenses: $200-500/month\n\n**Operational Costs (Monthly):**\n- Hosting: $500-2,000 (scales with usage)\n- Database: $200-1,000\n- Monitoring/Analytics: $100-500\n- Email/SMS services: $50-200\n\n---\n\n`,

    `## **🔮 5. Future Enhancements & Scaling**\n\n### **5.1. Version 2.0 Roadmap**\n- **AI Integration:** Machine learning recommendations, automated insights\n- **Mobile Apps:** Native iOS/Android applications\n- **Advanced Analytics:** Custom dashboards, predictive analytics\n- **Enterprise Features:** SSO, advanced permissions, audit trails\n- **API Ecosystem:** Public API, webhooks, integrations marketplace\n\n### **5.2. Scaling Considerations**\n- **Horizontal Scaling:** Load balancers, auto-scaling groups\n- **Database Scaling:** Read replicas, sharding strategies\n- **Microservices:** Service decomposition, event-driven architecture\n- **Global Deployment:** Multi-region setup, edge computing\n- **Performance:** CDN optimization, advanced caching strategies\n\n### **5.3. Technical Debt Management**\n- **Code Reviews:** Mandatory peer reviews, automated quality gates\n- **Refactoring:** Scheduled refactoring sprints, architecture reviews\n- **Monitoring:** Technical debt tracking, performance regression tests\n- **Documentation:** Living documentation, architecture decision records\n\n---\n\n`,

    `## **📊 6. Monitoring & Analytics**\n\n### **6.1. Application Monitoring**\n- **Performance:** APM tools (Datadog, New Relic)\n- **Errors:** Sentry for error tracking and alerting\n- **Logs:** Centralized logging with search capabilities\n- **Uptime:** External monitoring services\n\n### **6.2. Business Analytics**\n- **User Behavior:** Event tracking, funnel analysis\n- **Feature Usage:** A/B testing, feature flags\n- **Performance:** Core business metrics dashboards\n- **Customer Success:** NPS surveys, user feedback loops\n\n### **6.3. Security Monitoring**\n- **Access Logs:** Authentication attempts, permission changes\n- **Anomaly Detection:** Unusual access patterns, data exports\n- **Vulnerability Scanning:** Continuous security assessment\n- **Incident Response:** Automated alerting, response playbooks\n\n---\n\n`,

    `## **✅ 7. Quality Assurance Checklist**\n\n### **7.1. Pre-Launch Checklist**\n□ All tests passing (unit, integration, E2E)\n□ Security audit completed\n□ Performance benchmarks met\n□ Database backup/recovery tested\n□ Monitoring and alerting configured\n□ Documentation completed\n□ Legal review completed (privacy policy, terms)\n□ Compliance requirements met\n\n### **7.2. Post-Launch Monitoring**\n□ Error rates within acceptable limits\n□ Performance metrics stable\n□ User feedback collection active\n□ Security monitoring operational\n□ Backup processes verified\n□ Support processes established\n\n---\n\n`,

    `*Generated by NoCodeLos Blueprint Engine v4.0*  \n*"Enterprise-grade architecture, production-ready from day one"*  \n*Quality Score: 9.2/10 | Completeness: 97% | Production Readiness: 95%*\n\n`
  ];

  for (const section of sections) {
    // Simulate realistic typing speed with character-by-character streaming
    for (let i = 0; i < section.length; i++) {
      const char = section[i];
      yield char;

      // Faster streaming for better visual effect
      let delay = 15; // Base delay of 15ms per character
      
      // Add slight variations for natural feel
      if (char === ' ') delay = 25; // Slightly longer for spaces
      if (char === '\n') delay = 50; // Longer for line breaks
      if (char === '.') delay = 100; // Pause at sentence ends
      
      // Add small random variation
      delay += Math.random() * 10;
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Small pause between sections
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

export async function* generateBlueprint(prompt: string, platform: z.infer<typeof platformEnum>, userApiKey?: string): AsyncGenerator<string> {
  // Stream AI content directly without any post-processing or quality validation
  yield* callDeepSeekAPI(prompt, platform, userApiKey);

}