import { z } from "zod";
import { platformEnum } from "../../shared/schema.js";

interface ContentStrategy {
  language: string;
  structure: string;
  examples: string;
  complexity: string;
}

function getContentStrategy(platform: string, audience: string): ContentStrategy {
  const strategies = {
    technical: {
      language: "Technical precision with implementation details",
      structure: "Modular architecture with clear separation of concerns",
      examples: "Production-ready code with complete business logic",
      complexity: "Enterprise-grade with scalability considerations"
    },
    business: {
      language: "Business-focused with technical depth",
      structure: "Feature-driven development approach",
      examples: "Real-world implementations with ROI metrics",
      complexity: "Production-ready with business impact focus"
    }
  };

  return audience.includes("Enterprise") ? strategies.technical : strategies.business;
}

export function buildSystemPrompt(platform: z.infer<typeof platformEnum>, platformDB: any): string {
  const contentStrategy = getContentStrategy(platform, platformDB?.targetAudience || 'Professional Developers');

  const corePrompt = `You are an expert technical architect generating comprehensive, production-ready blueprints for building complete full-stack applications from scratch.

**MISSION:** Create detailed implementation blueprints that enable developers to build complete, working applications without any guesswork.

**BLUEPRINT REQUIREMENTS:**
1. **Complete Full-Stack Architecture** - Frontend, backend, database, deployment
2. **Actual Implementation Code** - Real functions, components, APIs with complete business logic
3. **Database Design** - Complete schemas, relationships, queries, migrations
4. **API Documentation** - All endpoints with request/response examples
5. **User Interface** - Complete component hierarchy and user flows
6. **Deployment Instructions** - Step-by-step setup and configuration
7. **Business Logic** - All core features with actual algorithms and calculations

**CODE STANDARDS:**
- Every function must have complete implementation with real business logic
- Include actual database operations, validations, error handling
- Write production-ready components with state management
- Provide complete API endpoints with authentication and authorization
- Include real calculations, algorithms, and data processing logic
- No placeholders, TODOs, or incomplete implementations

**BLUEPRINT STRUCTURE:**
1. **Executive Summary** - Project overview and key features
2. **Technical Architecture** - System design and technology stack
3. **Database Design** - Complete schema with relationships
4. **Backend Implementation** - APIs, business logic, authentication
5. **Frontend Implementation** - Components, pages, user interactions
6. **Deployment Guide** - Infrastructure and deployment steps
7. **Feature Implementation** - Core functionality with complete code

Generate blueprints that enable building complete, production-ready applications.`;

  const platformOptimizations = {
    replit: `
**REPLIT OPTIMIZATION:**
- Zero-setup development environment
- Nix package management integration
- Built-in database solutions (ReplDB/PostgreSQL)
- Real-time collaboration features
- Deployment simplicity with autoscaling`,

    cursor: `
**CURSOR OPTIMIZATION:**
- AI-powered development workflow
- Advanced code completion and refactoring
- Local development with VS Code integration
- Terminal-based productivity features
- Enterprise security and compliance`,

    lovable: `
**LOVABLE OPTIMIZATION:**
- Rapid prototyping capabilities
- Component-based architecture
- Real-time preview and iteration
- Design-to-code workflow
- Collaborative development environment`,

    windsurf: `
**WINDSURF OPTIMIZATION:**
- Multi-agent development approach
- Autonomous code generation
- Advanced AI reasoning capabilities
- Complex project coordination
- Enterprise-grade development workflows`,

    bolt: `
**BOLT OPTIMIZATION:**
- WebContainer in-browser execution
- Full-stack development capabilities
- Package management and dependencies
- Live preview and debugging
- Deployment integration`,

    claude: `
**CLAUDE OPTIMIZATION:**
- Advanced reasoning and analysis
- Complex problem-solving capabilities
- Multi-step implementation planning
- Code quality and best practices
- Documentation and explanation`,

    gemini: `
**GEMINI OPTIMIZATION:**
- Google ecosystem integration
- Search API and data access
- Multi-modal capabilities
- Large context window utilization
- Real-time information processing`,

    base44: `
**BASE44 OPTIMIZATION:**
- Enterprise application development
- Scalable architecture patterns
- Security and compliance features
- Integration capabilities
- Performance optimization`,

    v0: `
**V0 OPTIMIZATION:**
- Component-first development
- Design system integration
- Rapid UI prototyping
- React/Next.js specialization
- Modern frontend patterns`,

    rork: `
**RORK OPTIMIZATION:**
- Mobile-first development
- Cross-platform capabilities
- Native feature integration
- Performance optimization
- User experience focus`
  };

  return corePrompt + (platformOptimizations[platform] || '');
}