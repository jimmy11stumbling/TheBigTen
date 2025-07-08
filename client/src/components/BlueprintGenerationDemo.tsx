
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Copy, Download, Zap, Code, Database, Shield } from "lucide-react";

const demoContent = [
  { type: "status", content: "Analyzing your requirements..." },
  { type: "header", content: "# Project Architecture Blueprint" },
  { type: "text", content: "\n## Executive Summary\nA comprehensive task management platform with real-time collaboration capabilities." },
  { type: "section", content: "\n## Technology Stack\n" },
  { type: "code", content: "**Frontend:** React + TypeScript + Tailwind CSS\n**Backend:** Node.js + Express + Socket.io\n**Database:** PostgreSQL + Redis\n**Authentication:** JWT + OAuth2.0" },
  { type: "section", content: "\n## Core Features\n" },
  { type: "list", content: "• Real-time task updates\n• Team collaboration tools\n• Advanced permission system\n• File sharing & comments\n• Mobile-responsive design" },
  { type: "section", content: "\n## Security Implementation\n" },
  { type: "code", content: "```typescript\n// JWT Authentication\nconst authMiddleware = (req, res, next) => {\n  const token = req.headers.authorization;\n  // Verify JWT token\n};\n```" },
  { type: "section", content: "\n## Deployment Strategy\n" },
  { type: "text", content: "**Platform:** Replit\n**CI/CD:** GitHub Actions\n**Monitoring:** Built-in analytics" },
  { type: "complete", content: "" }
];

export function BlueprintGenerationDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayContent, setDisplayContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < demoContent.length) {
        const current = demoContent[currentIndex];
        
        if (current.type === "complete") {
          setIsGenerating(false);
          return;
        }

        if (current.type === "status") {
          setDisplayContent(prev => prev);
          setCurrentIndex(prev => prev + 1);
          return;
        }

        const targetText = current.content;
        
        if (currentChar < targetText.length) {
          setDisplayContent(prev => prev + targetText[currentChar]);
          setCurrentChar(prev => prev + 1);
        } else {
          setCurrentChar(0);
          setCurrentIndex(prev => prev + 1);
        }
      } else {
        // Restart the animation
        setTimeout(() => {
          setCurrentIndex(0);
          setDisplayContent("");
          setCurrentChar(0);
          setIsGenerating(true);
        }, 3000);
      }
    }, 50); // Faster typing speed for better visual effect

    return () => clearInterval(interval);
  }, [currentIndex, currentChar]);

  const getCurrentStatus = () => {
    if (currentIndex < demoContent.length) {
      const current = demoContent[currentIndex];
      if (current.type === "status") {
        return current.content;
      }
    }
    
    if (currentIndex < 3) return "Analyzing requirements...";
    if (currentIndex < 6) return "Generating architecture...";
    if (currentIndex < 9) return "Creating security plan...";
    return "Finalizing blueprint...";
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-xl font-bold text-slate-900 mb-3 border-b border-blue-500 pb-2">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-lg font-semibold text-slate-800 mb-2 mt-4">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-semibold text-slate-700 mb-1">
            {line.slice(2, -2)}
          </div>
        );
      } else if (line.startsWith('• ')) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <span className="text-slate-600 text-sm">{line.slice(2)}</span>
          </div>
        );
      } else if (line.startsWith('```')) {
        return <div key={index} className="bg-slate-900 text-green-400 font-mono text-xs p-2 rounded mt-2 mb-2">{line}</div>;
      } else if (line.trim() !== '') {
        return (
          <p key={index} className="text-slate-600 text-sm mb-2 leading-relaxed">
            {line}
          </p>
        );
      }
      return <div key={index} className="h-2" />;
    });
  };

  return (
    <Card className="shadow-2xl border-0 overflow-hidden">
      {/* Enhanced Header with Real-time Status */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">NoCodeLos Generator</span>
          </div>
          <div className="flex items-center space-x-2">
            {isGenerating ? (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Generating
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Input Section */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            Your App Idea:
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-gray-700 font-medium">
              "A task management app with team collaboration features"
            </div>
            <div className="text-xs text-gray-500 mt-1">Platform: Replit</div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <div className="flex space-x-1 mr-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="font-medium">{getCurrentStatus()}</span>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${currentIndex >= 2 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <Code className={`w-4 h-4 ${currentIndex >= 2 ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-xs font-medium">Architecture</span>
            </div>
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${currentIndex >= 5 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <Database className={`w-4 h-4 ${currentIndex >= 5 ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-xs font-medium">Database</span>
            </div>
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${currentIndex >= 7 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <Shield className={`w-4 h-4 ${currentIndex >= 7 ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-xs font-medium">Security</span>
            </div>
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${!isGenerating ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <CheckCircle className={`w-4 h-4 ${!isGenerating ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-xs font-medium">Deploy</span>
            </div>
          </div>
        </div>

        {/* Generated Content with Streaming Effect */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-auto">
          <div className="prose prose-sm max-w-none">
            {formatContent(displayContent)}
            
            {/* Typing Cursor */}
            {isGenerating && (
              <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></span>
            )}
          </div>

          {/* Action Buttons */}
          {!isGenerating && (
            <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        {/* Real-time Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="text-xs">
            <div className="font-semibold text-gray-900">{displayContent.length}</div>
            <div className="text-gray-500">Characters</div>
          </div>
          <div className="text-xs">
            <div className="font-semibold text-gray-900">{Math.ceil(displayContent.length / 5)}</div>
            <div className="text-gray-500">Words</div>
          </div>
          <div className="text-xs">
            <div className="font-semibold text-gray-900">{isGenerating ? 'Live' : 'Complete'}</div>
            <div className="text-gray-500">Status</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
