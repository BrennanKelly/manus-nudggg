/*
 * Dashboard — LMM CRM
 * Design: Warm Professional — stat cards, recent leads, activity feed
 * Hero banner uses generated sandy/blue wave image
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Plus,
  ArrowRight,
  Activity as ActivityIcon,
  Zap,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { StatCard, LeadAvatar, StageBadge, SourceBadge } from "@/components/CrmComponents";
import {
  getDashboardStats,
  getLeads,
  getDeals,
  getActivities,
  formatCurrency,
  formatRelativeTime,
  type Lead,
  type Deal,
  type Activity,
} from "@/lib/data";

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663365056642/ipzQktn7ZH3RbJV86Ex7si/lmm-dashboard-hero-9AQSn9dK6FJfgnLpWcZdYJ.webp";

export default function Dashboard() {
  const [stats, setStats] = useState(getDashboardStats());
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentDeals, setRecentDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setStats(getDashboardStats());
    const leads = getLeads().slice(0, 5);
    setRecentLeads(leads);
    setRecentDeals(getDeals().slice(0, 6));
    setActivities(getActivities().slice(0, 8));
  }, []);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`Welcome back — ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
      breadcrumbs={[{ label: "Dashboard" }]}
      actions={
        <Link href="/leads/new">
          <Button className="bg-[#2B7FBF] hover:bg-[#1A5F96] text-white gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
        </Link>
      }
    >
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-6 h-36 sm:h-44"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A5F96]/70 via-[#2B7FBF]/40 to-transparent" />
        <div className="relative z-10 flex items-center h-full px-6 sm:px-8">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Lake Michigan Marketing</p>
            <h2 className="text-white text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
              Your pipeline is<br />
              <span className="text-[#F4B97A]">looking strong.</span>
            </h2>
          </div>
          <div className="ml-auto hidden sm:flex flex-col items-end gap-1">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white text-right">
              <p className="text-xs opacity-80">Pipeline Value</p>
              <p className="text-xl font-bold font-['Plus_Jakarta_Sans']">
                {formatCurrency(stats.pipelineValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
          <StatCard
            label="Total Leads"
            value={stats.totalLeads}
            sub={`${stats.newLeads} new this week`}
            icon={<Users className="w-5 h-5" />}
            accent="blue"
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <StatCard
            label="Active Deals"
            value={stats.activeDeals}
            sub="In pipeline"
            icon={<TrendingUp className="w-5 h-5" />}
            accent="orange"
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <StatCard
            label="Revenue Won"
            value={formatCurrency(stats.totalRevenue)}
            sub={`${stats.closedWon} deals closed`}
            icon={<DollarSign className="w-5 h-5" />}
            accent="green"
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <StatCard
            label="Pipeline Value"
            value={formatCurrency(stats.pipelineValue)}
            sub="Excl. closed lost"
            icon={<CheckCircle2 className="w-5 h-5" />}
            accent="blue"
          />
        </div>
      </div>

      {/* ── Main content grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="xl:col-span-2">
          <div className="lmm-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2B7FBF]" />
                <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans']">Recent Leads</h3>
              </div>
              <Link href="/leads">
                <Button variant="ghost" size="sm" className="text-xs text-[#2B7FBF] hover:text-[#1A5F96] gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-border/40">
              {recentLeads.map((lead) => (
                <Link key={lead.id} href={`/leads/${lead.id}`}>
                  <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer">
                    <LeadAvatar name={lead.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{lead.businessType} · {lead.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                      <SourceBadge source={lead.source} />
                    </div>
                    <p className="text-xs text-muted-foreground flex-shrink-0 hidden md:block">
                      {formatRelativeTime(lead.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="lmm-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[#F47B3A]" />
              <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans']">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Link href="/leads/new">
                <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9 border-border/60 hover:border-[#2B7FBF]/40 hover:bg-blue-50/50">
                  <Plus className="w-4 h-4 text-[#2B7FBF]" />
                  Add New Lead
                </Button>
              </Link>
              <Link href="/pipeline">
                <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9 border-border/60 hover:border-[#F47B3A]/40 hover:bg-orange-50/50">
                  <TrendingUp className="w-4 h-4 text-[#F47B3A]" />
                  View Pipeline
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9 border-border/60 hover:border-green-400/40 hover:bg-green-50/50"
                onClick={() => {
                  import("sonner").then(({ toast }) => toast.info("Email automation coming soon!"));
                }}
              >
                <Mail className="w-4 h-4 text-green-600" />
                Send Follow-up
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9 border-border/60"
                onClick={() => {
                  import("sonner").then(({ toast }) => toast.info("SMS automation coming soon!"));
                }}
              >
                <Phone className="w-4 h-4 text-purple-600" />
                Log a Call
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lmm-card overflow-hidden flex-1">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border/60">
              <ActivityIcon className="w-4 h-4 text-[#2B7FBF]" />
              <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans']">Recent Activity</h3>
            </div>
            <div className="px-5 py-3 space-y-3 max-h-72 overflow-y-auto">
              {activities.map((act) => {
                const typeIconMap: Record<string, string> = {
                  created: "🆕",
                  email: "📧",
                  call: "📞",
                  stage_change: "🔄",
                  note: "📝",
                };
                const typeIcon = typeIconMap[act.type] ?? "📌";
                return (
                  <div key={act.id} className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0 mt-0.5">{typeIcon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-snug">{act.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatRelativeTime(act.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Pipeline snapshot ─────────────────────────────────────────── */}
      <div className="mt-6 lmm-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#F47B3A]" />
            <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans']">Pipeline Snapshot</h3>
          </div>
          <Link href="/pipeline">
            <Button variant="ghost" size="sm" className="text-xs text-[#2B7FBF] hover:text-[#1A5F96] gap-1">
              Full pipeline <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deal</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Lead</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stage</th>
                <th className="text-right px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {recentDeals.map((deal) => {
                const lead = getLeads().find((l) => l.id === deal.leadId);
                return (
                  <tr key={deal.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{deal.title}</p>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      {lead && (
                        <div className="flex items-center gap-2">
                          <LeadAvatar name={lead.name} size="sm" />
                          <span className="text-xs text-muted-foreground truncate max-w-[120px]">{lead.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <StageBadge stage={deal.stage} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-semibold text-foreground">{formatCurrency(deal.value)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
