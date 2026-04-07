import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Service Pages
import ServiceWebsiteDesign from "./pages/services/WebsiteDesign";
import ServiceCRM from "./pages/services/CRMAutomation";
import ServiceLeadGen from "./pages/services/LeadGeneration";
import ServiceSEO from "./pages/services/SEOServices";

// Local SEO Pages
import LocationKalamazoo from "./pages/locations/Kalamazoo";
import LocationGrandRapids from "./pages/locations/GrandRapids";
import LocationSouthwestMichigan from "./pages/locations/SouthwestMichigan";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />

      {/* Service Pages */}
      <Route path="/services/website-design" component={ServiceWebsiteDesign} />
      <Route path="/services/crm-automation" component={ServiceCRM} />
      <Route path="/services/lead-generation" component={ServiceLeadGen} />
      <Route path="/services/seo-services" component={ServiceSEO} />

      {/* Location Pages */}
      <Route path="/kalamazoo-marketing-agency" component={LocationKalamazoo} />
      <Route path="/grand-rapids-marketing-agency" component={LocationGrandRapids} />
      <Route path="/southwest-michigan-digital-marketing" component={LocationSouthwestMichigan} />

      <Route path="/404" component={NotFound} />
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
