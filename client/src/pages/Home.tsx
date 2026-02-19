import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Sparkles, Target, BookOpen, Bell } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: profile } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!loading && isAuthenticated && profile) {
      if (!profile.onboardingComplete) {
        setLocation("/onboarding");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [loading, isAuthenticated, profile, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container py-20 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">
            Nudggg 🌱
          </h1>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
            A calm, supportive space to pursue your goals with gentle AI nudges, journaling, and insights
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <a href={getLoginUrl()}>
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Set Goals</h3>
            <p className="text-muted-foreground">
              Define what matters to you and track your progress
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Journal Daily</h3>
            <p className="text-muted-foreground">
              Reflect on your journey with AI-powered insights
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Bell className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Get Nudges</h3>
            <p className="text-muted-foreground">
              Receive timely, personalized motivation when you need it
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Gain Insights</h3>
            <p className="text-muted-foreground">
              Understand patterns and celebrate your growth
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6 p-8 rounded-2xl bg-card shadow-soft-lg">
          <h2 className="text-3xl font-bold">
            Replace scrolling with growth
          </h2>
          <p className="text-lg text-muted-foreground">
            No judgment. No pressure. Just supportive nudges to help you move forward.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="text-lg px-8">
              Start Your Journey
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
