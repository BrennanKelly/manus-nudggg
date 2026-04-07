/*
 * LMM CRM — Data Layer
 * Types, mock data, and localStorage-backed state management.
 * Designed to be drop-in replaceable with Supabase calls.
 */

export type LeadSource = "Website" | "Ads" | "Manual" | "Referral" | "Social";
export type LeadStatus = "New" | "Active" | "Qualified" | "Closed";

export type PipelineStage =
  | "New Lead"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Closed Won"
  | "Closed Lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  leadId: string;
  title: string;
  value: number;
  stage: PipelineStage;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: "note" | "email" | "call" | "stage_change" | "created";
  description: string;
  createdAt: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_LEADS: Lead[] = [
  {
    id: "lead-001",
    name: "Sarah Johnson",
    email: "sarah@coastalrealty.com",
    phone: "(616) 555-0182",
    businessType: "Real Estate",
    source: "Website",
    status: "Active",
    notes: "Interested in full website redesign + lead gen package. Has existing WordPress site.",
    createdAt: "2026-03-28T10:15:00Z",
    updatedAt: "2026-04-01T14:30:00Z",
  },
  {
    id: "lead-002",
    name: "Marcus Rivera",
    email: "marcus@lakeviewlegal.com",
    phone: "(312) 555-0247",
    businessType: "Legal Services",
    source: "Ads",
    status: "Qualified",
    notes: "Needs SEO + Google Ads management. Budget ~$2k/mo. Ready to move forward.",
    createdAt: "2026-03-30T09:00:00Z",
    updatedAt: "2026-04-03T11:00:00Z",
  },
  {
    id: "lead-003",
    name: "Emily Chen",
    email: "emily@harbormedispa.com",
    phone: "(414) 555-0391",
    businessType: "Med Spa",
    source: "Referral",
    status: "New",
    notes: "Referred by Sarah Johnson. Looking for social media automation.",
    createdAt: "2026-04-02T16:45:00Z",
    updatedAt: "2026-04-02T16:45:00Z",
  },
  {
    id: "lead-004",
    name: "Derek Hoffman",
    email: "derek@michiganroofpros.com",
    phone: "(269) 555-0128",
    businessType: "Home Services",
    source: "Website",
    status: "Active",
    notes: "Wants a new website with lead capture forms and CRM integration.",
    createdAt: "2026-04-01T08:30:00Z",
    updatedAt: "2026-04-04T09:15:00Z",
  },
  {
    id: "lead-005",
    name: "Priya Nair",
    email: "priya@sunsetbakery.com",
    phone: "(773) 555-0564",
    businessType: "Food & Beverage",
    source: "Social",
    status: "New",
    notes: "Small bakery, interested in Instagram automation and email marketing.",
    createdAt: "2026-04-05T13:20:00Z",
    updatedAt: "2026-04-05T13:20:00Z",
  },
  {
    id: "lead-006",
    name: "Tom Walters",
    email: "tom@waltersautoglass.com",
    phone: "(616) 555-0733",
    businessType: "Auto Services",
    source: "Manual",
    status: "Closed",
    notes: "Signed full package. Website live. Monthly SEO retainer active.",
    createdAt: "2026-03-15T11:00:00Z",
    updatedAt: "2026-03-29T16:00:00Z",
  },
];

