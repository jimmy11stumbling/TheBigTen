import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Rocket, Building2, Heart, Gamepad2, ShoppingCart, Users } from "lucide-react";

const templates = [
  {
    id: "saas-dashboard",
    title: "SaaS Dashboard",
    description: "Complete admin dashboard with analytics, user management, and billing integration",
    icon: Building2,
    tags: ["React", "TypeScript", "Dashboard"],
    complexity: "Advanced",
    estimatedTime: "2-3 weeks"
  },
  {
    id: "e-commerce",
    title: "E-Commerce Platform", 
    description: "Full-featured online store with cart, payments, and inventory management",
    icon: ShoppingCart,
    tags: ["E-commerce", "Payments", "Inventory"],
    complexity: "Advanced",
    estimatedTime: "3-4 weeks"
  },
  {
    id: "social-media",
    title: "Social Media App",
    description: "Social platform with posts, comments, real-time chat, and user profiles",
    icon: Users,
    tags: ["Social", "Real-time", "Chat"],
    complexity: "Intermediate",
    estimatedTime: "2-3 weeks"
  },
  {
    id: "dating-app",
    title: "Dating Application",
    description: "Modern dating app with matching algorithms, chat, and profile management",
    icon: Heart,
    tags: ["Dating", "Matching", "Chat"],
    complexity: "Intermediate", 
    estimatedTime: "2-3 weeks"
  },
  {
    id: "gaming-platform",
    title: "Gaming Community",
    description: "Gaming platform with tournaments, leaderboards, and social features",
    icon: Gamepad2,
    tags: ["Gaming", "Community", "Competition"],
    complexity: "Advanced",
    estimatedTime: "3-4 weeks"
  },
  {
    id: "productivity",
    title: "Productivity Suite",
    description: "Task management, calendar, notes, and team collaboration tools",
    icon: Zap,
    tags: ["Productivity", "Tasks", "Team"],
    complexity: "Intermediate",
    estimatedTime: "2 weeks"
  }
];

interface TemplatesProps {
  onSelectTemplate: (template: string) => void;
}

export function Templates({ onSelectTemplate }: TemplatesProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => {
        const IconComponent = template.icon;
        return (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={getComplexityColor(template.complexity)}>
                      {template.complexity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {template.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="mb-3 text-sm">
                {template.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags && template.tags.length > 0 ? template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                )) : null}
              </div>
              <Button 
                onClick={() => onSelectTemplate(`Build a ${template.title.toLowerCase()}: ${template.description}`)}
                className="w-full"
                variant="outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}