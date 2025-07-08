import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Platform } from "@/lib/types";

interface Template {
  id: string;
  title: string;
  description: string;
  tags: string[];
  prompt: string;
  platform: Platform;
}

interface TemplatesProps {
  onUseTemplate: (prompt: string, platform: Platform) => void;
}

export function Templates({ onUseTemplate }: TemplatesProps) {
  const templates: Template[] = [
    {
      id: "1",
      title: "E-commerce Store",
      description: "Full-featured online store with cart, payments, and admin panel",
      tags: ["React", "Node.js", "Stripe", "Database"],
      prompt: "Build a complete e-commerce store with product catalog, shopping cart, user authentication, payment processing via Stripe, order management, and admin dashboard. Include inventory tracking, search functionality, and responsive design.",
      platform: "replit"
    },
    {
      id: "2",
      title: "Social Media App",
      description: "Twitter-like social platform with posts, follows, and real-time updates",
      tags: ["React", "WebSocket", "Database", "Authentication"],
      prompt: "Create a social media platform where users can create posts, follow other users, like and comment on posts, receive real-time notifications, and have a personalized feed. Include user profiles, image uploads, and trending topics.",
      platform: "cursor"
    },
    {
      id: "3",
      title: "Task Management App",
      description: "Collaborative project management tool with teams and boards",
      tags: ["Vue.js", "Drag & Drop", "Teams", "Real-time"],
      prompt: "Build a comprehensive task management application with team collaboration, project boards, drag-and-drop task organization, deadline tracking, file attachments, team chat, and progress analytics.",
      platform: "lovable"
    },
    {
      id: "4",
      title: "Learning Management System",
      description: "Online education platform with courses, quizzes, and progress tracking",
      tags: ["React", "Video", "Quizzes", "Progress"],
      prompt: "Develop an LMS platform where instructors can create courses with video lessons, quizzes, assignments, and track student progress. Include student dashboards, certificate generation, and discussion forums.",
      platform: "windsurf"
    },
    {
      id: "5",
      title: "Restaurant Ordering System",
      description: "Complete restaurant management with online ordering and POS",
      tags: ["React", "QR Codes", "Payments", "Kitchen"],
      prompt: "Create a restaurant management system with QR code menu ordering, kitchen order management, payment processing, table reservations, inventory tracking, and customer loyalty programs.",
      platform: "bolt"
    },
    {
      id: "6",
      title: "Fitness Tracking App",
      description: "Personal fitness app with workouts, nutrition, and progress analytics",
      tags: ["React Native", "Charts", "Health", "Social"],
      prompt: "Build a fitness application with workout planning, exercise tracking, nutrition logging, progress charts, social challenges, and integration with fitness devices.",
      platform: "gemini"
    }
  ];

  const handleUseTemplate = (template: Template) => {
    onUseTemplate(template.prompt, template.platform);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Blueprint Templates</h2>
        <p className="text-gray-600">Get started quickly with pre-built project templates</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {(template.tags || []).slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {(template.tags || []).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(template.tags || []).length - 3} more
                  </Badge>
                )}
              </div>

              <Button 
                onClick={() => handleUseTemplate(template)} 
                className="w-full"
                size="sm"
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}