const SEED_DEALS: Deal[] = [
  {
    id: "deal-001",
    leadId: "lead-001",
    title: "Coastal Realty — Website + Lead Gen",
    value: 4500,
    stage: "Proposal Sent",
    notes: "Proposal sent via email. Follow up Friday.",
    createdAt: "2026-04-01T14:30:00Z",
    updatedAt: "2026-04-03T10:00:00Z",
  },
  {
    id: "deal-002",
    leadId: "lead-002",
    title: "Lakeview Legal — SEO + Ads",
    value: 2400,
    stage: "Qualified",
    notes: "Monthly retainer. Contract review in progress.",
    createdAt: "2026-04-03T11:00:00Z",
    updatedAt: "2026-04-05T09:00:00Z",
  },
  {
    id: "deal-003",
    leadId: "lead-003",
    title: "Harbor Medi Spa — Social Automation",
    value: 1800,
    stage: "New Lead",
    notes: "Initial discovery call scheduled for Monday.",
    createdAt: "2026-04-02T17:00:00Z",
    updatedAt: "2026-04-02T17:00:00Z",
  },
  {
    id: "deal-004",
    leadId: "lead-004",
    title: "Michigan Roof Pros — Website + CRM",
    value: 3200,
    stage: "Contacted",
    notes: "Sent intro email. Waiting for response.",
    createdAt: "2026-04-04T09:15:00Z",
    updatedAt: "2026-04-04T09:15:00Z",
  },
  {
    id: "deal-005",
    leadId: "lead-006",
    title: "Walters Auto Glass — Full Package",
    value: 5800,
    stage: "Closed Won",
    notes: "Signed! Website live. Monthly SEO active.",
    createdAt: "2026-03-29T16:00:00Z",
    updatedAt: "2026-03-29T16:00:00Z",
  },
  {
    id: "deal-006",
    leadId: "lead-005",
    title: "Sunset Bakery — Email + Social",
    value: 900,
    stage: "New Lead",
    notes: "Small budget but good referral potential.",
    createdAt: "2026-04-05T13:30:00Z",
    updatedAt: "2026-04-05T13:30:00Z",
  },
];

const SEED_ACTIVITIES: Activity[] = [
  { id: "act-001", leadId: "lead-001", type: "created", description: "Lead created from website form", createdAt: "2026-03-28T10:15:00Z" },
  { id: "act-002", leadId: "lead-001", type: "email", description: "Sent welcome email with agency overview", createdAt: "2026-03-28T11:00:00Z" },
  { id: "act-003", leadId: "lead-001", type: "call", description: "Discovery call — 45 min. Great fit. Sending proposal.", createdAt: "2026-04-01T14:00:00Z" },
  { id: "act-004", leadId: "lead-001", type: "stage_change", description: "Stage moved to Proposal Sent", createdAt: "2026-04-01T14:30:00Z" },
  { id: "act-005", leadId: "lead-002", type: "created", description: "Lead created from Google Ads campaign", createdAt: "2026-03-30T09:00:00Z" },
  { id: "act-006", leadId: "lead-002", type: "call", description: "Intro call — confirmed budget and timeline", createdAt: "2026-04-03T10:00:00Z" },
  { id: "act-007", leadId: "lead-003", type: "created", description: "Lead created — referred by Sarah Johnson", createdAt: "2026-04-02T16:45:00Z" },
  { id: "act-008", leadId: "lead-006", type: "stage_change", description: "Stage moved to Closed Won — contract signed", createdAt: "2026-03-29T16:00:00Z" },
];

// ─── Storage helpers ───────────────────────────────────────────────────────────

const LS_LEADS = "lmm_leads";
const LS_DEALS = "lmm_deals";
const LS_ACTIVITIES = "lmm_activities";

function load<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {}
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Leads CRUD ───────────────────────────────────────────────────────────────

export function getLeads(): Lead[] {
  return load<Lead>(LS_LEADS, SEED_LEADS);
}

export function getLead(id: string): Lead | undefined {
  return getLeads().find((l) => l.id === id);
}

