import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, Target, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: goals, isLoading: goalsLoading } = trpc.goals.list.useQuery();
  const { data: habits, isLoading: habitsLoading } = trpc.habits.list.useQuery();
  
  const logHabit = trpc.habits.log.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate();
      toast.success("Habit logged! 🎉");
    },
  });

  const activeGoals = goals?.filter(g => g.status === "active") || [];
  const activeHabits = habits?.filter(h => h.status === "active") || [];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name || "friend"} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Keep moving forward, one small step at a time
          </p>
        </div>

        {/* Goals Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Your Goals
            </h2>
            <Link href="/goals">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
            </Link>
          </div>

          {goalsLoading ? (
            <div className="text-muted-foreground">Loading goals...</div>
          ) : activeGoals.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">No active goals yet</p>
                <Link href="/goals">
                  <Button>Create Your First Goal</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeGoals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-soft transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    {goal.category && (
                      <CardDescription>{goal.category}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {goal.whyItMatters && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {goal.whyItMatters}
                      </p>
                    )}
                    {goal.targetDate && (
                      <p className="text-xs text-muted-foreground">
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Habits Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-secondary" />
              Today's Habits
            </h2>
            <Link href="/habits">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Habit
              </Button>
            </Link>
          </div>

          {habitsLoading ? (
            <div className="text-muted-foreground">Loading habits...</div>
          ) : activeHabits.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">No active habits yet</p>
                <Link href="/habits">
                  <Button>Create Your First Habit</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {activeHabits.map((habit) => (
                <Card key={habit.id} className="hover:shadow-soft transition-shadow">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => logHabit.mutate({ habitId: habit.id })}
                        disabled={logHabit.isPending}
                      >
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                      </Button>
                      <div>
                        <h3 className="font-medium">{habit.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {habit.frequencyType}
                          {habit.frequencyCount && habit.frequencyCount > 1 && ` (${habit.frequencyCount}x)`}
                        </p>
                      </div>
                    </div>
                    {habit.reminderTime && (
                      <span className="text-sm text-muted-foreground">
                        {habit.reminderTime}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="bg-accent/20 border-accent">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/journal">
              <Button variant="secondary">
                Write in Journal
              </Button>
            </Link>
            <Link href="/insights">
              <Button variant="outline">
                View Insights
              </Button>
            </Link>
            <Link href="/nudges">
              <Button variant="outline">
                Manage Nudges
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
