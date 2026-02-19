import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, BookOpen, Sparkles, Loader2, Smile, Meh, Frown } from "lucide-react";
import { Streamdown } from "streamdown";

export default function Journal() {
  const utils = trpc.useUtils();
  const { data: journals, isLoading } = trpc.journals.list.useQuery();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [entryText, setEntryText] = useState("");
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [generatingReflection, setGeneratingReflection] = useState<number | null>(null);

  const createJournal = trpc.journals.create.useMutation({
    onSuccess: () => {
      utils.journals.list.invalidate();
      toast.success("Journal entry saved 📝");
      setIsCreateOpen(false);
      setEntryText("");
      setMoodScore(null);
    },
  });

  const generateReflection = trpc.journals.generateReflection.useMutation({
    onSuccess: (data, variables) => {
      utils.journals.getReflection.invalidate({ journalId: variables.journalId });
      setGeneratingReflection(null);
      toast.success("Reflection generated ✨");
    },
    onError: () => {
      setGeneratingReflection(null);
      toast.error("Failed to generate reflection");
    },
  });

  const handleSubmit = async () => {
    if (!entryText.trim()) {
      toast.error("Please write something");
      return;
    }

    await createJournal.mutateAsync({
      entryText,
      moodScore: moodScore || undefined,
    });
  };

  const handleGenerateReflection = (journalId: number, text: string) => {
    setGeneratingReflection(journalId);
    generateReflection.mutate({
      journalId,
      entryText: text,
    });
  };

  const moodOptions = [
    { value: 5, icon: Smile, label: "Great", color: "text-green-500" },
    { value: 4, icon: Smile, label: "Good", color: "text-green-400" },
    { value: 3, icon: Meh, label: "Okay", color: "text-yellow-500" },
    { value: 2, icon: Frown, label: "Not great", color: "text-orange-500" },
    { value: 1, icon: Frown, label: "Difficult", color: "text-red-500" },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              Your Journal
            </h1>
            <p className="text-muted-foreground mt-2">
              Reflect on your journey
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
                <DialogDescription>
                  What's on your mind today?
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entry">Your thoughts</Label>
                  <Textarea
                    id="entry"
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    placeholder="Write freely... no judgment here"
                    rows={8}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="mb-3 block">How are you feeling?</Label>
                  <div className="flex gap-2 justify-between">
                    {moodOptions.map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <button
                          key={mood.value}
                          onClick={() => setMoodScore(mood.value)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                            moodScore === mood.value
                              ? "bg-accent border-accent-foreground"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${mood.color}`} />
                          <span className="text-xs">{mood.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setEntryText("");
                      setMoodScore(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createJournal.isPending}
                    className="flex-1"
                  >
                    {createJournal.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Entry"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading journal entries...</div>
        ) : journals && journals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No journal entries yet</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                Write Your First Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {journals?.map((journal) => (
              <JournalEntry
                key={journal.id}
                journal={journal}
                onGenerateReflection={handleGenerateReflection}
                isGenerating={generatingReflection === journal.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

function JournalEntry({
  journal,
  onGenerateReflection,
  isGenerating,
}: {
  journal: any;
  onGenerateReflection: (id: number, text: string) => void;
  isGenerating: boolean;
}) {
  const { data: reflection } = trpc.journals.getReflection.useQuery(
    { journalId: journal.id },
    { enabled: !!journal.id }
  );

  const moodEmoji = journal.moodScore
    ? journal.moodScore >= 4
      ? "😊"
      : journal.moodScore === 3
      ? "😐"
      : "😔"
    : null;

  return (
    <Card className="hover:shadow-soft transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {new Date(journal.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {moodEmoji && <span className="text-2xl">{moodEmoji}</span>}
            </CardTitle>
            <CardDescription>
              {new Date(journal.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CardDescription>
          </div>
          {!reflection && !isGenerating && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateReflection(journal.id, journal.entryText)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Reflection
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-foreground">{journal.entryText}</p>
        </div>

        {isGenerating && (
          <div className="bg-accent/20 border border-accent rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <span className="text-sm text-muted-foreground">Generating reflection...</span>
          </div>
        )}

        {reflection && (
          <div className="bg-secondary/10 border border-secondary rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-secondary font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI Reflection</span>
            </div>
            <div className="text-sm">
              <Streamdown>{reflection.reflectionText}</Streamdown>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
