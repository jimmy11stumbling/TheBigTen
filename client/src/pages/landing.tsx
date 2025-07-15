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
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Replit",
                    icon: "🔶",
                    description: "Full-stack applications with Nix environments",
                    features: ["Collaborative development", "Built-in hosting", "Nix package management", "Real-time collaboration"]
                  },
                  {
                    name: "Cursor",
                    icon: "🖱️",
                    description: "AI-powered coding with VS Code compatibility",
                    features: ["AI code assistance", "VS Code extensions", "Advanced debugging", "Code completion"]
                  },
                  {
                    name: "Lovable",
                    icon: "❤️",
                    description: "Rapid prototyping with modern tools",
                    features: ["Quick deployment", "Supabase integration", "Security scanning", "Modern frameworks"]
                  },
                  {
                    name: "Windsurf",
                    icon: "🏄‍♀️",
                    description: "Database-heavy applications",
                    features: ["ORM assistance", "Database design", "MCP integrations", "Backend focus"]
                  }
                ].map((platform, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{platform.description}</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {platform.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <ChevronRight className="w-3 h-3 mr-1" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-8">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Terminal className="w-5 h-5 mr-2 text-green-600" />
                      API Endpoints
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <code className="text-sm">POST /api/blueprint/generate</code>
                        <p className="text-sm text-gray-600 mt-2">Generate a new blueprint with streaming response</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <code className="text-sm">GET /api/blueprints</code>
                        <p className="text-sm text-gray-600 mt-2">Retrieve all saved blueprints</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <code className="text-sm">DELETE /api/blueprints/:id</code>
                        <p className="text-sm text-gray-600 mt-2">Delete a specific blueprint</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is the minimum prompt length required?</AccordionTrigger>
                  <AccordionContent>
                    NoCodeLos requires a minimum of 3000 characters in your prompt to ensure comprehensive analysis and detailed blueprint generation. This ensures the AI has enough context to create meaningful technical documentation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Do I need to provide my own API key?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you need to provide your own DeepSeek API key for blueprint generation. This ensures you have full control over your usage and costs. You can get an API key from DeepSeek's platform.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How are my blueprints stored?</AccordionTrigger>
                  <AccordionContent>
                    All blueprints are securely stored in a PostgreSQL database with cross-session persistence. You can access your history anytime, copy content, download files, or delete unwanted blueprints.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I export my blueprints?</AccordionTrigger>
                  <AccordionContent>
                    Yes! You can copy blueprint content to your clipboard, download complete blueprints as Markdown files, or copy just the prompts for reuse. All export options preserve formatting and structure.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Which platforms are supported?</AccordionTrigger>
                  <AccordionContent>
                    NoCodeLos supports Replit, Cursor, Lovable, and Windsurf. Each platform has tailored recommendations based on their unique capabilities, integrations, and development workflows.
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