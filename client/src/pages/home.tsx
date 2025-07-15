import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { BlueprintViewer } from "@/components/BlueprintViewer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RecentBlueprints } from "@/components/RecentBlueprints";
import { Templates } from "@/components/Templates";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useSettings } from "@/contexts/SettingsContext";
import { useStream } from "@/contexts/StreamContext";
import { Platform } from "@/lib/types";
import { 
  Compass, 
  Settings, 
  User,
  Home,
  History,
  LayoutTemplate
} from "lucide-react";

export default function HomePage() {
  const { hasApiKey } = useSettings();
  const { generateBlueprint } = useStream();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("generator");

  const handleUseTemplate = async (prompt: string, platform: Platform) => {
    setActiveTab("generator");
    await generateBlueprint({ prompt, platform });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
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
              <div className="hidden md:flex items-center space-x-1 ml-8">
                <Button variant="ghost" size="sm" className="text-primary bg-primary/10">
                  <Home className="w-4 h-4 mr-2" />
                  Generator
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => setActiveTab("history")}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>

              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* API Key Status Badge */}
              <div className="hidden sm:block">
                {hasApiKey ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    API Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Demo Mode
                  </Badge>
                )}
              </div>


              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Generator</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <LayoutTemplate className="w-4 h-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Panel: Input & Configuration */}
              <div className="lg:col-span-1 space-y-6">
                <ChatInput onOpenSettings={() => setSettingsOpen(true)} />
                <ProgressIndicator />
              </div>

              {/* Right Panel: Blueprint Viewer */}
              <div className="lg:col-span-2">
                <BlueprintViewer />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <Templates onUseTemplate={handleUseTemplate} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <RecentBlueprints />
          </TabsContent>
        </Tabs>
      </div>
      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}