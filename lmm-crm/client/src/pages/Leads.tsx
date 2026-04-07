/*
 * Leads — LMM CRM
 * Design: Warm Professional — table + card views, add/edit/delete modals
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Trash2,
  Edit2,
  Eye,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { LeadAvatar, SourceBadge, EmptyState } from "@/components/CrmComponents";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  formatDate,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "@/lib/data";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  businessType: "",
  source: "Website" as LeadSource,
  status: "New" as LeadStatus,
  notes: "",
};

const EMPTY_STATE_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663365056642/ipzQktn7ZH3RbJV86Ex7si/lmm-empty-state-Droa3eMK9gytCvaZN9U3ru.webp";

export default function Leads() {
  const [, navigate] = useLocation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Lead | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  // Check for ?new=1 query param
  useEffect(() => {
    if (window.location.search.includes("new=1")) {
      openAdd();
    }
  }, []);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.businessType.toLowerCase().includes(q);
    const matchSource = filterSource === "all" || l.source === filterSource;
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchSource && matchStatus;
  });

  function openAdd() {
    setEditingLead(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      businessType: lead.businessType,
      source: lead.source,
      status: lead.status,
      notes: lead.notes,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.email) {
      toast.error("Name and email are required.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    if (editingLead) {
      updateLead(editingLead.id, form);
      toast.success("Lead updated successfully.");
    } else {
      createLead(form);
      toast.success("Lead added successfully.");
    }
    setLeads(getLeads());
    setShowForm(false);
    setSaving(false);
  }

  function handleDelete(lead: Lead) {
    deleteLead(lead.id);
    setLeads(getLeads());
    setDeleteConfirm(null);
    toast.success(`${lead.name} has been removed.`);
  }

  const statusColors: Record<string, string> = {
    New: "bg-blue-50 text-blue-700",
    Active: "bg-amber-50 text-amber-700",
    Qualified: "bg-green-50 text-green-700",
    Closed: "bg-gray-100 text-gray-600",
  };

  return (
    <DashboardLayout
      title="Leads"
      subtitle={`${filtered.length} lead${filtered.length !== 1 ? "s" : ""} found`}
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Leads" }]}
      actions={
        <Button
          onClick={openAdd}
          className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </Button>
      }
    >
      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-card border-border/60"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-36 h-9 bg-card border-border/60 text-sm">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="Website">Website</SelectItem>
            <SelectItem value="Ads">Ads</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
            <SelectItem value="Social">Social</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-9 bg-card border-border/60 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1 bg-card border border-border/60 rounded-lg p-1">
          <button
            onClick={() => setView("table")}
            className={`p-1.5 rounded-md transition-colors ${view === "table" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("card")}
            className={`p-1.5 rounded-md transition-colors ${view === "card" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Empty State ───────────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="lmm-card">
          <EmptyState
            title="No leads found"
            description={search ? `No leads match "${search}". Try a different search.` : "Add your first lead to get started."}
            imageUrl={EMPTY_STATE_IMG}
            action={
              <Button onClick={openAdd} className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white gap-2">
                <Plus className="w-4 h-4" /> Add Lead
              </Button>
            }
          />
        </div>
      )}

      {/* ── Table View ────────────────────────────────────────────────── */}
      {filtered.length > 0 && view === "table" && (
        <div className="lmm-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lead</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Business</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Source</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Added</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-muted/20 transition-colors animate-slide-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <LeadAvatar name={lead.name} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-foreground">{lead.businessType}</p>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <SourceBadge source={lead.source} />
                    </td>
                    <td className="px-3 py-3.5 hidden lg:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 hidden xl:table-cell">
                      <p className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-[#2B7FBF]">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-[#F47B3A]"
                          onClick={() => openEdit(lead)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteConfirm(lead)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Card View ─────────────────────────────────────────────────── */}
      {filtered.length > 0 && view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((lead, i) => (
            <div
              key={lead.id}
              className="lmm-card p-4 animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <LeadAvatar name={lead.name} size="lg" />
                <SourceBadge source={lead.source} />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-0.5 font-['Plus_Jakarta_Sans']">
                {lead.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">{lead.businessType}</p>
              <p className="text-xs text-muted-foreground truncate mb-3">{lead.email}</p>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
                <div className="flex items-center gap-1">
                  <Link href={`/leads/${lead.id}`}>
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-[#2B7FBF]">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-muted-foreground hover:text-[#F47B3A]"
                    onClick={() => openEdit(lead)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteConfirm(lead)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Modal ────────────────────────────────────────────── */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Plus_Jakarta_Sans']">
              {editingLead ? "Edit Lead" : "Add New Lead"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold mb-1.5 block">Full Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sarah Johnson"
                className="h-9"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold mb-1.5 block">Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="sarah@example.com"
                className="h-9"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold mb-1.5 block">Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(616) 555-0182"
                className="h-9"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold mb-1.5 block">Business Type</Label>
              <Input
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                placeholder="Real Estate"
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Source</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v as LeadSource })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Ads">Ads</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-semibold mb-1.5 block">Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any relevant details about this lead..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white"
            >
              {saving ? "Saving..." : editingLead ? "Save Changes" : "Add Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ────────────────────────────────────────────── */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-['Plus_Jakarta_Sans']">Delete Lead</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This will also remove all associated deals and activity. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
