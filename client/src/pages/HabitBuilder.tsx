import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

const DAYS_OF_WEEK = [
  { id: 0, label: "Sun", full: "Sunday" },
  { id: 1, label: "Mon", full: "Monday" },
  { id: 2, label: "Tue", full: "Tuesday" },
  { id: 3, label: "Wed", full: "Wednesday" },
  { id: 4, label: "Thu", full: "Thursday" },
  { id: 5, label: "Fri", full: "Friday" },
  { id: 6, label: "Sat", full: "Saturday" },
];

const FREQUENCY_OPTIONS = [
  { value: "2", label: "2x per week", description: "Light commitment" },
  { value: "3", label: "3x per week", description: "Recommended for most goals" },
  { value: "4", label: "4x per week", description: "Building momentum" },
  { value: "daily", label: "Daily", description: "Maximum consistency" },
  { value: "custom", label: "Custom", description: "Pick specific days" },
];

const TIME_PREFERENCES = [
  { value: "morning", label: "Morning", icon: "🌅", time: "6-10 AM" },
  { value: "afternoon", label: "Afternoon", icon: "☀️", time: "12-4 PM" },
  { value: "evening", label: "Evening", icon: "🌙", time: "6-9 PM" },
  { value: "flexible", label: "Flexible", icon: "⏰", time: "Anytime" },
];

type HabitSuggestion = {
  name: string;
  reasoning: string;
};

