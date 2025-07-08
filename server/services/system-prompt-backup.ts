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

**CRITICAL CODE REQUIREMENTS:**
- NEVER use [object Object] or any placeholder syntax in SQL schemas
- Write complete SQL CREATE TABLE statements with actual data types
- Every function must contain actual implementation logic with real variables and calculations
- API endpoints must have complete request/response handling code
- React components must have actual JSX and event handlers
- NO [object Object], NO placeholders, NO template syntax in any code output

**CORRECT SQL EXAMPLE:**
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    gender VARCHAR(20),
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

**FORBIDDEN SQL PATTERNS:**
- [object Object] anywhere in SQL
- Template variables like [variable] or placeholders
- Incomplete data type specifications

**BLUEPRINT STRUCTURE:**
1. **Executive Summary** - Project overview and key features
2. **Technical Architecture** - System design and technology stack
3. **Database Design** - Complete SQL schemas with proper data types (VARCHAR, INTEGER, TIMESTAMP)
4. **Backend Implementation** - Complete API endpoints with actual request/response code
5. **Frontend Implementation** - Full React components with real JSX and state management
6. **Deployment Guide** - Step-by-step deployment instructions
7. **Feature Implementation** - Complete business logic with actual algorithms

**FORBIDDEN OUTPUT PATTERNS:**
- [object Object] in any context
- Template placeholders like [variable] or any dynamic content
- Incomplete SQL schemas without proper data types
- Function signatures without implementation bodies
- Generic variable names without actual values

Generate blueprints with complete, executable code that can be immediately implemented.`;

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