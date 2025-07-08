import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { StreamProvider } from "@/contexts/StreamContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <StreamProvider>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
              <Switch>
                <Route path="/" component={Landing} />
                <Route path="/home" component={Home} />
                <Route component={NotFound} />
              </Switch>
              <Toaster />
            </div>
          </StreamProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;