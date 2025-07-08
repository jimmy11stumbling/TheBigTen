import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { StreamProvider } from "@/contexts/StreamContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import HomePage from "@/pages/home";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <QueryClientProvider client={queryClient}>
          <StreamProvider>
            <Router>
              <Switch>
                <Route path="/" component={LandingPage} />
                <Route path="/app" component={HomePage} />
                <Route component={NotFoundPage} />
              </Switch>
            </Router>
          </StreamProvider>
          <Toaster />
        </QueryClientProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;