export default function HabitBuilder() {
  const [, setLocation] = useLocation();
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("3");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [timePreference, setTimePreference] = useState("flexible");
  const [reminderTime, setReminderTime] = useState("");
  const [suggestions, setSuggestions] = useState<HabitSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { data: goals, isLoading: goalsLoading } = trpc.goals.list.useQuery();
  const createHabit = trpc.habits.create.useMutation();
  const generateSuggestions = trpc.habits.generateSuggestions.useMutation();

  const activeGoals = goals?.filter((g) => g.status === "active") || [];
  const currentGoal = activeGoals[currentGoalIndex];
  const totalGoals = activeGoals.length;
  const progress = ((currentGoalIndex + 1) / totalGoals) * 100;

  useEffect(() => {
    if (currentGoal) {
      loadHabitSuggestions();
    }
  }, [currentGoal?.id]);

  const loadHabitSuggestions = async () => {
    if (!currentGoal) return;
    
    setLoadingSuggestions(true);
    try {
      const result = await generateSuggestions.mutateAsync({
        goalTitle: currentGoal.title,
        category: currentGoal.category,
        whyItMatters: currentGoal.whyItMatters || undefined,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleDayToggle = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId].sort()
    );
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
    
    if (value === "daily") {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    } else if (value === "custom") {
      setSelectedDays([]);
    } else {
      // Auto-suggest days based on frequency
      const count = parseInt(value);
      if (count === 2) {
        setSelectedDays([1, 4]); // Mon, Thu
      } else if (count === 3) {
        setSelectedDays([1, 3, 5]); // Mon, Wed, Fri
      } else if (count === 4) {
        setSelectedDays([1, 2, 4, 5]); // Mon, Tue, Thu, Fri
      }
    }
  };

  const handleCreateHabit = async () => {
    if (!habitName.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    try {
      await createHabit.mutateAsync({
        name: habitName,
        goalId: currentGoal?.id,
        frequencyType: frequency === "daily" ? "daily" : selectedDays.length === 7 ? "daily" : "custom",
        frequencyCount: selectedDays.length,
        scheduledDays: selectedDays,
        timePreference: timePreference as any,
        reminderTime: reminderTime || undefined,
      });

      toast.success("Habit created! 🎉");

      // Move to next goal or finish
      if (currentGoalIndex < totalGoals - 1) {
        setCurrentGoalIndex(currentGoalIndex + 1);
        setHabitName("");
        setFrequency("3");
        setSelectedDays([]);
        setTimePreference("flexible");
        setReminderTime("");
      } else {
        toast.success("All habits created! Your system is complete.");
        setLocation("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to create habit. Please try again.");
      console.error(error);
    }
  };

  const handleSkipGoal = () => {
    if (currentGoalIndex < totalGoals - 1) {
      setCurrentGoalIndex(currentGoalIndex + 1);
      setHabitName("");
      setFrequency("3");
      setSelectedDays([]);
    } else {
      setLocation("/dashboard");
    }
  };

  if (goalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FFF8F0] to-[#E8DCC8] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17817]" />
      </div>
    );
  }

  if (totalGoals === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FFF8F0] to-[#E8DCC8] flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Goals Found</CardTitle>
            <CardDescription>Create some goals first to build habits.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/goals")}>Go to Goals</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FFF8F0] to-[#E8DCC8] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[#8B6F47] mb-2">
            <span>Goal {currentGoalIndex + 1} of {totalGoals}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-[#D4A574] shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-serif text-[#8B4513]">
                  Build a habit for this goal
                </CardTitle>
                <CardDescription className="text-[#6B5744] mt-2">
                  {currentGoal?.title}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[#C17817] border-[#C17817]">
                {currentGoal?.category}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* AI Suggestions */}
            {loadingSuggestions ? (
              <div className="bg-[#FFF8F0] p-6 rounded-lg border border-[#E8DCC8] flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[#C17817] mr-2" />
                <span className="text-[#8B6F47]">Generating habit suggestions...</span>
              </div>
            ) : suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#8B4513]">
                  <Sparkles className="h-5 w-5 text-[#C17817]" />
                  <Label className="text-lg font-semibold">AI Suggestions</Label>
                </div>
                <div className="grid gap-3">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setHabitName(suggestion.name)}
                      className="text-left p-4 bg-[#FFF8F0] rounded-lg border-2 border-[#E8DCC8] hover:border-[#C17817] transition-all"
                    >
                      <div className="font-medium text-[#8B4513]">{suggestion.name}</div>
                      <div className="text-sm text-[#8B6F47] mt-1">{suggestion.reasoning}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Habit Name */}
            <div className="space-y-2">
              <Label className="text-lg text-[#8B4513]">What habit will help you achieve this goal?</Label>
              <Input
                placeholder="e.g., Go to the gym, Read for 20 minutes, Meditate"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-3">
              <Label className="text-lg text-[#8B4513]">How often?</Label>
              <RadioGroup value={frequency} onValueChange={handleFrequencyChange}>
                {FREQUENCY_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      frequency === option.value
                        ? "border-[#C17817] bg-[#FFF8F0]"
                        : "border-[#E8DCC8]"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      <div className="font-medium text-[#8B4513]">{option.label}</div>
                      <div className="text-sm text-[#8B6F47]">{option.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Day Selection */}
            {(frequency === "custom" || (frequency !== "daily" && selectedDays.length > 0)) && (
              <div className="space-y-3">
                <Label className="text-lg text-[#8B4513]">Which days?</Label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => handleDayToggle(day.id)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedDays.includes(day.id)
                          ? "border-[#C17817] bg-[#C17817] text-white"
                          : "border-[#E8DCC8] text-[#8B6F47] hover:border-[#D4A574]"
                      }`}
                    >
                      <div className="font-medium">{day.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time Preference */}
            <div className="space-y-3">
              <Label className="text-lg text-[#8B4513]">When during the day?</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TIME_PREFERENCES.map((time) => (
                  <button
                    key={time.value}
                    onClick={() => setTimePreference(time.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      timePreference === time.value
                        ? "border-[#C17817] bg-[#FFF8F0]"
                        : "border-[#E8DCC8] hover:border-[#D4A574]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{time.icon}</div>
                    <div className="font-medium text-[#8B4513] text-sm">{time.label}</div>
                    <div className="text-xs text-[#8B6F47]">{time.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Reminder Time */}
            {timePreference !== "flexible" && (
              <div className="space-y-2">
                <Label className="text-[#8B4513]">Specific reminder time (optional)</Label>
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={handleSkipGoal}
                className="flex-1"
              >
                Skip this goal
              </Button>
              <Button
                onClick={handleCreateHabit}
                disabled={createHabit.isPending}
                className="flex-1 bg-[#C17817] hover:bg-[#A66312]"
              >
                {createHabit.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : currentGoalIndex < totalGoals - 1 ? (
                  "Create & Continue →"
                ) : (
                  "Create & Finish"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
