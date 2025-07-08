
// Platform-specific databases for tailored blueprint generation
export interface PlatformDatabase {
  name: string;
  vendor: string;
  primaryFunction: string;
  targetAudience: string;
  coreFeatures: string[];
  techStack: {
    runtime?: string;
    frontend: string[];
    backend: string[];
    database: string[];
    deployment: string[];
  };
  integrations: {
    auth: string[];
    payments: string[];
    ai: string[];
    deployment: string[];
    databases: string[];
    other: string[];
  };
  pricingModel: string;
  keyDifferentiator: string;
  bestFor: string[];
  limitations: string[];
}

export const PLATFORM_DATABASES: Record<string, PlatformDatabase> = {
  replit: {
    name: "Replit",
    vendor: "Replit, Inc.",
    primaryFunction: "AI-first, collaborative, browser-based IDE and cloud platform",
    targetAudience: "Hobbyists, students, professional teams, and enterprises (40M+ users)",
    coreFeatures: [
      "Replit Agent for full-stack app generation",
      "Element Selector for visual UI modification", 
      "Real-time collaborative coding (Multiplayer)",
      "Integrated deployment options (Autoscale, Static, Reserved VM, Scheduled)",
      "Native data storage (PostgreSQL, Key-Value Store, Object Storage)",
      "Extensive language support via Nix package manager",
      "Mobile app development with Expo integration",
      "Zero-setup development environment"
    ],
    techStack: {
      runtime: "Nix-based cloud environments",
      frontend: ["React", "Next.js", "Vue", "Svelte", "HTML/CSS/JS"],
      backend: ["Node.js", "Python", "Go", "Java", "C++", "Rust"],
      database: ["PostgreSQL", "ReplDB (Key-Value)", "Object Storage", "Redis"],
      deployment: ["Replit Autoscale", "Static hosting", "Reserved VM", "Scheduled jobs"]
    },
    integrations: {
      auth: ["Replit Auth", "Firebase Auth", "Google OAuth"],
      payments: ["Stripe", "PayPal"],
      ai: ["OpenAI", "Anthropic Claude", "xAI", "Perplexity"],
      deployment: ["Built-in Replit hosting", "Custom domains"],
      databases: ["PostgreSQL", "MongoDB", "Redis", "Neon"],
      other: ["Sendgrid", "Twilio", "Slack", "Telegram", "Google Workspace", "Airtable", "Expo"]
    },
    pricingModel: "Freemium ($20/month Core, $35/month Teams)",
    keyDifferentiator: "Complete integrated platform with massive community and zero-setup collaborative environment",
    bestFor: [
      "Rapid prototyping and MVP development",
      "Educational projects and collaborative learning",
      "Team development with real-time collaboration",
      "Full-stack applications with built-in hosting",
      "Multi-language projects without setup friction"
    ],
    limitations: [
      "Vendor lock-in to Replit ecosystem",
      "Limited customization of underlying infrastructure",
      "Pricing scales with usage and team size"
    ]
  },

  cursor: {
    name: "Cursor",
    vendor: "Anysphere Inc.",
    primaryFunction: "AI-first code editor with deep codebase understanding",
    targetAudience: "Professional developers and enterprise teams",
    coreFeatures: [
      "Agent Mode for autonomous task completion",
      "Codebase indexing with embeddings for context",
      "@-Mentions for precise context control",
      "Inline Edit (Cmd/K) for rapid code modification",
      ".cursorrules for project-specific AI instructions",
      "Multiple LLM support with custom models",
      "Predictive edits with Tab-to-Accept",
      "Natural language editing and refactoring"
    ],
    techStack: {
      runtime: "VS Code fork (VSCodium) with TypeScript",
      frontend: ["React", "Vue", "Angular", "Svelte", "Next.js"],
      backend: ["Node.js", "Python", "Go", "Rust", "Java", "C#"],
      database: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis"],
      deployment: ["External services required"]
    },
    integrations: {
      auth: ["Auth0", "Firebase Auth", "Custom JWT"],
      payments: ["Stripe", "PayPal", "Custom payment gateways"],
      ai: ["GPT-4o", "Claude 3.7 Sonnet", "Gemini 2.5 Pro", "Custom models"],
      deployment: ["Vercel", "Netlify", "AWS", "Google Cloud", "Azure"],
      databases: ["Neon PostgreSQL", "Prisma", "MongoDB", "MySQL", "Cloudflare D1"],
      other: ["VS Code Extensions", "Model Context Protocol", "Mend.io Security", "@Docs"]
    },
    pricingModel: "Subscription-based ($20/month Pro, Enterprise custom)",
    keyDifferentiator: "Deep project-wide contextual understanding with VS Code familiarity",
    bestFor: [
      "Complex codebase refactoring and maintenance",
      "Large-scale application development", 
      "Teams requiring advanced AI-assisted coding",
      "Professional developers seeking productivity gains",
      "Multi-repository development workflows"
    ],
    limitations: [
      "Requires separate deployment solutions",
      "No built-in hosting or infrastructure",
      "Primarily development-focused, not end-to-end platform",
      "Can feel cluttered with AI features for some users"
    ]
  },

  lovable: {
    name: "Lovable 2.0", 
    vendor: "Lovable (Accel, 20VC, Creandum backed)",
    primaryFunction: "AI-powered platform for production-ready full-stack applications",
    targetAudience: "Non-technical founders, startups, and teams seeking rapid development",
    coreFeatures: [
      "AI Fullstack Engineer for conversational development",
      "Vibe Coding philosophy with natural language",
      "Multiplayer collaboration with real-time co-editing",
      "Agentic Chat Mode for planning and debugging",
      "Security Scan for production-readiness",
      "Visual Edits with click-to-modify UI",
      "Figma to Lovable integration via Builder.io",
      "Built-in custom domains"
    ],
    techStack: {
      runtime: "Browser-based development environment",
      frontend: ["React", "Tailwind CSS", "Vite"],
      backend: ["Supabase Edge Functions", "Node.js serverless"],
      database: ["Supabase PostgreSQL"],
      deployment: ["Lovable hosting", "Custom domains", "Vercel", "Netlify"]
    },
    integrations: {
      auth: ["Supabase Auth", "Clerk"],
      payments: ["Stripe"],
      ai: ["Anthropic Claude 3.7 Sonnet", "Replicate"],
      deployment: ["Vercel", "Netlify", "Lovable hosting"],
      databases: ["Supabase PostgreSQL"],
      other: ["GitHub", "Figma via Builder.io", "Resend", "Entri domains"]
    },
    pricingModel: "Credit-based system ($25/month Pro, $30/user Teams)",
    keyDifferentiator: "Vibe coding with tight Supabase integration and comprehensive security scanning",
    bestFor: [
      "Non-technical founders building MVPs",
      "Rapid prototyping and validation",
      "Supabase-centric applications",
      "Teams needing visual collaboration tools",
      "Projects requiring built-in security scanning"
    ],
    limitations: [
      "Primarily Supabase-focused architecture",
      "Limited backend customization options", 
      "Credit-based pricing can be expensive",
      "Community reports of stability issues with 2.0 release"
    ]
  },

  windsurf: {
    name: "Windsurf",
    vendor: "Windsurf (formerly Codeium)",
    primaryFunction: "Agentic IDE with AI-driven code assistance and database integration",
    targetAudience: "Professional developers and enterprise teams",
    coreFeatures: [
      "Cascade AI agent for multi-file edits and debugging",
      "Inline AI for targeted code modification",
      "Supercomplete for context-aware autocompletion",
      "Model Context Protocol (MCP) for external tool integration",
      ".windsurfrules for project-specific AI behavior",
      "App Deploys for direct deployment to hosting",
      "Image-to-Code generation",
      "Integrated previews and terminal"
    ],
    techStack: {
      runtime: "Proprietary IDE with AI agents + plugins for JetBrains, VS Code",
      frontend: ["React", "Vue", "Angular", "Svelte", "Next.js"],
      backend: ["Node.js", "Python", "Go", "Java", "PHP"],
      database: ["PostgreSQL", "MongoDB", "MySQL", "Cloudflare D1"],
      deployment: ["Netlify", "Vercel", "Heroku", "Railway"]
    },
    integrations: {
      auth: ["Custom auth solutions", "Firebase", "Auth0"],
      payments: ["Stripe", "Custom payment processors"],
      ai: ["OpenAI", "Claude", "Gemini", "xAI"],
      deployment: ["Netlify (primary)", "Vercel", "Heroku", "Railway"],
      databases: ["Neon PostgreSQL", "Prisma", "MongoDB", "MySQL", "Cloudflare D1"],
      other: ["Model Context Protocol", "Figma", "Slack", "Gitpod", "Convex"]
    },
    pricingModel: "Prompt credits ($15/month Pro, $30/month Teams, $60/month Enterprise)",
    keyDifferentiator: "Enterprise-grade security (FedRAMP, SOC 2) with powerful Cascade agent and MCP integration",
    bestFor: [
      "Database-heavy applications",
      "Complex backend integrations",
      "Enterprise teams requiring security compliance",
      "Projects with sophisticated data models",
      "Teams working with multiple databases"
    ],
    limitations: [
      "Primarily IDE-focused, not full platform",
      "Requires external hosting solutions",
      "Credit-based pricing for advanced features"
    ]
  },

  bolt: {
    name: "Bolt",
    vendor: "StackBlitz",
    primaryFunction: "Full-stack in-browser AI agent with complete environment control",
    targetAudience: "Developers, product managers, designers, and learners",
    coreFeatures: [
      "AI has full control of in-browser environment (filesystem, terminal)",
      "True full-stack generation with WebContainers",
      "Iterative refinement through conversation",
      "Advanced controls (Target file, Lock files)",
      "Visual editor for layout tweaking",
      "Real-time code execution and debugging",
      "Open-source core codebase",
      "One-click integrations with essential services"
    ],
    techStack: {
      runtime: "StackBlitz WebContainers (Node.js in browser)",
      frontend: ["React", "Vue", "Svelte", "Tailwind CSS"],
      backend: ["Node.js", "Express", "Fastify"],
      database: ["PostgreSQL", "Prisma", "SQLite"],
      deployment: ["Netlify", "Vercel", "GitHub Pages"]
    },
    integrations: {
      auth: ["Supabase Auth", "Custom auth"],
      payments: ["Stripe"],
      ai: ["Claude Sonnet 3.5", "Claude Sonnet 3.7"],
      deployment: ["Netlify", "GitHub", "Vercel"],
      databases: ["Supabase", "PostgreSQL", "Prisma"],
      other: ["Figma", "Expo", "GitHub version control"]
    },
    pricingModel: "Token-based subscriptions ($20/month Pro, $30/month Teams)",
    keyDifferentiator: "Unique WebContainer architecture enables true full-stack generation with complete environment control",
    bestFor: [
      "Rapid MVP development and prototyping",
      "Full-stack JavaScript applications",
      "Learning and educational projects",
      "Hackathons and quick iterations",
      "Projects requiring real backend execution"
    ],
    limitations: [
      "Limited to JavaScript/Node.js ecosystem",
      "Token consumption can be unpredictable",
      "WebContainer technology dependency"
    ]
  },

  claude: {
    name: "Claude Code",
    vendor: "Anthropic",
    primaryFunction: "Security-first CLI agent for agentic coding with enterprise-grade AI",
    targetAudience: "Professional developers, researchers, and enterprise teams",
    coreFeatures: [
      "Terminal-based AI assistant with deep codebase understanding",
      "Security by design with explicit user approval workflows",
      "Context management via CLAUDE.md project files",
      "Customizable workflows and slash commands",
      "Headless mode for CI/CD integration",
      "Cross-file refactoring and debugging capabilities",
      "Test-driven development support",
      "Granular permission system with audit trails",
      "Model Context Protocol (MCP) integration",
      "Enterprise-grade security and compliance"
    ],
    techStack: {
      runtime: "Node.js CLI tool installed via npm",
      frontend: ["React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt.js"],
      backend: ["Node.js", "Python", "Go", "Rust", "Java", "C#", "PHP"],
      database: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis", "Cassandra"],
      deployment: ["AWS", "Google Cloud", "Azure", "Heroku", "Railway", "Fly.io"]
    },
    integrations: {
      auth: ["Custom auth solutions", "Firebase Auth", "Auth0", "Okta", "SAML"],
      payments: ["Stripe", "PayPal", "Square", "Custom payment processors"],
      ai: ["Claude 3.7 Sonnet", "Claude 4 Opus", "Claude 3.5 Haiku"],
      deployment: ["Any hosting service", "Docker", "Kubernetes", "Serverless"],
      databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Supabase", "PlanetScale"],
      other: ["Model Context Protocol", "GitHub", "GitLab", "Neovim", "Emacs", "Claude Hub", "Slack", "Discord"]
    },
    pricingModel: "Subscription ($17/month Pro, $100/month Max) or API usage-based billing",
    keyDifferentiator: "Security-first design with granular permissions, enterprise compliance, and direct access to most powerful Claude models",
    bestFor: [
      "Security-conscious development teams",
      "Complex enterprise codebase refactoring",
      "Terminal-native developers and DevOps teams",
      "CI/CD pipeline integration and automation",
      "Custom workflow automation and scripting",
      "Compliance-heavy industries (finance, healthcare)",
      "Large-scale system architecture and design"
    ],
    limitations: [
      "High and potentially unpredictable API costs",
      "Terminal-only interface (no GUI)",
      "No built-in hosting or deployment services",
      "Requires technical expertise for effective use",
      "Limited visual design capabilities"
    ]
  },

  gemini: {
    name: "Gemini CLI",
    vendor: "Google (Alphabet Inc.)",
    primaryFunction: "Open-source terminal-based AI agent with massive context and web integration",
    targetAudience: "Individual developers, researchers, and budget-conscious teams",
    coreFeatures: [
      "Open-source terminal-based AI agent with full source access",
      "Massive 1 million token context window (industry-leading)",
      "Built-in tools (grep, file operations, terminal commands)",
      "Web integration (Google Search, web-fetch, live data)",
      "Native Windows support without WSL requirement",
      "Model Context Protocol (MCP) support",
      "Project-specific GEMINI.md configuration files",
      "Automation and CI/CD integration capabilities",
      "Cross-platform compatibility (Windows, macOS, Linux)",
      "Real-time web search and data retrieval"
    ],
    techStack: {
      runtime: "Node.js CLI application with cross-platform support",
      frontend: ["React", "Vue", "Angular", "Svelte", "Next.js", "Astro"],
      backend: ["Node.js", "Python", "Go", "Java", "C#", "Rust"],
      database: ["PostgreSQL", "MongoDB", "MySQL", "Cloudflare D1", "Firebase"],
      deployment: ["Google Cloud", "AWS", "Azure", "Vercel", "Netlify"]
    },
    integrations: {
      auth: ["Firebase Auth", "Google OAuth", "Auth0", "Custom auth solutions"],
      payments: ["Stripe", "PayPal", "Google Pay", "Custom payment processors"],
      ai: ["Gemini 2.5 Pro", "Gemini Flash", "Gemini Ultra"],
      deployment: ["Google Cloud Platform", "Firebase", "Any hosting service"],
      databases: ["Firebase Firestore", "PostgreSQL", "MongoDB", "MySQL", "Redis"],
      other: ["Google Search API", "Model Context Protocol", "Selenium", "REST APIs", "Google Workspace", "YouTube API"]
    },
    pricingModel: "Generous free tier (1M requests/month) with usage-based billing ($0.35/1M tokens)",
    keyDifferentiator: "Open-source with unmatched free usage limits, Google Search integration, and largest context window",
    bestFor: [
      "Budget-conscious developers and startups",
      "Open-source projects and research",
      "Educational institutions and students",
      "Web-integrated applications requiring search",
      "Cross-platform development projects",
      "Rapid prototyping and experimentation",
      "Data-heavy applications with large context needs"
    ],
    limitations: [
      "Early alpha stability and reliability issues",
      "Model quality downgrades on free tier",
      "Limited enterprise features and support",
      "Community-driven support only",
      "Google API dependencies for full functionality"
    ]
  },

  base44: {
    name: "Base44",
    vendor: "Wix (acquired for $80M in 2024)",
    primaryFunction: "No-code full-stack app builder with 'buttery includes' all-in-one philosophy",
    targetAudience: "Non-technical founders, entrepreneurs, SMBs, and internal business tool creators",
    coreFeatures: [
      "Natural language app generation with AI",
      "Buttery includes - comprehensive all-in-one functionality",
      "Automatic backend with authentication and database",
      "Instant deployment and hosting infrastructure",
      "Enterprise-ready features (SSO, role-based permissions)",
      "Built-in integrations (email, SMS, payment, APIs)",
      "Multiple AI model support (Gemini, Claude)",
      "Collaborative discuss feature for team development",
      "Zero-configuration development environment",
      "Wix ecosystem integration post-acquisition"
    ],
    techStack: {
      runtime: "Browser-based platform with cloud infrastructure",
      frontend: ["React", "Next.js", "HTML/CSS/JS", "Wix Editor"],
      backend: ["Node.js", "Built-in backend services", "Wix infrastructure"],
      database: ["Built-in database", "PostgreSQL", "Wix Data"],
      deployment: ["Base44 hosting", "Wix hosting", "Custom domains"]
    },
    integrations: {
      auth: ["Built-in authentication", "SSO", "SAML", "Google OAuth"],
      payments: ["Stripe", "Built-in payment processing", "Wix Payments"],
      ai: ["Gemini 2.5", "Claude 4 Sonnet", "OpenAI GPT"],
      deployment: ["Base44 hosting", "Wix hosting", "Custom domains"],
      databases: ["Built-in database", "Wix Data", "External APIs"],
      other: ["GitHub", "Amazon S3", "Twilio SendGrid", "OpenAI", "Wix ecosystem", "Zapier"]
    },
    pricingModel: "Message-based credits ($20-100/month) with Wix enterprise plans",
    keyDifferentiator: "Complete all-in-one solution with buttery includes philosophy, backed by Wix's $80M acquisition and enterprise infrastructure",
    bestFor: [
      "Non-technical founders building business MVPs",
      "Business applications and internal tools",
      "Rapid prototyping without technical setup",
      "Projects requiring comprehensive built-in services",
      "Teams wanting zero-configuration development",
      "Wix ecosystem integration projects",
      "Enterprise clients needing scalable no-code solutions"
    ],
    limitations: [
      "Limited customization for highly complex requirements",
      "Vendor lock-in to Base44/Wix ecosystem",
      "Message-based pricing can become expensive at scale",
      "May require technical knowledge for advanced debugging",
      "Post-acquisition integration uncertainties"
    ]
  },

  v0: {
    name: "V0",
    vendor: "Vercel",
    primaryFunction: "UI component generator optimized for React and Next.js",
    targetAudience: "Frontend developers and designers",
    coreFeatures: [
      "Prompt-to-UI generation with three design options",
      "Image-to-code from mockups and Figma designs",
      "Iterative refinement through chat interface",
      "Framework support (React, Vue, Svelte, HTML/CSS)",
      "Responsive design optimization",
      "Full-stack workflow planning",
      "Direct deployment to Vercel",
      "Component library integration"
    ],
    techStack: {
      runtime: "Web-based tool hosted on v0.dev",
      frontend: ["React", "Next.js", "Vue", "Svelte", "Tailwind CSS"],
      backend: ["Next.js API routes", "Node.js"],
      database: ["PostgreSQL", "MongoDB", "Prisma"],
      deployment: ["Vercel", "Netlify"]
    },
    integrations: {
      auth: ["NextAuth.js", "Clerk", "Firebase Auth"],
      payments: ["Stripe", "Custom payment processors"],
      ai: ["Proprietary models trained on Vercel ecosystem"],
      deployment: ["Vercel (primary)", "Netlify"],
      databases: ["PostgreSQL", "MongoDB", "Prisma", "Supabase"],
      other: ["Figma", "Material UI", "Framer Motion", "react-three-fiber"]
    },
    pricingModel: "Credit-based ($10-50/month)",
    keyDifferentiator: "Specialized UI generation with deep Vercel ecosystem integration and one-click deployment",
    bestFor: [
      "Frontend developers using React/Next.js",
      "UI component scaffolding and prototyping",
      "Vercel ecosystem projects",
      "Design-to-code workflows",
      "Rapid UI iteration and testing"
    ],
    limitations: [
      "Frontend-focused, not full-stack",
      "Best suited for Vercel ecosystem",
      "Limited backend functionality",
      "Can lose context in complex projects"
    ]
  },

  rork: {
    name: "Rork",
    vendor: "Rork (Founded by Daniel Dhawan)",
    primaryFunction: "Mobile-first app generator for cross-platform native applications",
    targetAudience: "Entrepreneurs, startups, non-technical users, and mobile app creators",
    coreFeatures: [
      "Text-to-native mobile app generation with AI",
      "Cross-platform iOS and Android compatibility",
      "React Native and Expo framework integration",
      "In-browser Android emulation for testing",
      "Real-time device testing via TestFlight",
      "Backend integration (experimental features)",
      "Image input for design guidance and mockups",
      "App Store publishing assistance and guidance",
      "Mobile-specific UI component library",
      "Native performance optimization"
    ],
    techStack: {
      runtime: "Browser-based platform using React Native framework",
      frontend: ["React Native", "Expo", "Native UI components", "TypeScript"],
      backend: ["Node.js", "Express", "Serverless functions", "React Native backend"],
      database: ["Supabase", "Firebase", "Airtable", "Realm"],
      deployment: ["App Store", "Google Play Store", "Expo", "TestFlight"]
    },
    integrations: {
      auth: ["Firebase Auth", "React Native Auth", "Custom auth solutions"],
      payments: ["Stripe", "In-app purchases", "Apple Pay", "Google Pay"],
      ai: ["Claude 4 model", "OpenAI API"],
      deployment: ["App Store", "Google Play Store", "TestFlight", "Expo"],
      databases: ["Supabase", "Firebase", "Airtable", "Realm Database"],
      other: ["Expo", "OpenAI API", "Rapid API", "Health data APIs", "React Native libraries"]
    },
    pricingModel: "Message-based ($20/month for 100 messages, no free tier)",
    keyDifferentiator: "Specialized mobile app generation with React Native, native app store deployment, and mobile-first development approach",
    bestFor: [
      "Mobile-first applications and startups",
      "Cross-platform app development projects",
      "MVP development for mobile platforms",
      "Non-technical entrepreneurs entering mobile",
      "Simple to medium complexity mobile apps",
      "React Native ecosystem projects"
    ],
    limitations: [
      "Limited exclusively to mobile platforms",
      "Reported stability and reliability issues",
      "Expensive message-based pricing with no free tier",
      "No free trial available for testing",
      "Poor customer support and documentation reports",
      "Limited backend and web integration capabilities"
    ]
  }
};

export function getPlatformDatabase(platform: string): PlatformDatabase | undefined {
  return PLATFORM_DATABASES[platform.toLowerCase()];
}

export function getAllPlatforms(): string[] {
  return Object.keys(PLATFORM_DATABASES);
}
