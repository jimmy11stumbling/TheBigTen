import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, Circle } from "lucide-react";
import { useStream } from "@/contexts/StreamContext";

const GENERATION_PHASES = [
  "Analyzing requirements",
  "Generating architecture",
  "Creating implementation plan",
  "Finalizing blueprint",
];

export function ProgressIndicator() {
  const { streamState } = useStream();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (streamState.status === "generating") {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 2, 95);
          
          // Update phase based on progress
          const phaseIndex = Math.floor(newProgress / 25);
          setCurrentPhase(Math.min(phaseIndex, GENERATION_PHASES.length - 1));
          
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    } else if (streamState.status === "complete") {
      setProgress(100);
      setCurrentPhase(GENERATION_PHASES.length);
    } else if (streamState.status === "idle") {
      setProgress(0);
      setCurrentPhase(0);
    }
  }, [streamState.status]);

  const getEstimatedTime = () => {
    if (streamState.status === "complete") return "Complete";
    if (streamState.status === "error") return "Failed";
    if (progress === 0) return "";
    
    const remaining = Math.max(5, Math.floor((100 - progress) * 0.5));
    return `~${remaining} seconds`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Progress</h3>
        
        <div className="space-y-4">
          {/* Status indicators */}
          <div className="space-y-3">
            {GENERATION_PHASES.map((phase, index) => {
              const isActive = index === currentPhase && streamState.status === "generating";
              const isComplete = index < currentPhase || streamState.status === "complete";
              const isUpcoming = index > currentPhase;

              return (
                <div key={phase} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isComplete ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                    <span className={`text-sm ${
                      isComplete ? "text-gray-900" : 
                      isActive ? "text-gray-700" : 
                      "text-gray-400"
                    }`}>
                      {phase}
                    </span>
                  </div>
                  {isComplete && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          {/* ETA */}
          {streamState.status !== "idle" && (
            <div className="text-xs text-gray-500 text-center">
              {streamState.status === "error" ? (
                <span className="text-red-500">Generation failed</span>
              ) : (
                <>
                  Estimated time remaining: 
                  <span className="font-medium ml-1">{getEstimatedTime()}</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
