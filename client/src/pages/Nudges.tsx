import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Bell, Sparkles, Clock } from "lucide-react";

export default function Nudges() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading: settingsLoading } = trpc.nudges.getSettings.useQuery();
  const { data: notifications, isLoading: notificationsLoading } = trpc.nudges.list.useQuery();
  
  const [enabled, setEnabled] = useState(true);
  const [dailyNudges, setDailyNudges] = useState(true);
  const [weeklyNudges, setWeeklyNudges] = useState(true);
  const [style, setStyle] = useState<string>("supportive");
  const [preferredTimes, setPreferredTimes] = useState({
    morning: true,
    midday: false,
    evening: true,
  });

  useEffect(() => {
    if (settings) {
      setEnabled(settings.enabled ?? true);
      setDailyNudges(settings.cadence?.daily ?? true);
      setWeeklyNudges(settings.cadence?.weekly ?? true);
      setStyle(settings.style || "supportive");
      
      const times = settings.preferredTimes || [];
      setPreferredTimes({
        morning: times.includes("morning"),
        midday: times.includes("midday"),
        evening: times.includes("evening"),
      });
    }
  }, [settings]);

  const updateSettings = trpc.nudges.updateSettings.useMutation({
    onSuccess: () => {
      utils.nudges.getSettings.invalidate();
      toast.success("Settings updated!");
    },
  });

  const markOpened = trpc.nudges.markOpened.useMutation({
    onSuccess: () => {
      utils.nudges.list.invalidate();
    },
  });

  const handleSave = () => {
    const times = [];
    if (preferredTimes.morning) times.push("morning");
    if (preferredTimes.midday) times.push("midday");
    if (preferredTimes.evening) times.push("evening");

    updateSettings.mutate({
      enabled,
      cadence: {
        daily: dailyNudges,
        weekly: weeklyNudges,
      },
      preferredTimes: times,
      style,
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8 text-accent" />
            Nudges & Notifications
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize how and when we support you
          </p>
        </div>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Nudge Settings</CardTitle>
            <CardDescription>
              Control the frequency and style of motivational nudges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enabled" className="text-base font-medium">
                  Enable Nudges
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive personalized motivational messages
                </p>
              </div>
              <Switch
                id="enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </div>

            {enabled && (
              <>
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Frequency</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily" className="cursor-pointer">
                      Daily nudges
                    </Label>
                    <Switch
                      id="daily"
                      checked={dailyNudges}
                      onCheckedChange={setDailyNudges}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly" className="cursor-pointer">
                      Weekly summaries
                    </Label>
                    <Switch
                      id="weekly"
                      checked={weeklyNudges}
                      onCheckedChange={setWeeklyNudges}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Preferred Times</h3>
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

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Nudge Style</h3>
                  <RadioGroup value={style} onValueChange={setStyle}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <RadioGroupItem value="supportive" id="supportive" />
                      <Label htmlFor="supportive" className="flex-1 cursor-pointer">
                        <div className="font-medium">Supportive</div>
                        <div className="text-sm text-muted-foreground">Warm and encouraging</div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <RadioGroupItem value="tough-love-lite" id="tough-love" />
                      <Label htmlFor="tough-love" className="flex-1 cursor-pointer">
                        <div className="font-medium">Tough Love (Lite)</div>
                        <div className="text-sm text-muted-foreground">Direct but kind</div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <RadioGroupItem value="humorous" id="humorous" />
                      <Label htmlFor="humorous" className="flex-1 cursor-pointer">
                        <div className="font-medium">Humorous</div>
                        <div className="text-sm text-muted-foreground">Light-hearted</div>
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
                </div>
              </>
            )}

            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={updateSettings.isPending}
              >
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Nudges</CardTitle>
            <CardDescription>
              Your nudge history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notificationsLoading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : notifications && notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No nudges yet. They'll appear here once you start receiving them.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications?.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.openedAt ? "bg-muted/30" : "bg-accent/10 border-accent"
                    }`}
                    onClick={() => !notification.openedAt && markOpened.mutate({ id: notification.id })}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Sparkles className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm mb-1">{notification.content}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(notification.sentAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {notification.nudgeType && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{notification.nudgeType}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
