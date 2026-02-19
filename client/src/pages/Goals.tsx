import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Target } from "lucide-react";

export default function Goals() {
  const utils = trpc.useUtils();
  const { data: goals, isLoading } = trpc.goals.list.useQuery();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    whyItMatters: "",
    targetDate: "",
    priority: 1,
  });

  const createGoal = trpc.goals.create.useMutation({
    onSuccess: () => {
      utils.goals.list.invalidate();
      toast.success("Goal created! 🎯");
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateGoal = trpc.goals.update.useMutation({
    onSuccess: () => {
      utils.goals.list.invalidate();
      toast.success("Goal updated!");
      setEditingGoal(null);
      resetForm();
    },
  });

  const deleteGoal = trpc.goals.delete.useMutation({
    onSuccess: () => {
      utils.goals.list.invalidate();
      toast.success("Goal deleted");
    },
  });

  const updateStatus = trpc.goals.update.useMutation({
    onSuccess: () => {
      utils.goals.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      whyItMatters: "",
      targetDate: "",
      priority: 1,
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    if (editingGoal) {
      updateGoal.mutate({
        id: editingGoal,
        ...formData,
      });
    } else {
      createGoal.mutate(formData);
    }
  };

  const handleEdit = (goal: any) => {
    setFormData({
      title: goal.title,
      category: goal.category || "",
      whyItMatters: goal.whyItMatters || "",
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : "",
      priority: goal.priority || 1,
    });
    setEditingGoal(goal.id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteGoal.mutate({ id });
    }
  };

  const handleStatusChange = (id: number, status: "active" | "paused" | "completed") => {
    updateStatus.mutate({ id, status });
  };

  const activeGoals = goals?.filter(g => g.status === "active") || [];
  const completedGoals = goals?.filter(g => g.status === "completed") || [];
  const pausedGoals = goals?.filter(g => g.status === "paused") || [];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Your Goals
            </h1>
            <p className="text-muted-foreground mt-2">
              What matters most to you?
            </p>
          </div>
          
          <Dialog open={isCreateOpen || editingGoal !== null} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingGoal(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
                <DialogDescription>
                  Define what you want to achieve
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Exercise 3 times a week"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Health, Learning, Career"
                  />
                </div>
                
                <div>
                  <Label htmlFor="why">Why does this matter?</Label>
                  <Textarea
                    id="why"
                    value={formData.whyItMatters}
                    onChange={(e) => setFormData({ ...formData, whyItMatters: e.target.value })}
                    placeholder="Your motivation..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority.toString()}
                    onValueChange={(v) => setFormData({ ...formData, priority: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">High</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setEditingGoal(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createGoal.isPending || updateGoal.isPending}
                    className="flex-1"
                  >
                    {editingGoal ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading goals...</div>
        ) : (
          <div className="space-y-8">
            {/* Active Goals */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Active</h2>
              {activeGoals.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No active goals. Create one to get started!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeGoals.map((goal) => (
                    <Card key={goal.id} className="hover:shadow-soft transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{goal.title}</CardTitle>
                            {goal.category && (
                              <CardDescription>{goal.category}</CardDescription>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(goal)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(goal.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {goal.whyItMatters && (
                          <p className="text-sm text-muted-foreground">
                            {goal.whyItMatters}
                          </p>
                        )}
                        {goal.targetDate && (
                          <p className="text-xs text-muted-foreground">
                            Target: {new Date(goal.targetDate).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(goal.id, "completed")}
                          >
                            Complete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(goal.id, "paused")}
                          >
                            Pause
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Completed 🎉</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedGoals.map((goal) => (
                    <Card key={goal.id} className="opacity-75">
                      <CardHeader>
                        <CardTitle className="text-lg line-through">{goal.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(goal.id, "active")}
                        >
                          Reactivate
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Paused Goals */}
            {pausedGoals.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Paused</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pausedGoals.map((goal) => (
                    <Card key={goal.id} className="opacity-60">
                      <CardHeader>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(goal.id, "active")}
                        >
                          Resume
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}