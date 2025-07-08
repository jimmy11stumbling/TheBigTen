import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Loader2, Rocket, Settings, AlertCircle, Save, Copy, History, Trash2 } from "lucide-react";
import { PlatformSelector } from "./PlatformSelector";
import { useStream } from "@/contexts/StreamContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Platform } from "@/lib/types";

interface ChatInputProps {
  onOpenSettings?: () => void;
}

interface SavedPrompt {
  id: string;
  text: string;
  timestamp: number;
  platform: Platform;
}

export function ChatInput({ onOpenSettings }: ChatInputProps) {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<Platform>("replit");
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const { streamState, generateBlueprint } = useStream();
  const { hasApiKey } = useSettings();
  const { toast } = useToast();

  const isGenerating = streamState.status === "generating";

  // Load saved prompts from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("blueprintforge-saved-prompts");
    if (saved) {
      try {
        setSavedPrompts(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved prompts:", error);
      }
    }
  }, []);

  // Save prompts to localStorage whenever savedPrompts changes
  useEffect(() => {
    localStorage.setItem("blueprintforge-saved-prompts", JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Auto-save prompt before generating
    const trimmedPrompt = prompt.trim();
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      text: trimmedPrompt,
      timestamp: Date.now(),
      platform,
    };

    // Only save if it's not already in the recent saved prompts
    const isDuplicate = savedPrompts.some(saved => 
      saved.text === trimmedPrompt && saved.platform === platform
    );

    if (!isDuplicate) {
      setSavedPrompts(prev => [newPrompt, ...prev.slice(0, 9)]); // Keep only 10 most recent
    }

    await generateBlueprint({
      prompt: trimmedPrompt,
      platform,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const savePrompt = () => {
    if (!prompt.trim()) {
      toast({
        title: "No prompt to save",
        description: "Please enter a prompt first.",
        variant: "destructive",
      });
      return;
    }

    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      text: prompt.trim(),
      timestamp: Date.now(),
      platform,
    };

    setSavedPrompts(prev => [newPrompt, ...prev.slice(0, 9)]); // Keep only 10 most recent
    toast({
      title: "Prompt saved",
      description: "Your prompt has been saved for future use.",
    });
  };

  const loadPrompt = (savedPrompt: SavedPrompt) => {
    setPrompt(savedPrompt.text);
    setPlatform(savedPrompt.platform);
    toast({
      title: "Prompt loaded",
      description: "Saved prompt has been loaded into the editor.",
    });
  };

  const copyPrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "No prompt to copy",
        description: "Please enter a prompt first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied to clipboard",
        description: "Your prompt has been copied to the clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const deletePrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Prompt deleted",
      description: "Saved prompt has been removed.",
    });
  };

  const clearAllPrompts = () => {
    setSavedPrompts([]);
    toast({
      title: "All prompts cleared",
      description: "All saved prompts have been removed.",
    });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Describe Your App Idea</h2>

        <div className="space-y-4">
          {!hasApiKey && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Using demo mode. Configure your DeepSeek API key for full functionality.</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary p-0 h-auto"
                    onClick={onOpenSettings}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Setup
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Your App Description</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyPrompt}
                  disabled={!prompt.trim() || isGenerating}
                  title="Copy current prompt"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={savePrompt}
                  disabled={!prompt.trim() || isGenerating}
                  title="Save current prompt"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isGenerating}
                      title="Saved prompts"
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    {savedPrompts.length > 0 ? (
                      <>
                        {savedPrompts.map((savedPrompt) => (
                          <DropdownMenuItem key={savedPrompt.id} className="flex-col items-start p-3">
                            <div className="w-full">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">
                                  {savedPrompt.platform} • {formatTimestamp(savedPrompt.timestamp)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePrompt(savedPrompt.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                              <p 
                                className="text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                                onClick={() => loadPrompt(savedPrompt)}
                              >
                                {savedPrompt.text.slice(0, 120)}
                                {savedPrompt.text.length > 120 && "..."}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={clearAllPrompts} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear all saved prompts
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem disabled>
                        No saved prompts yet
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="relative">
              <Textarea
                placeholder="E.g., A social media app for book lovers with reading challenges and reviews..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[200px] resize-y focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isGenerating}
                maxLength={8192}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {prompt.length}/8192
              </div>
            </div>
          </div>

          <PlatformSelector value={platform} onChange={setPlatform} disabled={isGenerating} />

          <Button 
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Generate Blueprint
              </>
            )}
          </Button>

          {!isGenerating && prompt.trim() && (
            <p className="text-xs text-muted-foreground text-center">
              Press Cmd/Ctrl + Enter to generate
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}