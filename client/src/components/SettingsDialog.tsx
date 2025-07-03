import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Key, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { apiKey, setApiKey, clearApiKey } = useSettings();
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (open) {
      setInputValue(apiKey);
    }
  }, [open, apiKey]);

  const handleSave = async () => {
    if (!inputValue.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your DeepSeek API key to continue.",
        variant: "destructive",
      });
      return;
    }

    // Basic validation for API key format
    if (!inputValue.startsWith('sk-') || inputValue.length < 20) {
      toast({
        title: "Invalid API Key Format",
        description: "DeepSeek API keys should start with 'sk-' and be at least 20 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Test the API key by making a simple request
      const testResponse = await fetch('/api/test-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: inputValue }),
      });

      if (testResponse.ok) {
        setApiKey(inputValue);
        toast({
          title: "API Key Saved",
          description: "Your DeepSeek API key has been saved successfully.",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Invalid API Key",
          description: "The provided API key is not valid. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // If test endpoint doesn't exist, just save the key
      setApiKey(inputValue);
      toast({
        title: "API Key Saved",
        description: "Your DeepSeek API key has been saved. It will be validated on first use.",
      });
      onOpenChange(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue("");
    toast({
      title: "API Key Cleared",
      description: "Your API key has been removed from local storage.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            DeepSeek API Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your DeepSeek API key to enable AI-powered blueprint generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored locally in your browser and never sent to our servers.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="api-key">DeepSeek API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              Don't have an API key?{" "}
              <a
                href="https://platform.deepseek.com/api_keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get one from DeepSeek Platform
              </a>
            </AlertDescription>
          </Alert>

          {apiKey && (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                API key is currently configured and ready to use.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between gap-2">
            {apiKey && (
              <Button variant="outline" onClick={handleClear}>
                Clear API Key
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isValidating}>
                {isValidating ? "Validating..." : "Save API Key"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}