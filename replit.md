# BlueprintForge - AI-Powered Technical Blueprint Generator

## Overview

BlueprintForge is an AI-powered web application that transforms simple app concepts into comprehensive, production-ready technical blueprints in real-time. The application leverages modern web technologies to provide streaming blueprint generation with platform-specific optimizations for development environments like Replit, Cursor, Lovable, and Windsurf.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for stream state, TanStack Query for server state
- **UI Components**: Radix UI primitives with custom styling via class-variance-authority

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with schema-first approach
- **Build Tool**: Vite for development and production builds
- **API Design**: RESTful endpoints with Server-Sent Events (SSE) for real-time streaming

### Development Setup
- **Monorepo Structure**: Unified client/server/shared code organization
- **TypeScript**: Full-stack type safety with path mapping
- **Hot Reloading**: Vite development server with HMR
- **Linting/Formatting**: TypeScript compiler for type checking

## Key Components

### Stream Management
- **StreamContext**: React context providing real-time blueprint generation state
- **Server-Sent Events**: Streaming API responses for live blueprint updates
- **Error Recovery**: Robust error handling with automatic retries

### Blueprint Generation
- **AI Integration**: DeepSeek API integration for intelligent blueprint creation
- **Platform Optimization**: Tailored outputs for different development environments with 9/10+ quality targeting
- **Content Streaming**: Real-time markdown content generation and display
- **Quality Validation**: Real-time blueprint quality assessment and enhancement recommendations
- **Adaptive Content**: Platform-specific content strategies based on target audience and use cases

### User Interface
- **BlueprintViewer**: Real-time markdown rendering with syntax highlighting
- **ChatInput**: Form for blueprint prompts with platform selection
- **ProgressIndicator**: Visual feedback during generation process
- **PlatformSelector**: Multi-platform target selection component

### Database Schema
- **Users Table**: User management with UUID primary keys
- **Blueprints Table**: Blueprint storage with user relationships
- **Relational Design**: Proper foreign key constraints and relationships

## Data Flow

1. **User Input**: User submits app idea prompt via ChatInput component
2. **API Request**: POST to `/api/blueprint/generate` with prompt and platform
3. **Stream Initialization**: Server establishes SSE connection for real-time updates
4. **AI Processing**: DeepSeek API generates blueprint content in chunks
5. **Real-time Updates**: Content streams to client via SSE events
6. **Database Storage**: Completed blueprints stored with user associations
7. **UI Updates**: React components update in real-time with streaming content

## External Dependencies

### AI Services
- **DeepSeek API**: Primary AI service for blueprint generation
- **Streaming Support**: Real-time content generation capabilities

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection Pooling**: Managed via @neondatabase/serverless

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent icon system

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the stack
- **Wouter**: Lightweight routing solution

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild compiles server code to `dist/index.js`
- **Single Port**: Express serves both API and static files on port 5000

### Environment Configuration
- **Database**: `DATABASE_URL` environment variable for Neon connection
- **AI API**: DeepSeek API key configuration
- **Development**: Hot reloading with Vite middleware in development mode

### Replit Optimization
- **Port Configuration**: Single port (5000) architecture for Replit hosting
- **File Structure**: Organized for Replit's file system expectations
- **Development Tools**: Replit-specific plugins and configurations

## Changelog

Changelog:
- July 03, 2025: Initial setup of BlueprintForge with real-time streaming
- July 03, 2025: Integrated NoCodeLos Blueprint Engine system prompt for standardized output format
- July 03, 2025: Fixed server-side header errors and database schema implementation
- July 03, 2025: Added user API key management system with settings dialog and local storage
- July 03, 2025: Implemented API key validation and integration with DeepSeek API
- July 04, 2025: Removed hardcoded API keys - users must provide personal DeepSeek API key
- July 04, 2025: Simplified storage interface and removed user authentication for deployment readiness
- July 04, 2025: Increased token limits: 4096 minimum input tokens, 8192 maximum output tokens
- July 04, 2025: Added comprehensive platform-specific databases for tailored blueprint generation
- July 04, 2025: Implemented comprehensive prompt management system with save, load, copy, and delete functionality
- July 04, 2025: Enhanced landing page with functional buttons, comprehensive documentation, and removed pricing section
- July 04, 2025: Added comprehensive Templates tab with 10 popular app templates including e-commerce, social media, dating, LMS, project management, fintech, photo sharing, music streaming, travel planning, and gaming platforms
- July 08, 2025: Enhanced BlueprintForge to achieve 9/10+ quality ratings across ALL platforms with platform-specific optimization strategies, adaptive content generation, and real-time quality validation system
- July 08, 2025: Fixed API key management - removed hardcoded keys, users now provide their own DeepSeek API keys through Settings interface
- July 08, 2025: Enhanced system prompts to prevent [object Object] serialization issues and ensure syntactically correct code generation
- July 08, 2025: Overhauled system prompts to generate REAL IMPLEMENTATION CODE instead of generic placeholders - blueprints must contain actual business logic, not tutorials
- July 08, 2025: CRITICAL FIX: Removed rehypeSanitize from BlueprintViewer that was filtering/altering AI-generated implementation code
- July 08, 2025: Enhanced system prompts with FORBIDDEN PATTERNS section to prevent function signatures without implementations and demand complete function bodies with actual logic
- July 08, 2025: CRITICAL FIX: Removed quality validation system that was interfering with pure AI-generated content - now streams AI content directly without post-processing interference

## User Preferences

Preferred communication style: Simple, everyday language.