import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { id: "physical", label: "💪 Physical health", icon: "💪" },
  { id: "mental", label: "🧠 Mental health", icon: "🧠" },
  { id: "career", label: "📈 Career growth", icon: "📈" },
  { id: "financial", label: "💰 Financial", icon: "💰" },
  { id: "relationships", label: "❤️ Relationships", icon: "❤️" },
  { id: "confidence", label: "✨ Confidence / self-esteem", icon: "✨" },
  { id: "discipline", label: "🎯 Discipline / consistency", icon: "🎯" },
  { id: "creativity", label: "🎨 Creativity", icon: "🎨" },
  { id: "adventure", label: "🌍 Adventure / experiences", icon: "🌍" },
  { id: "home", label: "🏠 Home / organization", icon: "🏠" },
];

const CATEGORY_HELP_TEXT: Record<string, string> = {
  physical: "Examples: lose 20 lbs, get stronger, run a 5k, be consistent with workouts",
  mental: "Examples: less anxiety, better sleep, journal consistently, meditate daily",
  career: "Examples: get promoted, find a better role, learn a new skill, build side income",
  financial: "Examples: save $10k, pay off debt, invest regularly, build emergency fund",
  relationships: "Examples: date night weekly, call family more, make new friends, be more present",
  confidence: "Examples: speak up more, try new things, stop negative self-talk, dress better",
  discipline: "Examples: wake up early, finish what I start, reduce phone time, stay organized",
  creativity: "Examples: write daily, learn an instrument, start a side project, take photos",
  adventure: "Examples: travel more, try new hobbies, say yes to opportunities, explore locally",
  home: "Examples: declutter, deep clean weekly, organize closet, create a cozy space",
};

type GoalInput = {
  title: string;
  whyItMatters: string;
};

