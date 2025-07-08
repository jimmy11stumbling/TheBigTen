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
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <StreamProvider>
          <Router>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/landing" component={LandingPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </StreamProvider>
        <Toaster />
      </QueryClientProvider>
    </SettingsProvider>
  );
}

export default App;