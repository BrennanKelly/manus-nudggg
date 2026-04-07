/*
 * Pipeline — LMM CRM
 * Design: Warm Professional — horizontal Kanban with dnd-kit drag-and-drop
 * 6 stages: New Lead → Contacted → Qualified → Proposal Sent → Closed Won → Closed Lost
 */

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "wouter";
import {
  Plus,
  GripVertical,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { LeadAvatar, StageBadge } from "@/components/CrmComponents";
import {
  getDeals,
  getLeads,
  updateDeal,
  createDeal,
  deleteDeal,
  formatCurrency,
  PIPELINE_STAGES,
  STAGE_COLORS,
  type Deal,
  type Lead,
  type PipelineStage,
} from "@/lib/data";

// ─── Deal Card (sortable) ─────────────────────────────────────────────────────

function DealCard({
  deal,
  lead,
  isDragging = false,
  onDelete,
}: {
  deal: Deal;
  lead?: Lead;
  isDragging?: boolean;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card rounded-xl border border-border/60 p-3.5 shadow-sm group
        ${isDragging ? "ring-2 ring-[#2B7FBF]/40" : "hover:shadow-md hover:-translate-y-0.5"}
        transition-all duration-150 cursor-default`}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm font-semibold text-foreground leading-tight flex-1 font-['Plus_Jakarta_Sans']">
          {deal.title}
        </p>
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0 mt-0.5 touch-none"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {lead && (
        <Link href={`/leads/${lead.id}`}>
          <div className="flex items-center gap-2 mb-2.5 group/lead cursor-pointer">
            <LeadAvatar name={lead.name} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate group-hover/lead:text-[#2B7FBF] transition-colors">
                {lead.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{lead.businessType}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground/0 group-hover/lead:text-muted-foreground/60 transition-colors ml-auto flex-shrink-0" />
          </div>
        </Link>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm font-bold text-foreground">
          <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
          {formatCurrency(deal.value).replace("$", "")}
        </div>
        <button
          onClick={() => onDelete(deal.id)}
          className="text-[10px] text-muted-foreground/0 group-hover:text-muted-foreground/60 hover:!text-destructive transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── Drag Overlay Card ────────────────────────────────────────────────────────

function DragOverlayCard({ deal, lead }: { deal: Deal; lead?: Lead }) {
  return (
    <div className="bg-card rounded-xl border-2 border-[#2B7FBF]/40 p-3.5 shadow-2xl rotate-1 scale-105 cursor-grabbing">
      <p className="text-sm font-semibold text-foreground mb-1.5 font-['Plus_Jakarta_Sans']">{deal.title}</p>
      {lead && (
        <div className="flex items-center gap-2 mb-2">
          <LeadAvatar name={lead.name} size="sm" />
          <p className="text-xs text-muted-foreground">{lead.name}</p>
        </div>
      )}
      <p className="text-sm font-bold text-foreground">{formatCurrency(deal.value)}</p>
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  deals,
  leads,
  onDelete,
  onAddDeal,
}: {
  stage: PipelineStage;
  deals: Deal[];
  leads: Lead[];
  onDelete: (id: string) => void;
  onAddDeal: (stage: PipelineStage) => void;
}) {
  const colors = STAGE_COLORS[stage];
  const totalValue = deals.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col w-64 flex-shrink-0">
      {/* Column header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
            <span className="text-xs font-bold text-foreground font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              {stage}
            </span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {deals.length}
            </span>
          </div>
          <button
            onClick={() => onAddDeal(stage)}
            className="text-muted-foreground/50 hover:text-[#2B7FBF] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        {totalValue > 0 && (
          <p className="text-[10px] text-muted-foreground pl-4">
            {formatCurrency(totalValue)} total
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        className={`flex-1 rounded-xl p-2 min-h-[120px] transition-colors
          ${deals.length === 0 ? "border-2 border-dashed border-border/40" : "bg-muted/20"}`}
      >
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {deals.map((deal) => {
              const lead = leads.find((l) => l.id === deal.leadId);
              return (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  lead={lead}
                  onDelete={onDelete}
                />
              );
            })}
          </div>
        </SortableContext>
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-16">
            <p className="text-xs text-muted-foreground/50">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pipeline Page ────────────────────────────────────────────────────────────

export default function Pipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [addDealStage, setAddDealStage] = useState<PipelineStage>("New Lead");
  const [dealForm, setDealForm] = useState({ title: "", leadId: "", value: "", notes: "" });

  function refresh() {
    setDeals(getDeals());
    setLeads(getLeads());
  }

  useEffect(() => { refresh(); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const dealsByStage = useCallback(
    (stage: PipelineStage) => deals.filter((d) => d.stage === stage),
    [deals]
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine if we're over a stage column or another deal
    const activeDeal = deals.find((d) => d.id === activeId);
    if (!activeDeal) return;

    // Check if overId is a stage name
    const overStage = PIPELINE_STAGES.find((s) => s === overId);
    if (overStage && activeDeal.stage !== overStage) {
      setDeals((prev) =>
        prev.map((d) => d.id === activeId ? { ...d, stage: overStage } : d)
      );
      return;
    }

    // Check if overId is a deal — move to that deal's stage
    const overDeal = deals.find((d) => d.id === overId);
    if (overDeal && activeDeal.stage !== overDeal.stage) {
      setDeals((prev) =>
        prev.map((d) => d.id === activeId ? { ...d, stage: overDeal.stage } : d)
      );
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event;
    const activeId = active.id as string;
    const updatedDeal = deals.find((d) => d.id === activeId);
    if (updatedDeal) {
      updateDeal(activeId, { stage: updatedDeal.stage });
    }
    setActiveDragId(null);
  }

  function handleDeleteDeal(id: string) {
    deleteDeal(id);
    refresh();
    toast.success("Deal removed.");
  }

  function openAddDeal(stage: PipelineStage) {
    setAddDealStage(stage);
    setDealForm({ title: "", leadId: "", value: "", notes: "" });
    setShowAddDeal(true);
  }

  function handleCreateDeal() {
    if (!dealForm.title) { toast.error("Deal title is required."); return; }
    createDeal({
      leadId: dealForm.leadId || leads[0]?.id || "",
      title: dealForm.title,
      value: parseFloat(dealForm.value) || 0,
      stage: addDealStage,
      notes: dealForm.notes,
    });
    setShowAddDeal(false);
    refresh();
    toast.success("Deal created.");
  }

  const activeDeal = activeDragId ? deals.find((d) => d.id === activeDragId) : null;
  const activeLead = activeDeal ? leads.find((l) => l.id === activeDeal.leadId) : undefined;

  // Pipeline totals
  const totalPipelineValue = deals
    .filter((d) => d.stage !== "Closed Lost")
    .reduce((s, d) => s + d.value, 0);
  const wonValue = deals
    .filter((d) => d.stage === "Closed Won")
    .reduce((s, d) => s + d.value, 0);

  return (
    <DashboardLayout
      title="Pipeline"
      subtitle="Drag deals between stages to update their status"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Pipeline" }]}
      actions={
        <Button
          onClick={() => openAddDeal("New Lead")}
          className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </Button>
      }
    >
      {/* Pipeline summary */}
      <div className="flex items-center gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pipeline:</span>
          <span className="text-sm font-bold text-foreground">{formatCurrency(totalPipelineValue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Won:</span>
          <span className="text-sm font-bold text-green-600">{formatCurrency(wonValue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Deals:</span>
          <span className="text-sm font-bold text-foreground">{deals.length}</span>
        </div>
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 min-w-max">
            {PIPELINE_STAGES.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                deals={dealsByStage(stage)}
                leads={leads}
                onDelete={handleDeleteDeal}
                onAddDeal={openAddDeal}
              />
            ))}
          </div>

          <DragOverlay>
            {activeDeal && (
              <DragOverlayCard deal={activeDeal} lead={activeLead} />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Add Deal Modal */}
      <Dialog open={showAddDeal} onOpenChange={setShowAddDeal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Plus_Jakarta_Sans']">Add Deal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Deal Title *</Label>
              <Input
                value={dealForm.title}
                onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                placeholder="Website Redesign Package"
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Associated Lead</Label>
              <Select value={dealForm.leadId} onValueChange={(v) => setDealForm({ ...dealForm, leadId: v })}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a lead..." />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name} — {l.businessType}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Value ($)</Label>
                <Input
                  type="number"
                  value={dealForm.value}
                  onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                  placeholder="2500"
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Stage</Label>
                <Select value={addDealStage} onValueChange={(v) => setAddDealStage(v as PipelineStage)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PIPELINE_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Notes</Label>
              <Textarea
                value={dealForm.notes}
                onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDeal(false)}>Cancel</Button>
            <Button onClick={handleCreateDeal} className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white">
              Create Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
