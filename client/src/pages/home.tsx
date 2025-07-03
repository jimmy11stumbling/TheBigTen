import { ChatInput } from "@/components/ChatInput";
import { BlueprintViewer } from "@/components/BlueprintViewer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RecentBlueprints } from "@/components/RecentBlueprints";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Compass, 
  HelpCircle, 
  Settings, 
  User,
  Home,
  History,
  LayoutTemplate
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                    <Compass className="text-white w-4 h-4" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">BlueprintForge</h1>
                </div>
              </Link>
              <div className="hidden md:flex items-center space-x-1 ml-8">
                <Button variant="ghost" size="sm" className="text-primary bg-primary/10">
                  <Home className="w-4 h-4 mr-2" />
                  Generator
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Templates
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
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
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Panel: Input & Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <ChatInput />
            <ProgressIndicator />
            <RecentBlueprints />
          </div>

          {/* Right Panel: Blueprint Viewer */}
          <div className="lg:col-span-2">
            <BlueprintViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
