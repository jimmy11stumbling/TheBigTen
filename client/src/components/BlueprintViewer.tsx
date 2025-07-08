
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Share, CheckCircle, Loader2, AlertCircle, Code } from "lucide-react";
import { useStream } from "@/contexts/StreamContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";

export function BlueprintViewer() {
  const { streamState } = useStream();
  const { toast } = useToast();
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll during generation for smooth experience
  useEffect(() => {
    if (streamState.status === "generating" && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const shouldAutoScroll = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
      
      if (shouldAutoScroll) {
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }, 50);
      }
    }
  }, [streamState.content, streamState.status]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(streamState.content);
      toast({
        title: "Copied to clipboard",
        description: "Blueprint content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleCodeCopy = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
      toast({
        title: "Code copied",
        description: "Code block has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([streamState.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blueprint.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Blueprint is being downloaded as a Markdown file.",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Generated Blueprint",
          text: "Check out this technical blueprint",
          url: window.location.href,
        });
        toast({
          title: "Shared successfully",
          description: "Blueprint has been shared.",
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Blueprint link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to share the blueprint.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    switch (streamState.status) {
      case "generating":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Generating
          </Badge>
        );
      case "complete":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Complete
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatContent = (content: string) => {
    if (!content) return "";
    
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let codeBlockLanguage = "";
    let codeBlockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle code block start/end
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          // Starting code block
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim();
          currentCodeBlock = [];
        } else {
          // Ending code block
          inCodeBlock = false;
          const codeContent = currentCodeBlock.join("\n");
          elements.push(
            <div key={`code-${i}-${codeBlockIndex}`} className="relative group my-6">
              <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                {/* Code block header */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300 font-medium">
                      {codeBlockLanguage || "Code"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCodeCopy(codeContent, codeBlockIndex)}
                    className="h-7 text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    {copiedCodeIndex === codeBlockIndex ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                {/* Code content */}
                <pre className="p-4 text-sm text-slate-100 overflow-x-auto">
                  <code className="font-mono">{codeContent}</code>
                </pre>
              </div>
            </div>
          );
          codeBlockIndex++;
          currentCodeBlock = [];
        }
        continue;
      }

      if (inCodeBlock) {
        currentCodeBlock.push(line);
        continue;
      }

      // Handle headers with better styling
      if (line.startsWith("# ")) {
        elements.push(
          <div key={i} className="my-8 first:mt-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-4 pb-3 border-b-2 border-blue-500">
              {line.slice(2)}
            </h1>
          </div>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <div key={i} className="my-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-200">
              {line.slice(3)}
            </h2>
          </div>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold text-slate-700 mb-3 mt-6">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={i} className="text-lg font-medium text-slate-600 mb-2 mt-4">
            {line.slice(5)}
          </h4>
        );
      }
      // Handle bullet points with better styling
      else if (line.startsWith("- ")) {
        elements.push(
          <div key={i} className="flex items-start space-x-3 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700 leading-relaxed">{line.slice(2)}</p>
          </div>
        );
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          elements.push(
            <div key={i} className="flex items-start space-x-3 mb-2">
              <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                {match[1]}
              </div>
              <p className="text-slate-700 leading-relaxed">{match[2]}</p>
            </div>
          );
        }
      }
      // Handle inline code
      else if (line.includes("`") && !line.startsWith("```")) {
        const parts = line.split(/(`[^`]+`)/);
        const formattedParts = parts.map((part, index) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code key={index} className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });
        elements.push(
          <p key={i} className="text-slate-700 mb-3 leading-relaxed">
            {formattedParts}
          </p>
        );
      }
      // Handle bold text
      else if (line.includes("**")) {
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        const formattedParts = parts.map((part, index) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={index} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
        elements.push(
          <p key={i} className="text-slate-700 mb-3 leading-relaxed">
            {formattedParts}
          </p>
        );
      }
      // Handle empty lines
      else if (line.trim() === "") {
        elements.push(<div key={i} className="h-4" />);
      }
      // Regular paragraphs
      else if (line.trim() !== "") {
        elements.push(
          <p key={i} className="text-slate-700 mb-3 leading-relaxed">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <Card className="h-full shadow-lg flex flex-col">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Generated Blueprint</h2>
            <p className="text-xs text-slate-600">Production-ready technical documentation</p>
          </div>
          {getStatusBadge()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!streamState.content}
            title="Copy entire blueprint"
            className="hover:bg-blue-100"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!streamState.content}
            title="Download as Markdown"
            className="hover:bg-blue-100"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            disabled={!streamState.content}
            title="Share blueprint"
            className="hover:bg-blue-100"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Enhanced Content Area - Much Larger */}
      <CardContent 
        ref={scrollContainerRef}
        className="p-0 flex-1 overflow-auto bg-white scroll-smooth" 
        style={{ minHeight: "calc(100vh - 300px)", maxHeight: "calc(100vh - 120px)" }}
      >
        <div className="p-6">
          {streamState.status === "idle" && (
            <div className="text-center text-slate-500 py-20">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <div className="text-4xl">📋</div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Generate</h3>
              <p className="text-lg text-slate-600 mb-2">Your technical blueprint awaits</p>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Enter your app idea and select a platform to generate a comprehensive 
                technical blueprint with architecture diagrams, code snippets, and deployment guides.
              </p>
            </div>
          )}
          
          {streamState.status === "error" && (
            <div className="text-center text-red-500 py-20">
              <div className="w-20 h-20 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Generation Failed</h3>
              <p className="text-red-700 bg-red-50 rounded-lg p-4 max-w-md mx-auto">
                {streamState.error || "An unexpected error occurred. Please try again."}
              </p>
            </div>
          )}
          
          {streamState.content && (
            <div className="max-w-none">
              <div className="space-y-1">
                {formatContent(streamState.content)}
              </div>
              
              {/* Enhanced typing cursor for active generation */}
              {streamState.status === "generating" && (
                <div className="flex items-center space-x-3 mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-blue-700 font-medium">Generating your blueprint...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
