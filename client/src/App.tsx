import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import HabitBuilder from "./pages/HabitBuilder";
import Storefront from "./pages/Storefront";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Habits from "./pages/Habits";
import Journal from "./pages/Journal";
import Nudges from "./pages/Nudges";
import Insights from "./pages/Insights";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
       <Route path="/onboarding" component={Onboarding} />
      <Route path="/habit-builder" component={HabitBuilder} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/goals"} component={Goals} />
      <Route path={"/habits"} component={Habits} />
      <Route path={"/journal"} component={Journal} />
      <Route path="/nudges" component={Nudges} />
       <Route path="/storefront" component={Storefront} />
      <Route path={"/insights"} component={Insights} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
