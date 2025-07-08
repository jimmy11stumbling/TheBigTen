import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { StreamProvider } from "@/contexts/StreamContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import HomePage from "@/pages/home";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <StreamProvider>
          <Router>
            <Switch>
              <Route path="/" component={LandingPage} />
              <Route path="/app" component={HomePage} />
              <Route component={NotFoundPage} />
            </Switch>
            <Toaster />
          </Router>
        </StreamProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;