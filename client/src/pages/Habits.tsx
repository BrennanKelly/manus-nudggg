import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Edit, CheckCircle2, Flame } from "lucide-react";

export default function Habits() {
  const utils = trpc.useUtils();
  const { data: habits, isLoading } = trpc.habits.list.useQuery();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    frequencyType: "daily" as "daily" | "weekly",
    frequencyCount: 1,
    reminderTime: "",
  });

  const createHabit = trpc.habits.create.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate();
      toast.success("Habit created! 💪");
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateHabit = trpc.habits.update.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate();
      toast.success("Habit updated!");
      setEditingHabit(null);
      resetForm();
    },
  });

  const deleteHabit = trpc.habits.delete.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate();
      toast.success("Habit deleted");
    },
  });

  const logHabit = trpc.habits.log.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate();
      toast.success("Logged! 🎉");
    },
  });

  const updateStatus = trpc.habits.update.useMutation({
    onSuccess: () => {
      utils.habits.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      frequencyType: "daily",
      frequencyCount: 1,
      reminderTime: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    if (editingHabit) {
      updateHabit.mutate({
        id: editingHabit,
        ...formData,
      });
    } else {
      createHabit.mutate(formData);
    }
  };

  const handleEdit = (habit: any) => {
    setFormData({
      name: habit.name,
      frequencyType: habit.frequencyType,
      frequencyCount: habit.frequencyCount || 1,
      reminderTime: habit.reminderTime || "",
    });
    setEditingHabit(habit.id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabit.mutate({ id });
    }
  };

  const handleStatusChange = (id: number, status: "active" | "paused" | "completed") => {
    updateStatus.mutate({ id, status });
  };

  const activeHabits = habits?.filter(h => h.status === "active") || [];
  const completedHabits = habits?.filter(h => h.status === "completed") || [];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-secondary" />
              Your Habits
            </h1>
            <p className="text-muted-foreground mt-2">
              Small actions, big impact
            </p>
          </div>
          
          <Dialog open={isCreateOpen || editingHabit !== null} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingHabit(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingHabit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
                <DialogDescription>
                  Build consistency one day at a time
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Habit Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Morning meditation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="frequencyType">Frequency</Label>
                  <Select
                    value={formData.frequencyType}
                    onValueChange={(v: "daily" | "weekly") => setFormData({ ...formData, frequencyType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.frequencyType === "weekly" && (
                  <div>
                    <Label htmlFor="frequencyCount">Times per week</Label>
                    <Input
                      id="frequencyCount"
                      type="number"
                      min="1"
                      max="7"
                      value={formData.frequencyCount}
                      onChange={(e) => setFormData({ ...formData, frequencyCount: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="reminderTime">Reminder Time (Optional)</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setEditingHabit(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createHabit.isPending || updateHabit.isPending}
                    className="flex-1"
                  >
                    {editingHabit ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading habits...</div>
        ) : (
          <div className="space-y-8">
            {/* Active Habits */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Active</h2>
              {activeHabits.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No active habits. Create one to get started!
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {activeHabits.map((habit) => (
                    <Card key={habit.id} className="hover:shadow-soft transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => logHabit.mutate({ habitId: habit.id })}
                              disabled={logHabit.isPending}
                              className="h-10 w-10 rounded-full"
                            >
                              <CheckCircle2 className="h-6 w-6 text-secondary" />
                            </Button>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{habit.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {habit.frequencyType}
                                {habit.frequencyCount && habit.frequencyCount > 1 && ` (${habit.frequencyCount}x per week)`}
                                {habit.reminderTime && ` • ${habit.reminderTime}`}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Flame className="h-5 w-5 text-accent" />
                              <span className="text-sm font-medium">Streak feature coming soon</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(habit)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(habit.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Habits */}
            {completedHabits.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Completed 🎉</h2>
                <div className="space-y-3">
                  {completedHabits.map((habit) => (
                    <Card key={habit.id} className="opacity-75">
                      <CardContent className="py-4 flex items-center justify-between">
                        <h3 className="font-semibold line-through">{habit.name}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(habit.id, "active")}
                        >
                          Reactivate
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
