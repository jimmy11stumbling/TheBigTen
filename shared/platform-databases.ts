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
    targetAudience: "Generalists, citizen developers, beginners, and professionals",
    coreFeatures: [
      "Replit Agent for full-stack app generation",
      "Element Selector for visual UI modification", 
      "Real-time collaborative coding (Multiplayer)",
      "Integrated deployment options (Autoscale, Static, Reserved VM, Scheduled)",
      "Native data storage (PostgreSQL, Key-Value Store, Object Storage)",
      "Extensive language support via Nix package manager",
      "Mobile app development with Expo integration"
    ],
    techStack: {
      runtime: "Nix-based environments",
      frontend: ["React", "Next.js", "Vue", "Svelte", "HTML/CSS/JS"],
      backend: ["Node.js", "Python", "Go", "Java", "C++", "Rust"],
      database: ["PostgreSQL", "ReplDB (Key-Value)", "Object Storage"],
      deployment: ["Replit Autoscale", "Static hosting", "Reserved VM", "Scheduled jobs"]
    },
    integrations: {
      auth: ["Replit Auth", "Firebase Auth", "Google OAuth"],
      payments: ["Stripe"],
      ai: ["OpenAI", "Anthropic Claude"],
      deployment: ["Built-in Replit hosting", "Custom domains"],
      databases: ["PostgreSQL", "MongoDB", "Redis"],
      other: ["Sendgrid", "Google Workspace", "Slack", "Twilio", "Airtable", "Expo"]
    },
    pricingModel: "Freemium with Replit Core plan for full Agent use",
    keyDifferentiator: "Complete integrated platform from idea to deployed application without leaving browser",
    bestFor: [
      "Rapid prototyping and MVP development",
      "Educational projects and learning",
      "Collaborative development teams",
      "Full-stack applications with built-in hosting",
      "Projects requiring multiple programming languages"
    ],
    limitations: [
      "Vendor lock-in to Replit ecosystem",
      "Limited customization of underlying infrastructure",
      "Pricing can scale with usage"
    ]
  },

  cursor: {
    name: "Cursor",
    vendor: "Anysphere Inc.",
    primaryFunction: "AI-first code editor with deep codebase understanding",
    targetAudience: "Software developers from students to professionals",
    coreFeatures: [
      "Agent Mode for autonomous task completion",
      "Codebase indexing with embeddings for context",
      "@-Mentions for precise context control",
      "Inline Edit (Cmd/K) for rapid code modification",
      ".cursorrules for project-specific AI instructions",
      "Multiple LLM support with custom models"
    ],
    techStack: {
      runtime: "VS Code fork (VSCodium)",
      frontend: ["Any web framework", "React", "Vue", "Angular", "Svelte"],
      backend: ["Node.js", "Python", "Go", "Rust", "Java", "C#"],
      database: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis"],
      deployment: ["External services required"]
    },
    integrations: {
      auth: ["Auth0", "Firebase Auth", "Custom JWT"],
      payments: ["Stripe", "PayPal", "Custom payment gateways"],
      ai: ["GPT-4o", "Claude 3.7 Sonnet", "Gemini 2.5 Pro", "Grok"],
      deployment: ["Vercel", "Netlify", "AWS", "Google Cloud", "Azure"],
      databases: ["Neon PostgreSQL", "Prisma", "MongoDB", "MySQL", "Cloudflare D1"],
      other: ["Jira", "Brave Search", "GitHub", "GitLab"]
    },
    pricingModel: "Freemium with Hobby, Pro, Business tiers",
    keyDifferentiator: "Deep project-wide contextual understanding with codebase indexing",
    bestFor: [
      "Complex codebase refactoring and maintenance",
      "Large-scale application development", 
      "Teams requiring advanced AI-assisted coding",
      "Projects with extensive documentation needs",
      "Multi-repository development"
    ],
    limitations: [
      "Requires separate deployment solutions",
      "No built-in hosting or infrastructure",
      "Primarily a development tool, not a complete platform"
    ]
  },

  lovable: {
    name: "Lovable 2.0", 
    vendor: "Lovable",
    primaryFunction: "AI-powered platform for production-ready full-stack applications",
    targetAudience: "Non-technical users and developers seeking rapid prototyping",
    coreFeatures: [
      "AI Fullstack Engineer for conversational development",
      "Vibe Coding philosophy with natural language",
      "Multiplayer collaboration with real-time co-editing",
      "Agentic Chat Mode for planning and debugging",
      "Security Scan for production-readiness",
      "Dev Mode for direct code editing"
    ],
    techStack: {
      runtime: "Browser-based development environment",
      frontend: ["React", "Tailwind CSS", "Vite"],
      backend: ["Supabase Edge Functions", "Node.js serverless"],
      database: ["Supabase PostgreSQL"],
      deployment: ["Lovable hosting", "Custom domains"]
    },
    integrations: {
      auth: ["Supabase Auth", "Clerk"],
      payments: ["Stripe"],
      ai: ["Anthropic Claude 3.7 Sonnet", "Replicate"],
      deployment: ["Vercel", "Netlify", "Lovable hosting"],
      databases: ["Supabase PostgreSQL"],
      other: ["GitHub", "Figma via Builder.io", "Resend", "Entri domains"]
    },
    pricingModel: "Freemium with credit-based system",
    keyDifferentiator: "Vibe coding with tight Supabase integration and Security Scan",
    bestFor: [
      "Non-technical founders building MVPs",
      "Rapid prototyping and validation",
      "Supabase-centric applications",
      "Projects requiring built-in security scanning",
      "Teams needing visual collaboration tools"
    ],
    limitations: [
      "Primarily Supabase-focused architecture",
      "Limited backend customization options", 
      "Credit-based pricing model"
    ]
  },

  windsurf: {
    name: "Windsurf",
    vendor: "Codeium",
    primaryFunction: "Agentic IDE with AI-driven code assistance and database integration",
    targetAudience: "Software developers wanting AI assistance in IDE workflow",
    coreFeatures: [
      "Cascade AI agent for multi-file edits and debugging",
      "Inline AI for targeted code modification",
      "Supercomplete for context-aware autocompletion",
      "Model Context Protocol (MCP) for external tool integration",
      ".windsurfrules for project-specific AI behavior",
      "App Deploys for direct deployment to hosting"
    ],
    techStack: {
      runtime: "Proprietary IDE with AI agents",
      frontend: ["React", "Vue", "Angular", "Svelte", "Next.js"],
      backend: ["Node.js", "Python", "Go", "Java", "PHP"],
      database: ["PostgreSQL", "MongoDB", "MySQL", "Cloudflare D1"],
      deployment: ["Netlify", "Vercel", "Custom hosting"]
    },
    integrations: {
      auth: ["Custom auth solutions", "Firebase", "Auth0"],
      payments: ["Stripe", "Custom payment processors"],
      ai: ["Proprietary AI agents", "Custom LLM integration"],
      deployment: ["Netlify (primary)", "Vercel", "Custom"],
      databases: ["Neon PostgreSQL", "Prisma", "MongoDB", "MySQL", "Cloudflare D1"],
      other: ["Convex", "Cloudflare Workers", "SQLAlchemy", "TypeORM"]
    },
    pricingModel: "Prompt credits with premium AI models",
    keyDifferentiator: "Model Context Protocol enabling direct database operations via natural language",
    bestFor: [
      "Database-heavy applications",
      "Complex backend integrations",
      "Projects requiring ORM assistance",
      "Teams working with multiple databases",
      "Applications with sophisticated data models"
    ],
    limitations: [
      "Primarily IDE-focused, not full platform",
      "Requires external hosting solutions",
      "Credit-based pricing for advanced features"
    ]
  }
};

export function getPlatformDatabase(platform: string): PlatformDatabase | undefined {
  return PLATFORM_DATABASES[platform.toLowerCase()];
}

export function getAllPlatforms(): string[] {
  return Object.keys(PLATFORM_DATABASES);
}