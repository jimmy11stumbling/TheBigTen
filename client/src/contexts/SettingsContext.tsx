import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  hasApiKey: boolean;
  clearApiKey: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [apiKey, setApiKeyState] = useState<string>("");

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("deepseek_api_key");
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
    }
  }, []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem("deepseek_api_key", key);
    } else {
      localStorage.removeItem("deepseek_api_key");
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState("");
    localStorage.removeItem("deepseek_api_key");
  }, []);

  const hasApiKey = !!apiKey && apiKey.trim().length > 0;

  return (
    <SettingsContext.Provider value={{ apiKey, setApiKey, hasApiKey, clearApiKey }}>
      {children}
    </SettingsContext.Provider>
  );
}