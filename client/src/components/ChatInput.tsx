import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Rocket } from "lucide-react";
import { PlatformSelector } from "./PlatformSelector";
import { useStream } from "@/contexts/StreamContext";
import { Platform } from "@/lib/types";

export function ChatInput() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<Platform>("replit");
  const { streamState, generateBlueprint } = useStream();

  const isGenerating = streamState.status === "generating";

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;

    await generateBlueprint({
      prompt: prompt.trim(),
      platform,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Describe Your App Idea</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="E.g., A social media app for book lovers with reading challenges and reviews..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[128px] resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isGenerating}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {prompt.length}/500
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
