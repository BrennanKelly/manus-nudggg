import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Sparkles, TrendingUp, Target, CheckCircle2, BookOpen } from "lucide-react";

export default function Insights() {
  const { data: goals } = trpc.goals.list.useQuery();
  const { data: habits } = trpc.habits.list.useQuery();
  const { data: journals } = trpc.journals.list.useQuery();

  const activeGoals = goals?.filter(g => g.status === "active").length || 0;
  const completedGoals = goals?.filter(g => g.status === "completed").length || 0;
  const activeHabits = habits?.filter(h => h.status === "active").length || 0;
  const journalEntries = journals?.length || 0;

  // Calculate this week's journal entries
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekJournals = journals?.filter(
    j => new Date(j.createdAt) >= oneWeekAgo
  ).length || 0;

  // Get recent journals for mood trend
  const recentJournals = journals?.slice(0, 7) || [];
  const avgMood = recentJournals.length > 0
    ? recentJournals.reduce((sum, j) => sum + (j.moodScore || 3), 0) / recentJournals.length
    : 0;

  const moodTrend = avgMood >= 4 ? "positive" : avgMood >= 3 ? "stable" : "needs attention";
  const moodEmoji = avgMood >= 4 ? "😊" : avgMood >= 3 ? "😐" : "💙";

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Your Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Patterns, progress, and reflections
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals}</div>
              {completedGoals > 0 && (
                <p className="text-xs text-muted-foreground">
                  {completedGoals} completed
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeHabits}</div>
              <p className="text-xs text-muted-foreground">
                Building consistency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journalEntries}</div>
              <p className="text-xs text-muted-foreground">
                {thisWeekJournals} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moodEmoji}</div>
              <p className="text-xs text-muted-foreground capitalize">
                {moodTrend}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Summary */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Weekly Summary
            </CardTitle>
            <CardDescription>
              Your progress this week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">🎯 What went well</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {thisWeekJournals > 0 && (
                    <li>• You journaled {thisWeekJournals} time{thisWeekJournals > 1 ? 's' : ''} this week</li>
                  )}
                  {activeGoals > 0 && (
                    <li>• You're actively working on {activeGoals} goal{activeGoals > 1 ? 's' : ''}</li>
                  )}
                  {activeHabits > 0 && (
                    <li>• You're building {activeHabits} positive habit{activeHabits > 1 ? 's' : ''}</li>
                  )}
                  {completedGoals > 0 && (
                    <li>• You've completed {completedGoals} goal{completedGoals > 1 ? 's' : ''} total</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Pattern noticed</h4>
                <p className="text-sm text-muted-foreground">
                  {avgMood >= 4
                    ? "Your mood has been consistently positive. Keep up the great work!"
                    : avgMood >= 3
                    ? "You're maintaining steady progress. Consider what small wins you can celebrate."
                    : recentJournals.length > 0
                    ? "It seems like things have been challenging. Remember, it's okay to take things one day at a time."
                    : "Start journaling to track patterns in your mood and progress."}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">🌱 Next small step</h4>
                <p className="text-sm text-muted-foreground">
                  {thisWeekJournals === 0
                    ? "Try writing a quick journal entry today—even just a few sentences."
                    : activeHabits === 0
                    ? "Consider adding one small habit to build consistency."
                    : activeGoals === 0
                    ? "Set a goal that excites you, no matter how small."
                    : "Keep showing up. You're building something meaningful."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest journal entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentJournals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No journal entries yet. Start writing to see insights here.
              </div>
            ) : (
              <div className="space-y-3">
                {recentJournals.map((journal) => (
                  <div
                    key={journal.id}
                    className="p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm line-clamp-2">{journal.entryText}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(journal.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {journal.moodScore && (
                        <span className="text-xl">
                          {journal.moodScore >= 4 ? "😊" : journal.moodScore === 3 ? "😐" : "😔"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Encouragement */}
        <Card className="bg-accent/10 border-accent">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-medium mb-2">
              Remember: Progress isn't always linear
            </p>
            <p className="text-muted-foreground">
              Every small step counts. You're exactly where you need to be. 🌱
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
