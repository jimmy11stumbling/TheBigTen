import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
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
  Play
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Real-time Generation",
      description: "Watch your blueprint generate line by line with Server-Sent Events streaming for immediate feedback and iteration.",
      badge: "⚡ Sub-second response times"
    },
    {
      icon: <Code className="w-6 h-6 text-emerald-600" />,
      title: "Platform-Specific Output", 
      description: "Generate blueprints optimized for Replit, Cursor, Lovable, or Windsurf development environments.",
      badge: "🎯 Tailored for your workflow"
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "AI-Powered Intelligence",
      description: "Leverages DeepSeek Reasoner with Claude fallback for robust, intelligent blueprint generation.",
      badge: "🧠 Advanced reasoning capabilities"
    },
    {
      icon: <History className="w-6 h-6 text-orange-600" />,
      title: "Blueprint History",
      description: "Store, organize, and retrieve all your generated blueprints with full-text search and categorization.",
      badge: "📚 Never lose an idea again"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "Error Recovery",
      description: "Robust error handling with automatic retries and intelligent fallback mechanisms.",
      badge: "🛡️ 99.9% reliability guarantee"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-purple-600" />,
      title: "Mobile Responsive",
      description: "Generate and review blueprints on any device with our mobile-first responsive design.",
      badge: "📱 Works everywhere"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Compass className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">BlueprintForge</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link href="/app">
                <Button className="bg-primary hover:bg-primary/90">
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
                <Button variant="outline" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* AI Blueprint generation visualization mockup */}
              <Card className="shadow-2xl border-0">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-500 ml-4">BlueprintForge Generator</span>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Your App Idea:</div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                      "A task management app with team collaboration features"
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                      Generating technical specifications...
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs">
                      <div className="text-green-600"># Project Architecture</div>
                      <div className="text-gray-700">Frontend: React + TypeScript</div>
                      <div className="text-gray-700">Backend: Node.js + Express</div>
                      <div className="text-gray-700">Database: PostgreSQL...</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              Powered by advanced AI, BlueprintForge generates comprehensive technical documentation that development teams can immediately act upon.
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
                  <div className="text-sm text-primary font-medium">{feature.badge}</div>
                </CardContent>
              </Card>
            ))}
          </div>
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
