
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
    primaryFunction: "Security-first CLI agent for agentic coding",
    targetAudience: "Professional developers and researchers",
    coreFeatures: [
      "Terminal-based AI assistant with codebase understanding",
      "Security by design with explicit user approval",
      "Context management via CLAUDE.md files",
      "Customizable workflows and slash commands",
      "Headless mode for CI/CD integration",
      "Cross-file refactoring and debugging",
      "Test-driven development support",
      "Granular permission system"
    ],
    techStack: {
      runtime: "Node.js CLI tool installed via npm",
      frontend: ["Any framework", "React", "Vue", "Angular"],
      backend: ["Node.js", "Python", "Go", "Rust", "Java"],
      database: ["PostgreSQL", "MongoDB", "MySQL", "SQLite"],
      deployment: ["External services required"]
    },
    integrations: {
      auth: ["Custom auth solutions", "Firebase", "Auth0"],
      payments: ["Stripe", "Custom payment processors"],
      ai: ["Claude 3.7 Sonnet", "Claude 4 Opus"],
      deployment: ["Any hosting service"],
      databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
      other: ["Model Context Protocol", "GitHub", "Neovim", "Emacs", "Claude Hub"]
    },
    pricingModel: "Subscription ($17/month Pro, $100/month Max) or API usage",
    keyDifferentiator: "Security-first design with granular permissions and direct access to powerful Claude models",
    bestFor: [
      "Security-conscious development teams",
      "Complex codebase refactoring",
      "Terminal-native developers",
      "CI/CD pipeline integration",
      "Custom workflow automation"
    ],
    limitations: [
      "High and potentially unpredictable costs",
      "Terminal-only interface",
      "No built-in hosting or deployment",
      "Requires technical expertise for effective use"
    ]
  },

  gemini: {
    name: "Gemini CLI",
    vendor: "Google",
    primaryFunction: "Open-source terminal-based AI agent with web integration",
    targetAudience: "Individual and professional developers",
    coreFeatures: [
      "Open-source terminal-based AI agent",
      "Massive 1 million token context window",
      "Built-in tools (grep, file operations, terminal)",
      "Web integration (Google Search, web-fetch)",
      "Native Windows support without WSL",
      "Model Context Protocol support",
      "Project-specific GEMINI.md configuration",
      "Automation and CI/CD integration"
    ],
    techStack: {
      runtime: "Node.js CLI application",
      frontend: ["React", "Vue", "Angular", "Svelte"],
      backend: ["Node.js", "Python", "Go", "Java"],
      database: ["PostgreSQL", "MongoDB", "MySQL", "Cloudflare D1"],
      deployment: ["External services required"]
    },
    integrations: {
      auth: ["Custom auth solutions", "Firebase", "Auth0"],
      payments: ["Stripe", "Custom payment processors"],
      ai: ["Gemini 2.5 Pro", "Gemini Flash"],
      deployment: ["Any hosting service"],
      databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
      other: ["Google Search", "Model Context Protocol", "Selenium", "REST APIs"]
    },
    pricingModel: "Generous free tier with API usage-based billing",
    keyDifferentiator: "Open-source with unmatched free usage limits and Google Search integration",
    bestFor: [
      "Budget-conscious developers",
      "Open-source projects",
      "Research and experimentation",
      "Web-integrated applications",
      "Cross-platform development"
    ],
    limitations: [
      "Early alpha stability issues",
      "Model downgrades on free tier",
      "Limited enterprise features",
      "Community-driven support only"
    ]
  },

  base44: {
    name: "Base44",
    vendor: "Wix (acquired for $80M)",
    primaryFunction: "No-code full-stack app builder with 'buttery includes' philosophy",
    targetAudience: "Non-technical founders, entrepreneurs, and businesses",
    coreFeatures: [
      "Natural language app generation",
      "Buttery includes - all-in-one functionality",
      "Automatic backend with auth and database",
      "Instant deployment and hosting",
      "Enterprise-ready features (SSO, permissions)",
      "Built-in integrations (email, SMS, APIs)",
      "Multiple AI model support",
      "Collaborative discuss feature"
    ],
    techStack: {
      runtime: "Browser-based platform",
      frontend: ["React", "Next.js", "HTML/CSS/JS"],
      backend: ["Node.js", "Built-in backend services"],
      database: ["Built-in database", "PostgreSQL"],
      deployment: ["Base44 hosting", "Custom domains"]
    },
    integrations: {
      auth: ["Built-in authentication", "SSO"],
      payments: ["Stripe", "Built-in payment processing"],
      ai: ["Gemini 2.5", "Claude 4 Sonnet"],
      deployment: ["Base44 hosting", "Custom domains"],
      databases: ["Built-in database", "External APIs"],
      other: ["GitHub", "Amazon S3", "Twilio SendGrid", "OpenAI"]
    },
    pricingModel: "Message-based credits ($20-100/month)",
    keyDifferentiator: "Complete all-in-one solution with buttery includes philosophy, recently acquired by Wix",
    bestFor: [
      "Non-technical founders building MVPs",
      "Business applications and internal tools",
      "Rapid prototyping without technical setup",
      "Projects requiring built-in backend services",
      "Teams wanting zero-configuration development"
    ],
    limitations: [
      "Limited customization for complex requirements",
      "Vendor lock-in to Base44/Wix ecosystem",
      "Message-based pricing can be expensive",
      "May require technical knowledge for debugging"
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
    primaryFunction: "Mobile-first app generator for cross-platform native apps",
    targetAudience: "Entrepreneurs, startups, and non-technical users",
    coreFeatures: [
      "Text-to-native mobile app generation",
      "Cross-platform iOS and Android compatibility",
      "React Native and Expo integration",
      "In-browser Android emulation",
      "Real-time device testing via TestFlight",
      "Backend integration (experimental)",
      "Image input for design guidance",
      "App Store publishing assistance"
    ],
    techStack: {
      runtime: "Browser-based platform using React Native",
      frontend: ["React Native", "Expo", "Native UI components"],
      backend: ["Node.js", "Express", "Serverless functions"],
      database: ["Supabase", "Firebase", "Airtable"],
      deployment: ["App Store", "Google Play Store", "Expo"]
    },
    integrations: {
      auth: ["Firebase Auth", "Custom auth"],
      payments: ["Stripe", "In-app purchases"],
      ai: ["Claude 4 model"],
      deployment: ["App Store", "Google Play Store", "TestFlight"],
      databases: ["Supabase", "Firebase", "Airtable"],
      other: ["Expo", "OpenAI API", "Rapid API", "Health data APIs"]
    },
    pricingModel: "Message-based ($20/month for 100 messages)",
    keyDifferentiator: "Specialized mobile app generation with React Native and native app store deployment",
    bestFor: [
      "Mobile-first applications",
      "Cross-platform app development",
      "MVP development for mobile",
      "Non-technical entrepreneurs",
      "Simple to medium complexity mobile apps"
    ],
    limitations: [
      "Limited to mobile platforms",
      "Reported stability and reliability issues",
      "Expensive message-based pricing",
      "No free trial available",
      "Poor customer support reports"
    ]
  }
};

export function getPlatformDatabase(platform: string): PlatformDatabase | undefined {
  return PLATFORM_DATABASES[platform.toLowerCase()];
}

export function getAllPlatforms(): string[] {
  return Object.keys(PLATFORM_DATABASES);
}
