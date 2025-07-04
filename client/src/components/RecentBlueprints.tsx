import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Copy, Download, Trash2, Eye, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Blueprint {
  id: string;
  prompt: string;
  content: string;
  platform: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function RecentBlueprints() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blueprints, isLoading, error, refetch } = useQuery<Blueprint[]>({
    queryKey: ["/api/blueprints"],
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  const deleteBlueprintMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/blueprints/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete blueprint");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blueprints"] });
      toast({
        title: "Blueprint deleted",
        description: "The blueprint has been removed from your history.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete the blueprint. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Prompt copied",
        description: "Blueprint prompt has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleCopyBlueprint = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Blueprint copied",
        description: "Full blueprint content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy blueprint to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (blueprint: Blueprint) => {
    const content = `# ${blueprint.prompt}\n\nPlatform: ${blueprint.platform}\nCreated: ${new Date(blueprint.created_at).toLocaleString()}\n\n---\n\n${blueprint.content}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blueprint-${blueprint.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Blueprint is being downloaded as a Markdown file.",
    });
  };

  const handleView = (blueprint: Blueprint) => {
    // Create a new window/tab to display the blueprint
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blueprint: ${blueprint.prompt}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
            .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
            .meta { color: #6b7280; font-size: 14px; margin-top: 10px; }
            pre { background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto; }
            h1, h2, h3 { color: #1f2937; }
            .platform-badge { background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${blueprint.prompt}</h1>
            <div class="meta">
              <span class="platform-badge">${blueprint.platform}</span>
              <span>Created: ${new Date(blueprint.created_at).toLocaleString()}</span>
            </div>
          </div>
          <div id="content"></div>
          <script>
            const content = ${JSON.stringify(blueprint.content)};
            document.getElementById('content').innerHTML = content.replace(/\\n/g, '<br>');
          </script>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Blueprints</h3>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 border border-gray-100 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Blueprints</h3>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center py-8 text-red-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Failed to load blueprints</p>
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="mt-2">
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayBlueprints = blueprints || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Complete</Badge>;
      case "generating":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Generating</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "replit": return "🔶";
      case "cursor": return "🖱️";
      case "lovable": return "❤️";
      case "windsurf": return "🏄‍♀️";
      default: return "💻";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Blueprints</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {displayBlueprints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-sm">No blueprints yet</p>
              <p className="text-xs">Your generated blueprints will appear here</p>
            </div>
          ) : (
            displayBlueprints.map((blueprint) => (
              <div
                key={blueprint.id}
                className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{getPlatformEmoji(blueprint.platform)}</span>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {blueprint.prompt}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(blueprint.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                    {getStatusBadge(blueprint.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(blueprint)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Blueprint
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyPrompt(blueprint.prompt)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Prompt
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyBlueprint(blueprint.content)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Blueprint
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(blueprint)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deleteBlueprintMutation.mutate(blueprint.id)}
                          className="text-red-600"
                          disabled={deleteBlueprintMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleteBlueprintMutation.isPending ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
