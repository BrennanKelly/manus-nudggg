/*
 * LeadDetail — LMM CRM
 * Design: Warm Professional — full profile, activity timeline, associated deals
 */

import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Edit2,
  Trash2,
  Plus,
  ArrowLeft,
  MessageSquare,
  TrendingUp,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { LeadAvatar, StageBadge, SourceBadge } from "@/components/CrmComponents";
import {
  getLead,
  updateLead,
  deleteLead,
  getDealsForLead,
  createDeal,
  updateDeal,
  deleteDeal,
  getActivitiesForLead,
  addActivity,
  formatDate,
  formatRelativeTime,
  formatCurrency,
  PIPELINE_STAGES,
  type Lead,
  type Deal,
  type Activity,
  type LeadSource,
  type LeadStatus,
  type PipelineStage,
} from "@/lib/data";

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [lead, setLead] = useState<Lead | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [noteText, setNoteText] = useState("");
  const [showEditLead, setShowEditLead] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [dealForm, setDealForm] = useState({ title: "", value: "", stage: "New Lead" as PipelineStage, notes: "" });

  function refresh() {
    if (!id) return;
    const l = getLead(id);
    if (!l) { navigate("/leads"); return; }
    setLead(l);
    setDeals(getDealsForLead(id));
    setActivities(getActivitiesForLead(id));
  }

  useEffect(() => { refresh(); }, [id]);

  if (!lead) return null;

  function handleEditOpen() {
    setEditForm({
      name: lead!.name,
      email: lead!.email,
      phone: lead!.phone,
      businessType: lead!.businessType,
      source: lead!.source,
      status: lead!.status,
      notes: lead!.notes,
    });
    setShowEditLead(true);
  }

  function handleEditSave() {
    updateLead(lead!.id, editForm);
    toast.success("Lead updated.");
    setShowEditLead(false);
    refresh();
  }

  function handleDelete() {
    deleteLead(lead!.id);
    toast.success("Lead deleted.");
    navigate("/leads");
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    addActivity({ leadId: lead!.id, type: "note", description: noteText.trim() });
    setNoteText("");
    refresh();
    toast.success("Note added.");
  }

  function handleAddDeal() {
    if (!dealForm.title) { toast.error("Deal title is required."); return; }
    createDeal({
      leadId: lead!.id,
      title: dealForm.title,
      value: parseFloat(dealForm.value) || 0,
      stage: dealForm.stage,
      notes: dealForm.notes,
    });
    setDealForm({ title: "", value: "", stage: "New Lead", notes: "" });
    setShowAddDeal(false);
    refresh();
    toast.success("Deal created.");
  }

  const statusColors: Record<string, string> = {
    New: "bg-blue-50 text-blue-700 border-blue-200",
    Active: "bg-amber-50 text-amber-700 border-amber-200",
    Qualified: "bg-green-50 text-green-700 border-green-200",
    Closed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const activityIcon: Record<string, string> = {
    created: "🆕", email: "📧", call: "📞", stage_change: "🔄", note: "📝",
  };

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Leads", href: "/leads" },
        { label: lead.name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEditOpen} className="gap-1.5 text-xs">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left: Profile + Notes ──────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Profile Card */}
          <div className="lmm-card p-6">
            <div className="flex items-start gap-4">
              <LeadAvatar name={lead.name} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h2 className="text-xl font-bold text-foreground font-['Plus_Jakarta_Sans']">{lead.name}</h2>
                    <p className="text-sm text-muted-foreground">{lead.businessType}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <SourceBadge source={lead.source} />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-foreground hover:text-[#2B7FBF] transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-[#2B7FBF]" />
                    </div>
                    <span className="truncate">{lead.email}</span>
                  </a>
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-foreground hover:text-[#2B7FBF] transition-colors group">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-[#2B7FBF]" />
                      </div>
                      <span>{lead.phone}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <span>Added {formatDate(lead.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Notes</p>
                <p className="text-sm text-foreground leading-relaxed">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Add Note */}
          <div className="lmm-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-[#2B7FBF]" />
              <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans']">Add Note</h3>
            </div>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note, call summary, or follow-up..."
              rows={3}
              className="resize-none mb-3"
            />
            <Button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              size="sm"
              className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Save Note
            </Button>
          </div>

          {/* Activity Timeline */}
          <div className="lmm-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border/60">
              <TrendingUp className="w-4 h-4 text-[#2B7FBF]" />
              <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans']">Activity Timeline</h3>
            </div>
            <div className="px-5 py-4">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border/60" />
                  <div className="space-y-4">
                    {activities.map((act) => (
                      <div key={act.id} className="flex items-start gap-3 relative">
                        <div className="w-7 h-7 rounded-full bg-card border-2 border-border flex items-center justify-center flex-shrink-0 z-10 text-sm">
                          {activityIcon[act.type] ?? "📌"}
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-sm text-foreground leading-snug">{act.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(act.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Deals ──────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="lmm-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F47B3A]" />
                <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans']">Deals</h3>
                <span className="bg-muted text-muted-foreground text-xs rounded-full px-1.5 py-0.5 font-medium">
                  {deals.length}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddDeal(true)}
                className="text-xs gap-1 text-[#2B7FBF] hover:text-[#1A5F96]"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
            <div className="divide-y divide-border/30">
              {deals.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-muted-foreground mb-3">No deals yet.</p>
                  <Button size="sm" onClick={() => setShowAddDeal(true)} className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Create Deal
                  </Button>
                </div>
              ) : (
                deals.map((deal) => (
                  <div key={deal.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-foreground leading-tight">{deal.title}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => { deleteDeal(deal.id); refresh(); toast.success("Deal removed."); }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <StageBadge stage={deal.stage} />
                      <span className="text-sm font-bold text-foreground">{formatCurrency(deal.value)}</span>
                    </div>
                    {deal.notes && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{deal.notes}</p>
                    )}
                    {/* Stage changer */}
                    <div className="mt-3">
                      <Select
                        value={deal.stage}
                        onValueChange={(v) => {
                          updateDeal(deal.id, { stage: v as PipelineStage });
                          refresh();
                          toast.success(`Moved to ${v}`);
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs border-border/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PIPELINE_STAGES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary card */}
          <div className="lmm-card p-5">
            <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans'] mb-3">Deal Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total deals</span>
                <span className="font-semibold">{deals.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total value</span>
                <span className="font-semibold">{formatCurrency(deals.reduce((s, d) => s + d.value, 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Won</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(deals.filter((d) => d.stage === "Closed Won").reduce((s, d) => s + d.value, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Lead Modal */}
      <Dialog open={showEditLead} onOpenChange={setShowEditLead}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Plus_Jakarta_Sans']">Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold mb-1.5 block">Full Name</Label>
              <Input value={editForm.name ?? ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-9" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold mb-1.5 block">Email</Label>
              <Input type="email" value={editForm.email ?? ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="h-9" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold mb-1.5 block">Phone</Label>
              <Input value={editForm.phone ?? ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="h-9" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold mb-1.5 block">Business Type</Label>
              <Input value={editForm.businessType ?? ""} onChange={(e) => setEditForm({ ...editForm, businessType: e.target.value })} className="h-9" />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Source</Label>
              <Select value={editForm.source} onValueChange={(v) => setEditForm({ ...editForm, source: v as LeadSource })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Website","Ads","Referral","Social","Manual"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as LeadStatus })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["New","Active","Qualified","Closed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-semibold mb-1.5 block">Notes</Label>
              <Textarea value={editForm.notes ?? ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={3} className="resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditLead(false)}>Cancel</Button>
            <Button onClick={handleEditSave} className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Deal Modal */}
      <Dialog open={showAddDeal} onOpenChange={setShowAddDeal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Plus_Jakarta_Sans']">Create Deal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Deal Title *</Label>
              <Input value={dealForm.title} onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })} placeholder="Website Redesign Package" className="h-9" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Value ($)</Label>
                <Input type="number" value={dealForm.value} onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })} placeholder="2500" className="h-9" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Stage</Label>
                <Select value={dealForm.stage} onValueChange={(v) => setDealForm({ ...dealForm, stage: v as PipelineStage })}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PIPELINE_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Notes</Label>
              <Textarea value={dealForm.notes} onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })} rows={2} className="resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDeal(false)}>Cancel</Button>
            <Button onClick={handleAddDeal} className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white">Create Deal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-['Plus_Jakarta_Sans']">Delete Lead</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete <strong>{lead.name}</strong>? All associated deals and activity will be removed permanently.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
