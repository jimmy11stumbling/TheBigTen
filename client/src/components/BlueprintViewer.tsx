import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Share, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useStream } from "@/contexts/StreamContext";
import { useToast } from "@/hooks/use-toast";

export function BlueprintViewer() {
  const { streamState } = useStream();
  const { toast } = useToast();

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
        // Use Web Share API if available
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
        // Fallback: copy URL to clipboard
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
    
    // Split content into lines and format for display
    return content.split("\n").map((line, index) => {
      // Handle headers
      if (line.startsWith("# ")) {
        return <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-6">{line.slice(2)}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={index} className="text-xl font-semibold text-gray-800 mb-3 mt-5">{line.slice(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={index} className="text-lg font-semibold text-gray-700 mb-2 mt-4">{line.slice(4)}</h3>;
      }
      
      // Handle code blocks
      if (line.startsWith("```")) {
        return <div key={index} className="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 text-sm overflow-x-auto font-mono">{line}</div>;
      }
      
      // Handle bullet points
      if (line.startsWith("- ")) {
        return <li key={index} className="text-gray-700 mb-1">{line.slice(2)}</li>;
      }
      
      // Handle empty lines
      if (line.trim() === "") {
        return <br key={index} />;
      }
      
      // Regular paragraphs
      return <p key={index} className="text-gray-700 mb-2">{line}</p>;
    });
  };

  return (
    <Card className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">Generated Blueprint</h2>
          {getStatusBadge()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!streamState.content}
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!streamState.content}
            title="Download"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            disabled={!streamState.content}
            title="Share"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Content Area */}
      <CardContent className="p-6 h-full overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        <div className="prose prose-slate max-w-none">
          {streamState.status === "idle" && (
            <div className="text-center text-gray-500 py-12">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-lg">Ready to generate your blueprint</p>
              <p className="text-sm">Enter your app idea and select a platform to get started.</p>
            </div>
          )}
          
          {streamState.status === "error" && (
            <div className="text-center text-red-500 py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Generation Failed</p>
              <p className="text-sm">{streamState.error || "An unexpected error occurred."}</p>
            </div>
          )}
          
          {streamState.content && (
            <div className="space-y-2">
              {formatContent(streamState.content)}
              
              {/* Typing cursor for active generation */}
              {streamState.status === "generating" && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm mt-4">
                  <div className="w-2 h-4 bg-primary animate-pulse"></div>
                  <span className="animate-pulse">Generating...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
