import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { StreamState, StreamEvent, GenerateRequest } from "@/lib/types";
import { useSettings } from "./SettingsContext";

interface StreamContextType {
  streamState: StreamState;
  generateBlueprint: (request: GenerateRequest) => Promise<void>;
  resetStream: () => void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export function useStream() {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
}

interface StreamProviderProps {
  children: ReactNode;
}

export function StreamProvider({ children }: StreamProviderProps) {
  const { apiKey } = useSettings();
  const [streamState, setStreamState] = useState<StreamState>({
    content: "",
    status: "idle",
  });

  const generateBlueprint = useCallback(async (request: GenerateRequest) => {
    setStreamState({
      content: "",
      status: "generating",
    });

    try {
      const requestWithApiKey = {
        ...request,
        apiKey: apiKey || undefined,
      };

      const response = await fetch("/api/blueprint/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestWithApiKey),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      // Direct updates for smoother streaming
      const updateContent = (chunk: string) => {
        setStreamState(prev => ({
          ...prev,
          content: prev.content + chunk,
        }));
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          // Process complete lines, keep incomplete line in buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith("data: ")) {
              const data = trimmedLine.slice(6);

              try {
                const event: StreamEvent = JSON.parse(data);

                if (event.type === "chunk" && event.content) {
                  // Use requestAnimationFrame for smoother updates
                  requestAnimationFrame(() => {
                    setStreamState(prev => ({
                      ...prev,
                      content: prev.content + event.content
                    }));
                  });
                } else if (event.type === "complete") {
                  setStreamState(prev => ({
                    ...prev,
                    status: "complete",
                    blueprintId: event.blueprintId,
                  }));
                } else if (event.type === "error") {
                  setStreamState(prev => ({
                    ...prev,
                    status: "error",
                    error: event.message || "Generation failed",
                  }));
                }
              } catch (parseError) {
                console.error("Failed to parse SSE data:", parseError);
                // If JSON parsing fails, treat as raw content for smoother streaming
                if (data && data !== "[DONE]") {
                  requestAnimationFrame(() => {
                    setStreamState(prev => ({
                      ...prev,
                      content: prev.content + data
                    }));
                  });
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("Stream error:", error);
      setStreamState(prev => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [apiKey]);

  const resetStream = useCallback(() => {
    setStreamState({
      content: "",
      status: "idle",
    });
  }, []);

  return (
    <StreamContext.Provider value={{ streamState, generateBlueprint, resetStream }}>
      {children}
    </StreamContext.Provider>
  );
}