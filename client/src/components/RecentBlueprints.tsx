import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface Blueprint {
  id: string;
  prompt: string;
  platform: string;
  status: string;
  created_at: string;
}

export function RecentBlueprints() {
  const { data: blueprints, isLoading } = useQuery<Blueprint[]>({
    queryKey: ["/api/blueprints"],
    enabled: false, // Disable for now since we don't have user auth
  });

  // Mock data for demonstration
  const mockBlueprints: Blueprint[] = [
    {
      id: "1",
      prompt: "E-commerce Platform",
      platform: "replit",
      status: "complete",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2", 
      prompt: "Social Media Dashboard",
      platform: "cursor",
      status: "complete",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      prompt: "Learning Management System",
      platform: "lovable", 
      status: "complete",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const displayBlueprints = blueprints || mockBlueprints;

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
                  <div className="ml-2 flex-shrink-0">
                    {getStatusBadge(blueprint.status)}
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