type CategoryGoals = {
  [category: string]: GoalInput[];
};

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryGoals, setCategoryGoals] = useState<CategoryGoals>({});
  const [confidenceLevel, setConfidenceLevel] = useState(3);
  const [biggestObstacle, setBiggestObstacle] = useState("");

  const createProfile = trpc.profile.create.useMutation();
  const createGoal = trpc.goals.create.useMutation();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleGoalChange = (category: string, index: number, field: keyof GoalInput, value: string) => {
    setCategoryGoals((prev) => {
      const goals = prev[category] || [{ title: "", whyItMatters: "" }];
      const updated = [...goals];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [category]: updated };
    });
  };

  const addGoalField = (category: string) => {
    setCategoryGoals((prev) => {
      const goals = prev[category] || [];
      if (goals.length >= 3) return prev;
      return { ...prev, [category]: [...goals, { title: "", whyItMatters: "" }] };
    });
  };

  const handleComplete = async () => {
    try {
      // Create profile
      await createProfile.mutateAsync({
        selectedCategories,
        confidenceLevel,
        biggestObstacle,
        onboardingComplete: true,
      });

      // Create all goals
      for (const category of selectedCategories) {
        const goals = categoryGoals[category] || [];
        for (const goal of goals) {
          if (goal.title.trim()) {
            await createGoal.mutateAsync({
              title: goal.title,
              category,
              whyItMatters: goal.whyItMatters || undefined,
            });
          }
        }
      }

      toast.success("Goals created! Now let's build habits. 🎉");
      setLocation("/habit-builder");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const canProceedFromStep1 = selectedCategories.length > 0;
  const canProceedFromStep2 = selectedCategories.every((cat) => {
    const goals = categoryGoals[cat] || [];
    return goals.some((g) => g.title.trim().length > 0);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FFF8F0] to-[#E8DCC8] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        {step > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-[#8B6F47] mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Step 0: Welcome */}
        {step === 0 && (
          <Card className="border-[#D4A574] shadow-xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="text-6xl">🌱</div>
              <CardTitle className="text-4xl font-serif text-[#8B4513]">
                Welcome to Nudggg
              </CardTitle>
              <CardDescription className="text-lg text-[#6B5744] leading-relaxed max-w-xl mx-auto">
                Most people don't fail because they lack goals. They fail because they lack a system.
              </CardDescription>
              <p className="text-base text-[#8B6F47] max-w-xl mx-auto">
                Nudggg isn't another reminder app. It's your accountability partner that helps you 
                follow through on what actually matters—one small habit at a time.
              </p>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button
                size="lg"
                className="bg-[#C17817] hover:bg-[#A66312] text-white px-8 py-6 text-lg"
                onClick={() => setStep(1)}
              >
                Let's build your system →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Category Assessment */}
        {step === 1 && (
          <Card className="border-[#D4A574] shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-[#8B4513]">
                What areas of life do you want to improve?
              </CardTitle>
              <CardDescription className="text-[#6B5744]">
                Select all that apply. You can always add more later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedCategories.includes(cat.id)
                        ? "border-[#C17817] bg-[#FFF8F0]"
                        : "border-[#E8DCC8] hover:border-[#D4A574]"
                    }`}
                    onClick={() => handleCategoryToggle(cat.id)}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => handleCategoryToggle(cat.id)}
                    />
                    <Label className="text-lg cursor-pointer flex-1">
                      {cat.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-6">
                <Button
                  size="lg"
                  disabled={!canProceedFromStep1}
                  onClick={() => setStep(2)}
                  className="bg-[#C17817] hover:bg-[#A66312]"
                >
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Goal Expansion */}
        {step === 2 && (
          <Card className="border-[#D4A574] shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-[#8B4513]">
                What do you want to achieve?
              </CardTitle>
              <CardDescription className="text-[#6B5744]">
                Add 1-3 specific goals for each area you selected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {selectedCategories.map((catId) => {
                const category = CATEGORIES.find((c) => c.id === catId);
                const goals = categoryGoals[catId] || [{ title: "", whyItMatters: "" }];
                
                return (
                  <div key={catId} className="space-y-4 p-6 bg-[#FFF8F0] rounded-lg border border-[#E8DCC8]">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{category?.icon}</span>
                      <h3 className="text-xl font-semibold text-[#8B4513]">
                        {category?.label.replace(/^[^\s]+\s/, "")}
                      </h3>
                    </div>
                    <p className="text-sm text-[#8B6F47] italic">
                      {CATEGORY_HELP_TEXT[catId]}
                    </p>
                    
                    {goals.map((goal, index) => (
                      <div key={index} className="space-y-3 pl-4 border-l-2 border-[#D4A574]">
                        <div>
                          <Label className="text-[#6B5744]">Goal {index + 1}</Label>
                          <Input
                            placeholder="What do you want to achieve?"
                            value={goal.title}
                            onChange={(e) => handleGoalChange(catId, index, "title", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-[#6B5744]">Why does this matter? (optional)</Label>
                          <Textarea
                            placeholder="Your motivation..."
                            value={goal.whyItMatters}
                            onChange={(e) => handleGoalChange(catId, index, "whyItMatters", e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {goals.length < 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addGoalField(catId)}
                        className="ml-4"
                      >
                        + Add another goal
                      </Button>
                    )}
                  </div>
                );
              })}
              
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button
                  size="lg"
                  disabled={!canProceedFromStep2}
                  onClick={() => setStep(3)}
                  className="bg-[#C17817] hover:bg-[#A66312]"
                >
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confidence & Obstacles */}
        {step === 3 && (
          <Card className="border-[#D4A574] shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-[#8B4513]">
                Let's personalize your experience
              </CardTitle>
              <CardDescription className="text-[#6B5744]">
                This helps us support you better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label className="text-lg text-[#8B4513]">
                  How confident are you that you'll stick with these goals?
                </Label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[#8B6F47]">Not confident</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-[#8B6F47]">Very confident</span>
                </div>
                <div className="text-center text-2xl">
                  {["😟", "😕", "😐", "🙂", "😊"][confidenceLevel - 1]}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg text-[#8B4513]">
                  What usually stops you from following through? (optional)
                </Label>
                <Textarea
                  placeholder="e.g., lack of time, forget to do it, lose motivation..."
                  value={biggestObstacle}
                  onChange={(e) => setBiggestObstacle(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button
                  size="lg"
                  onClick={() => setStep(4)}
                  className="bg-[#C17817] hover:bg-[#A66312]"
                >
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Summary & Complete */}
        {step === 4 && (
          <Card className="border-[#D4A574] shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <CardTitle className="text-4xl font-serif text-[#8B4513]">
                Your system is ready!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#FFF8F0] p-6 rounded-lg border border-[#E8DCC8] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B5744]">Categories selected:</span>
                  <span className="font-semibold text-[#8B4513]">{selectedCategories.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B5744]">Goals created:</span>
                  <span className="font-semibold text-[#8B4513]">
                    {Object.values(categoryGoals).flat().filter((g) => g.title.trim()).length}
                  </span>
                </div>
                <div className="pt-4 border-t border-[#E8DCC8]">
                  <p className="text-sm text-[#8B6F47] text-center">
                    Next, we'll help you build habits to support these goals.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(3)}>
                  ← Back
                </Button>
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={createProfile.isPending || createGoal.isPending}
                  className="bg-[#C17817] hover:bg-[#A66312]"
                >
                  {(createProfile.isPending || createGoal.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Start my journey
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
