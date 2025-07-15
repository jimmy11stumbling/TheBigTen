import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { BlueprintGenerationDemo } from "@/components/BlueprintGenerationDemo";
import { 
  Zap, 
  Code, 
  Brain, 
  History, 
  Shield, 
  Smartphone,
  Compass,
  ArrowRight,
  Rocket,
  Play,
  Download,
  Copy,
  Settings,
  FileText,
  Globe,
  Database,
  GitBranch,
  Layers,
  Terminal,
  BookOpen,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function Landing() {
  const [activeTab, setActiveTab] = useState("features");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Real-time Generation",
      description: "Watch your blueprint generate line by line with Server-Sent Events streaming for immediate feedback and iteration.",
      details: "Our streaming technology provides instant visual feedback as your blueprint is generated. No waiting for complete responses - see your ideas take shape in real-time with sub-second response times.",
      techSpecs: ["Server-Sent Events (SSE)", "WebSocket fallback", "Real-time error handling", "Progress indicators"]
    },
    {
      icon: <Code className="w-6 h-6 text-emerald-600" />,
      title: "Platform-Specific Output", 
      description: "Generate blueprints optimized for Replit, Cursor, Lovable, or Windsurf development environments.",
      details: "Each platform has unique capabilities, integrations, and workflows. Our system tailors blueprint recommendations to match your chosen platform's strengths and limitations.",
      techSpecs: ["Replit: Full-stack apps with Nix", "Cursor: VS Code + AI assistance", "Lovable: Rapid prototyping", "Windsurf: Database-heavy apps"]
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "AI-Powered Intelligence",
      description: "Leverages DeepSeek Reasoner for advanced reasoning and comprehensive blueprint generation.",
      details: "Our AI system uses the latest DeepSeek Reasoner model with advanced reasoning capabilities to understand complex requirements and generate detailed technical specifications.",
      techSpecs: ["DeepSeek Reasoner integration", "Context-aware generation", "Technical debt analysis", "Architecture recommendations"]
    },
    {
      icon: <History className="w-6 h-6 text-orange-600" />,
      title: "Blueprint History & Management",
      description: "Store, organize, and retrieve all your generated blueprints with comprehensive management tools.",
      details: "Never lose track of your ideas. Our history system provides full blueprint management with search, categorization, and easy retrieval of past projects.",
      techSpecs: ["Persistent storage", "Full-text search", "Blueprint versioning", "Export capabilities"]
    },
    {
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "Robust Error Handling",
      description: "Comprehensive error recovery with automatic retries and intelligent fallback mechanisms.",
      details: "Built for reliability with graceful error handling, automatic retries, and clear user feedback when issues occur.",
      techSpecs: ["Automatic retry logic", "Graceful degradation", "User-friendly error messages", "Connection recovery"]
    },
    {
      icon: <Database className="w-6 h-6 text-blue-600" />,
      title: "Data Management",
      description: "Secure data handling with PostgreSQL database and comprehensive blueprint management.",
      details: "Enterprise-grade data storage with PostgreSQL, ensuring your blueprints are safely stored and easily accessible across sessions.",
      techSpecs: ["PostgreSQL database", "Secure data handling", "Cross-session persistence", "Export capabilities"]
    }
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: "Describe Your App Idea",
      description: "Write a detailed description of your app concept (minimum 3000 characters for comprehensive analysis).",
      details: "Provide as much detail as possible about your app's functionality, target audience, key features, and technical requirements. The more context you provide, the better your blueprint will be.",
      tips: ["Include target audience details", "Describe core functionality", "Mention technical preferences", "Add business requirements"],
      icon: <FileText className="w-8 h-8 text-primary" />
    },
    {
      step: 2,
      title: "Select Target Platform",
      description: "Choose from 10 leading development platforms: Replit, Cursor, Lovable, Windsurf, Bolt, Claude, Gemini, Base44, V0, and Rork.",
      details: "Each platform has unique capabilities, integrations, and workflows. Our AI tailors blueprint recommendations to match your chosen platform's strengths and limitations.",
      tips: ["Replit: Full-stack collaboration", "Cursor: AI-powered coding", "Lovable: Rapid prototyping", "Windsurf: Database-heavy apps", "Bolt: In-browser development", "Claude: Security-first CLI"],
      icon: <Compass className="w-8 h-8 text-emerald-600" />
    },
    {
      step: 3,
      title: "AI Hybrid PRD+Blueprint Generation",
      description: "Watch as our AI generates a comprehensive hybrid document that combines product requirements with detailed technical implementation in real-time.",
      details: "Using DeepSeek Reasoner, we create documents that include product vision, user stories, business goals alongside technical architecture, implementation phases, and deployment strategies - all in one cohesive document.",
      tips: ["Product + Engineering alignment", "Real-time streaming generation", "Platform-specific recommendations", "Security & scalability planning"],
      icon: <Brain className="w-8 h-8 text-purple-600" />
    },
    {
      step: 4,
      title: "Review & Export",
      description: "Review your blueprint, copy content, download files, and save for future reference.",
      details: "Your generated blueprint includes architecture decisions, technology stack recommendations, implementation phases, and deployment strategies.",
      tips: ["Copy to clipboard", "Download as Markdown", "Save to history", "Share with team"],
      icon: <Download className="w-8 h-8 text-orange-600" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <img 
                    src="/attached_assets/favicon_1752548937275.ico" 
                    alt="NoCodeLos Logo" 
                    className="w-8 h-8 rounded-lg"
                  />
                  <h1 className="text-xl font-bold text-gray-900 font-inter">NoCodeLos</h1>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('documentation')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Documentation
              </button>
              <Link href="/app">
                <Button className="bg-primary hover:bg-primary/90">
                  <Rocket className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </nav>
            <button className="md:hidden">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  App Ideas
                </span>{" "}
                Into Production Blueprints
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                AI-powered blueprint generation that turns your simple app concept into comprehensive technical specifications, architecture diagrams, and development roadmaps in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/app">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
                    Start Building Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  See How It Works
                </Button>
              </div>
            </div>
            <div className="relative">
              <BlueprintGenerationDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Go From Idea to Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by advanced AI, NoCodeLos generates comprehensive technical documentation that development teams can immediately act upon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Technical Details:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {feature.techSpecs.map((spec, specIndex) => (
                        <li key={specIndex} className="flex items-center">
                          <ChevronRight className="w-3 h-3 mr-1" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How NoCodeLos Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea to production-ready hybrid PRD+Blueprint in four simple steps. Our AI generates comprehensive documents that fuse product requirements with technical implementation across 10 leading development platforms.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">What Makes Our Approach Unique</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Traditional workflows separate PRDs (Product Requirements Documents) from technical blueprints, causing misalignment and delays. 
                NoCodeLos generates <strong>hybrid documents</strong> that combine product vision, user requirements, business goals, and detailed technical specifications 
                in one cohesive document. This eliminates documentation drift and ensures product and engineering teams work from the same source of truth.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow relative">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs">
                      Step {step.step}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 mb-4 text-center">{step.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Key Points:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <ChevronRight className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="documentation" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Documentation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about using NoCodeLos effectively, from basic usage to advanced features.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">Features Guide</TabsTrigger>
              <TabsTrigger value="platforms">Platform Guide</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-primary" />
                      Real-time Streaming
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Our Server-Sent Events (SSE) technology provides instant feedback as your blueprint generates.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Technical Implementation:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• WebSocket fallback for reliability</li>
                        <li>• Real-time error handling</li>
                        <li>• Progress indicators</li>
                        <li>• Connection recovery</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <History className="w-5 h-5 mr-2 text-orange-600" />
                      Blueprint Management
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comprehensive history and management features for all your generated blueprints.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Available Actions:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• View full blueprint in new window</li>
                        <li>• Copy prompts or content to clipboard</li>
                        <li>• Download as Markdown files</li>
                        <li>• Delete unwanted blueprints</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="platforms" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {[
                  {
                    name: "Replit",
                    icon: "🔶",
                    description: "Full-stack collaborative development with Nix environments",
                    features: ["Real-time collaboration", "Built-in hosting", "Nix package management", "Multi-language support"]
                  },
                  {
                    name: "Cursor",
                    icon: "🖱️",
                    description: "AI-first code editor with VS Code compatibility",
                    features: ["AI code assistance", "VS Code extensions", "Advanced debugging", "Context-aware suggestions"]
                  },
                  {
                    name: "Lovable",
                    icon: "❤️",
                    description: "Rapid prototyping with modern frameworks",
                    features: ["Quick deployment", "Supabase integration", "Security scanning", "React/Next.js focus"]
                  },
                  {
                    name: "Windsurf",
                    icon: "🏄‍♀️",
                    description: "Agentic IDE optimized for database-heavy applications",
                    features: ["ORM assistance", "Database design", "MCP integrations", "Backend optimization"]
                  },
                  {
                    name: "Bolt",
                    icon: "⚡",
                    description: "Full-stack development entirely in the browser",
                    features: ["In-browser development", "No local setup", "WebContainer technology", "Instant deployment"]
                  },
                  {
                    name: "Claude",
                    icon: "🤖",
                    description: "Security-first CLI coding agent by Anthropic",
                    features: ["Security-focused", "CLI integration", "Code analysis", "Safe deployment practices"]
                  },
                  {
                    name: "Gemini",
                    icon: "💎",
                    description: "Open-source terminal AI agent for development",
                    features: ["Terminal integration", "Open-source", "Multi-model support", "Developer-centric"]
                  },
                  {
                    name: "Base44",
                    icon: "🏗️",
                    description: "No-code full-stack application builder",
                    features: ["Visual development", "No-code approach", "Full-stack capabilities", "Rapid prototyping"]
                  },
                  {
                    name: "V0",
                    icon: "🎨",
                    description: "UI component generator by Vercel",
                    features: ["Component generation", "Vercel ecosystem", "React components", "Design to code"]
                  },
                  {
                    name: "Rork",
                    icon: "📱",
                    description: "Mobile-first application generator",
                    features: ["Mobile optimization", "Cross-platform", "Native features", "App store ready"]
                  }
                ].map((platform, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-2xl mb-2 text-center">{platform.icon}</div>
                      <h3 className="text-lg font-semibold mb-2 text-center">{platform.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">{platform.description}</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {platform.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Platform Selection Guide</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <h4 className="font-semibold mb-2">Choose Replit/Cursor/Windsurf for:</h4>
                    <ul className="space-y-1">
                      <li>• Complex full-stack applications</li>
                      <li>• Team collaboration needs</li>
                      <li>• Custom backend requirements</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Choose Lovable/Bolt/V0 for:</h4>
                    <ul className="space-y-1">
                      <li>• Rapid prototyping</li>
                      <li>• Frontend-focused projects</li>
                      <li>• Quick deployment needs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-8">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Terminal className="w-5 h-5 mr-2 text-green-600" />
                      Blueprint API Endpoints
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">POST /api/blueprint/generate</code>
                        <p className="text-sm text-gray-600 mt-2">Generate a new hybrid PRD+Blueprint with Server-Sent Events streaming</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <strong>Body:</strong> {"{ prompt, platform, user_id?, apiKey? }"}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">GET /api/blueprints</code>
                        <p className="text-sm text-gray-600 mt-2">Retrieve all saved blueprints with metadata</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">GET /api/blueprints/:id</code>
                        <p className="text-sm text-gray-600 mt-2">Get a specific blueprint by ID</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">DELETE /api/blueprints/:id</code>
                        <p className="text-sm text-gray-600 mt-2">Delete a specific blueprint permanently</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">POST /api/test-api-key</code>
                        <p className="text-sm text-gray-600 mt-2">Validate DeepSeek API key before generation</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <strong>Body:</strong> {"{ apiKey }"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-600" />
                      Analytics & System Endpoints
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">GET /api/analytics/metrics</code>
                        <p className="text-sm text-gray-600 mt-2">Get usage metrics and platform statistics</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">GET /api/analytics/health</code>
                        <p className="text-sm text-gray-600 mt-2">System health check and status</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">POST /api/analytics/track</code>
                        <p className="text-sm text-gray-600 mt-2">Track custom events for analytics</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <strong>Body:</strong> {"{ event, userId?, properties? }"}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <code className="text-sm font-bold">GET /api/debug/system-prompt/:platform</code>
                        <p className="text-sm text-gray-600 mt-2">Debug endpoint to inspect system prompts by platform</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-purple-600" />
                      Authentication & Error Handling
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start space-x-3">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-purple-600" />
                        <div>
                          <strong>API Key:</strong> DeepSeek API key required for blueprint generation
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-purple-600" />
                        <div>
                          <strong>Streaming:</strong> Real-time updates via Server-Sent Events (SSE)
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-purple-600" />
                        <div>
                          <strong>Error Recovery:</strong> Automatic retries and graceful fallbacks
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-purple-600" />
                        <div>
                          <strong>CORS:</strong> Cross-origin requests enabled for web integration
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is the minimum prompt length required and why?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>NoCodeLos requires a minimum of 3000 characters in your prompt to ensure comprehensive analysis and detailed blueprint generation. This threshold is necessary because:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><strong>Context Depth:</strong> Our AI needs substantial context to understand your app's complexity, target audience, and business requirements</li>
                        <li><strong>Technical Accuracy:</strong> Detailed descriptions enable precise technology stack recommendations and architectural decisions</li>
                        <li><strong>Quality Assurance:</strong> Longer prompts result in more accurate PRD+Blueprint fusion with fewer assumptions</li>
                        <li><strong>Platform Optimization:</strong> Sufficient detail allows for better platform-specific customization across all 10 supported platforms</li>
                      </ul>
                      <p className="text-sm text-gray-600">Pro tip: Include user stories, technical preferences, scalability requirements, and integration needs for best results.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Do I need to provide my own API key and what are the costs?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Yes, you need to provide your own DeepSeek API key for blueprint generation. Here's what you need to know:</p>
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-blue-900">DeepSeek Pricing (Very Affordable):</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• <strong>Input:</strong> $0.14 per million tokens (~750,000 words)</li>
                          <li>• <strong>Output:</strong> $0.28 per million tokens (~750,000 words)</li>
                          <li>• <strong>Typical Blueprint Cost:</strong> $0.10-0.30 per generation</li>
                          <li>• <strong>Free Credits:</strong> $5 free credits for new users</li>
                        </ul>
                      </div>
                      <p className="text-sm">This approach ensures you have full control over usage, costs, and API rate limits. Get your key at <a href="https://platform.deepseek.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">platform.deepseek.com</a></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How are my blueprints stored and is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Your data security and privacy are our top priorities:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Storage & Security:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• PostgreSQL database with encryption</li>
                            <li>• Cross-session persistence</li>
                            <li>• User-specific access controls</li>
                            <li>• No sharing without permission</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Data Management:</h4>
                          <ul className="text-sm text-purple-800 space-y-1">
                            <li>• Full deletion capabilities</li>
                            <li>• Export all your data anytime</li>
                            <li>• No vendor lock-in</li>
                            <li>• GDPR-compliant practices</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Your API keys are never stored - they're only used during active sessions for generation requests.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What export and sharing options are available?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>NoCodeLos provides comprehensive export capabilities for maximum flexibility:</p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-orange-900 mb-2">Quick Actions:</h4>
                          <ul className="text-sm text-orange-800 space-y-1">
                            <li>• Copy to clipboard</li>
                            <li>• Copy prompts only</li>
                            <li>• One-click sharing</li>
                            <li>• Print-friendly view</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">File Downloads:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Markdown (.md) files</li>
                            <li>• Structured formatting</li>
                            <li>• Preserved syntax highlighting</li>
                            <li>• Platform-ready format</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Team Collaboration:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Share blueprint URLs</li>
                            <li>• Team workspace access</li>
                            <li>• Version control friendly</li>
                            <li>• Documentation integration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Which platforms are supported and how do I choose the right one?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>NoCodeLos supports 10 leading development platforms, each optimized for different use cases:</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Full-Stack Platforms:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li><strong>Replit:</strong> Collaborative development, Nix environments</li>
                            <li><strong>Cursor:</strong> AI-first coding with VS Code compatibility</li>
                            <li><strong>Windsurf:</strong> Database-heavy apps with ORM assistance</li>
                            <li><strong>Claude:</strong> Security-first development with CLI focus</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Rapid Development:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li><strong>Lovable:</strong> Quick prototyping with modern frameworks</li>
                            <li><strong>Bolt:</strong> In-browser development, no setup needed</li>
                            <li><strong>V0:</strong> UI component generation by Vercel</li>
                            <li><strong>Base44:</strong> No-code full-stack applications</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Specialized Platforms:</h4>
                          <ul className="text-sm text-purple-800 space-y-1">
                            <li><strong>Gemini:</strong> Open-source terminal AI development</li>
                            <li><strong>Rork:</strong> Mobile-first application generation</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-2">Platform Selection Guide:</h4>
                        <p className="text-sm text-yellow-800">Choose based on your project needs: complex full-stack apps (Replit/Cursor), rapid prototyping (Lovable/Bolt), mobile apps (Rork), or no-code solutions (Base44). Each blueprint is tailored to your chosen platform's capabilities.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>What makes NoCodeLos different from other blueprint generators?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>NoCodeLos pioneered the hybrid PRD+Blueprint approach, solving critical industry problems:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-red-900 mb-2">Industry Problems We Solve:</h4>
                          <ul className="text-sm text-red-800 space-y-1">
                            <li>• Product-Engineering misalignment</li>
                            <li>• Documentation drift and inconsistency</li>
                            <li>• Separate PRD and technical specs</li>
                            <li>• Platform-agnostic generic outputs</li>
                            <li>• Static documentation without updates</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Our Unique Solutions:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Unified PRD+Blueprint documents</li>
                            <li>• Real-time streaming generation</li>
                            <li>• Platform-specific optimization</li>
                            <li>• Advanced AI reasoning (DeepSeek)</li>
                            <li>• Complete blueprint management system</li>
                          </ul>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800"><strong>Result:</strong> Teams get one cohesive document containing both business requirements and technical implementation, eliminating the traditional gap between product and engineering teams.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>How does the real-time streaming work and what are the benefits?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Our streaming technology provides immediate feedback during blueprint generation:</p>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <h4 className="font-semibold text-gray-900">Technical Implementation:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• <strong>Server-Sent Events (SSE):</strong> Real-time content streaming</li>
                          <li>• <strong>WebSocket Fallback:</strong> Ensures reliability across networks</li>
                          <li>• <strong>Progressive Rendering:</strong> See content as it's generated</li>
                          <li>• <strong>Error Recovery:</strong> Automatic retries and graceful handling</li>
                          <li>• <strong>Connection Management:</strong> Robust reconnection logic</li>
                        </ul>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">User Benefits:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Immediate visual feedback</li>
                            <li>• No waiting for complete responses</li>
                            <li>• Early problem detection</li>
                            <li>• Interactive experience</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Performance:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Sub-second response times</li>
                            <li>• Reduced perceived latency</li>
                            <li>• Better user engagement</li>
                            <li>• Mobile-optimized streaming</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>Can I customize the generated blueprints and enhance them?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Yes! NoCodeLos provides multiple ways to customize and enhance your blueprints:</p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">During Generation:</h4>
                          <ul className="text-sm text-purple-800 space-y-1">
                            <li>• Detailed prompt engineering</li>
                            <li>• Platform-specific requirements</li>
                            <li>• Technical preferences specification</li>
                            <li>• Business constraint definition</li>
                          </ul>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-orange-900 mb-2">Post-Generation:</h4>
                          <ul className="text-sm text-orange-800 space-y-1">
                            <li>• Copy and edit in external tools</li>
                            <li>• Markdown format for easy editing</li>
                            <li>• Version control integration</li>
                            <li>• Team collaboration features</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Enhancement Tools:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Quality assessment metrics</li>
                            <li>• Best practice recommendations</li>
                            <li>• Security review suggestions</li>
                            <li>• Scalability analysis</li>
                          </ul>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800"><strong>Pro Tip:</strong> Include specific technical requirements, team constraints, and business goals in your initial prompt for more targeted blueprints that require less post-generation editing.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>Is there a free tier or trial available?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>NoCodeLos offers flexible access options designed to get you started quickly:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-2">Platform Access:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• <strong>NoCodeLos Platform:</strong> Completely free</li>
                            <li>• <strong>No Registration Required:</strong> Start immediately</li>
                            <li>• <strong>Full Feature Access:</strong> All capabilities available</li>
                            <li>• <strong>No Usage Limits:</strong> Generate unlimited blueprints</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2">DeepSeek API Costs:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• <strong>New Users:</strong> $5 free credits</li>
                            <li>• <strong>Per Blueprint:</strong> ~$0.10-0.30</li>
                            <li>• <strong>Monthly Usage:</strong> ~$5-15 for regular use</li>
                            <li>• <strong>Enterprise:</strong> Volume discounts available</li>
                          </ul>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-2">Getting Started:</h4>
                        <p className="text-sm text-yellow-800">
                          1. Access NoCodeLos for free • 2. Get DeepSeek API key with $5 credits • 3. Generate 15-50 blueprints with free credits • 4. Pay only for additional AI usage as needed
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>What technical requirements and browser support does NoCodeLos have?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>NoCodeLos is designed to work across modern browsers and devices with minimal requirements:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Browser Support:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• <strong>Chrome/Chromium:</strong> Full support (recommended)</li>
                            <li>• <strong>Firefox:</strong> Full support</li>
                            <li>• <strong>Safari:</strong> Full support</li>
                            <li>• <strong>Edge:</strong> Full support</li>
                            <li>• <strong>Mobile Browsers:</strong> Optimized experience</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">System Requirements:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• <strong>Internet:</strong> Stable connection required</li>
                            <li>• <strong>JavaScript:</strong> Must be enabled</li>
                            <li>• <strong>Local Storage:</strong> For settings and preferences</li>
                            <li>• <strong>RAM:</strong> 2GB+ recommended</li>
                            <li>• <strong>No Plugins:</strong> Runs entirely in browser</li>
                          </ul>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Features Requiring Support:</h4>
                          <ul className="text-sm text-purple-800 space-y-1">
                            <li>• <strong>Server-Sent Events:</strong> For real-time streaming</li>
                            <li>• <strong>WebSocket:</strong> Fallback for streaming</li>
                            <li>• <strong>Clipboard API:</strong> For copy functionality</li>
                            <li>• <strong>File Download:</strong> For blueprint exports</li>
                          </ul>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-orange-900 mb-2">Performance Notes:</h4>
                          <ul className="text-sm text-orange-800 space-y-1">
                            <li>• Works offline for viewing saved blueprints</li>
                            <li>• Optimized for mobile devices</li>
                            <li>• Progressive loading for large blueprints</li>
                            <li>• Cached assets for faster load times</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Ideas Into Reality?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who are shipping faster with AI-generated blueprints.
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-50 shadow-lg">
              Start Building Your Blueprint
              <Rocket className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}