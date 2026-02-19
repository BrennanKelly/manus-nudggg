import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  
  // Form state
  const [goals, setGoals] = useState<string[]>(["", "", ""]);
  const [whyItMatters, setWhyItMatters] = useState("");
  const [frictionPoints, setFrictionPoints] = useState("");
  const [motivationStyle, setMotivationStyle] = useState<"supportive" | "tough-love-lite" | "humorous" | "calm">("supportive");
  const [preferredTimes, setPreferredTimes] = useState({
    morning: false,
    midday: false,
    evening: false,
  });
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");
  const [whyMissingSocial, setWhyMissingSocial] = useState("");

  const createProfile = trpc.profile.create.useMutation();
  const createGoal = trpc.goals.create.useMutation();

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleNext = () => {
    if (step === 1) {
      const filledGoals = goals.filter(g => g.trim());
      if (filledGoals.length === 0) {
        toast.error("Please add at least one goal");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = async () => {
    try {
      // Create profile
      const preferredNudgeTimes = [];
      if (preferredTimes.morning) preferredNudgeTimes.push("morning");
      if (preferredTimes.midday) preferredNudgeTimes.push("midday");
      if (preferredTimes.evening) preferredNudgeTimes.push("evening");

      await createProfile.mutateAsync({
        motivationStyle,
        quietHoursStart,
        quietHoursEnd,
        preferredNudgeTimes,
        frictionPoints,
        whyMissingSocial,
      });

      // Create goals
      const filledGoals = goals.filter(g => g.trim());
      for (const goal of filledGoals) {
        await createGoal.mutateAsync({
          title: goal,
          whyItMatters,
        });
      }

      toast.success("Welcome to Nudggg! 🌱");
      setLocation("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-soft-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Welcome to Nudggg 🌱</CardTitle>
          <CardDescription className="text-center text-lg">
            Let's set up your personal growth journey
          </CardDescription>
          <div className="flex gap-2 mt-4 justify-center">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">What are your goals?</h3>
                <p className="text-muted-foreground mb-4">
                  Share 1-3 things you'd like to work on. These can be big or small.
                </p>
              </div>
              
              {goals.map((goal, index) => (
                <div key={index}>
                  <Label htmlFor={`goal-${index}`}>Goal {index + 1}</Label>
                  <Input
                    id={`goal-${index}`}
                    value={goal}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    placeholder="e.g., Exercise more, Learn Spanish, Read daily"
                    className="mt-1"
                  />
                </div>
              ))}
              
              <div>
                <Label htmlFor="why">Why do these goals matter to you?</Label>
                <Textarea
                  id="why"
                  value={whyItMatters}
                  onChange={(e) => setWhyItMatters(e.target.value)}
                  placeholder="Share what motivates you..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="friction">What usually gets in the way?</Label>
                <Textarea
                  id="friction"
                  value={frictionPoints}
                  onChange={(e) => setFrictionPoints(e.target.value)}
                  placeholder="e.g., Lack of time, procrastination, distractions..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">How should we support you?</h3>
                <p className="text-muted-foreground mb-4">
                  Choose the tone that resonates with you
                </p>
              </div>
              
              <RadioGroup value={motivationStyle} onValueChange={(v) => setMotivationStyle(v as any)}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <RadioGroupItem value="supportive" id="supportive" />
                  <Label htmlFor="supportive" className="flex-1 cursor-pointer">
                    <div className="font-medium">Supportive</div>
                    <div className="text-sm text-muted-foreground">Warm, encouraging, and gentle</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <RadioGroupItem value="tough-love-lite" id="tough-love" />
                  <Label htmlFor="tough-love" className="flex-1 cursor-pointer">
                    <div className="font-medium">Tough Love (Lite)</div>
                    <div className="text-sm text-muted-foreground">Direct and motivating, but kind</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <RadioGroupItem value="humorous" id="humorous" />
                  <Label htmlFor="humorous" className="flex-1 cursor-pointer">
                    <div className="font-medium">Humorous</div>
                    <div className="text-sm text-muted-foreground">Light-hearted with a smile</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <RadioGroupItem value="calm" id="calm" />
                  <Label htmlFor="calm" className="flex-1 cursor-pointer">
                    <div className="font-medium">Calm</div>
                    <div className="text-sm text-muted-foreground">Peaceful and mindful</div>
                  </Label>
                </div>
              </RadioGroup>
              
              <div>
                <Label className="mb-3 block">When would you like nudges?</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferredTimes.morning}
                      onChange={(e) => setPreferredTimes({ ...preferredTimes, morning: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span>Morning (7-10 AM)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferredTimes.midday}
                      onChange={(e) => setPreferredTimes({ ...preferredTimes, midday: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span>Midday (12-2 PM)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferredTimes.evening}
                      onChange={(e) => setPreferredTimes({ ...preferredTimes, evening: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span>Evening (6-9 PM)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Final touches</h3>
                <p className="text-muted-foreground mb-4">
                  Help us respect your time
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet-start">Quiet hours start</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end">Quiet hours end</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="social">What do you miss about social media? (Optional)</Label>
                <Textarea
                  id="social"
                  value={whyMissingSocial}
                  onChange={(e) => setWhyMissingSocial(e.target.value)}
                  placeholder="e.g., Connection, inspiration, entertainment..."
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This helps us provide content that fills that gap in a healthier way
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="flex-1">
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                className="flex-1"
                disabled={createProfile.isPending}
              >
                {createProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