export function createLead(data: Omit<Lead, "id" | "createdAt" | "updatedAt">): Lead {
  const leads = getLeads();
  const now = new Date().toISOString();
  const lead: Lead = {
    ...data,
    id: `lead-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  leads.unshift(lead);
  save(LS_LEADS, leads);
  addActivity({ leadId: lead.id, type: "created", description: "Lead created manually" });
  return lead;
}

export function updateLead(id: string, data: Partial<Omit<Lead, "id" | "createdAt">>): Lead | undefined {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return undefined;
  leads[idx] = { ...leads[idx], ...data, updatedAt: new Date().toISOString() };
  save(LS_LEADS, leads);
  return leads[idx];
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter((l) => l.id !== id);
  save(LS_LEADS, leads);
  // Also remove associated deals and activities
  const deals = getDeals().filter((d) => d.leadId !== id);
  save(LS_DEALS, deals);
  const activities = getActivities().filter((a) => a.leadId !== id);
  save(LS_ACTIVITIES, activities);
}

// ─── Deals CRUD ───────────────────────────────────────────────────────────────

export function getDeals(): Deal[] {
  return load<Deal>(LS_DEALS, SEED_DEALS);
}

export function getDeal(id: string): Deal | undefined {
  return getDeals().find((d) => d.id === id);
}

export function getDealsForLead(leadId: string): Deal[] {
  return getDeals().filter((d) => d.leadId === leadId);
}

export function createDeal(data: Omit<Deal, "id" | "createdAt" | "updatedAt">): Deal {
  const deals = getDeals();
  const now = new Date().toISOString();
  const deal: Deal = {
    ...data,
    id: `deal-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  deals.unshift(deal);
  save(LS_DEALS, deals);
  return deal;
}

export function updateDeal(id: string, data: Partial<Omit<Deal, "id" | "createdAt">>): Deal | undefined {
  const deals = getDeals();
  const idx = deals.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  const prev = deals[idx];
  deals[idx] = { ...prev, ...data, updatedAt: new Date().toISOString() };
  save(LS_DEALS, deals);
  if (data.stage && data.stage !== prev.stage) {
    addActivity({ leadId: prev.leadId, type: "stage_change", description: `Deal moved to ${data.stage}` });
  }
  return deals[idx];
}

export function deleteDeal(id: string): void {
  const deals = getDeals().filter((d) => d.id !== id);
  save(LS_DEALS, deals);
}

// ─── Activities ───────────────────────────────────────────────────────────────

export function getActivities(): Activity[] {
  return load<Activity>(LS_ACTIVITIES, SEED_ACTIVITIES);
}

export function getActivitiesForLead(leadId: string): Activity[] {
  return getActivities()
    .filter((a) => a.leadId === leadId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addActivity(data: Omit<Activity, "id" | "createdAt">): Activity {
  const activities = getActivities();
  const activity: Activity = {
    ...data,
    id: `act-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  activities.unshift(activity);
  save(LS_ACTIVITIES, activities);
  return activity;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export function getDashboardStats() {
  const leads = getLeads();
  const deals = getDeals();
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const activeDeals = deals.filter((d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost").length;
  const closedWon = deals.filter((d) => d.stage === "Closed Won").length;
  const totalRevenue = deals.filter((d) => d.stage === "Closed Won").reduce((sum, d) => sum + d.value, 0);
  const pipelineValue = deals
    .filter((d) => d.stage !== "Closed Lost")
    .reduce((sum, d) => sum + d.value, 0);
  return { totalLeads, newLeads, activeDeals, closedWon, totalRevenue, pipelineValue };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export const PIPELINE_STAGES: PipelineStage[] = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Closed Won",
  "Closed Lost",
];

export const STAGE_COLORS: Record<PipelineStage, { bg: string; text: string; border: string; dot: string }> = {
  "New Lead":      { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500" },
  "Contacted":     { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  "Qualified":     { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500" },
  "Proposal Sent": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  "Closed Won":    { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500" },
  "Closed Lost":   { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500" },
};

export const SOURCE_COLORS: Record<string, string> = {
  Website: "bg-blue-100 text-blue-700",
  Ads: "bg-orange-100 text-orange-700",
  Manual: "bg-gray-100 text-gray-700",
  Referral: "bg-green-100 text-green-700",
  Social: "bg-pink-100 text-pink-700",
};

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function getAvatarGradient(name: string): string {
  const gradients = [
    "from-blue-400 to-cyan-500",
    "from-blue-500 to-indigo-600",
    "from-teal-400 to-blue-500",
    "from-indigo-400 to-purple-500",
    "from-orange-400 to-amber-500",
    "from-emerald-400 to-teal-500",
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}
