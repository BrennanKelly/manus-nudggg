/*
 * CrmComponents — Shared LMM CRM UI primitives
 * Design: Warm Professional — pill badges, gradient avatars, empty states
 */

import { cn } from "@/lib/utils";
import {
  STAGE_COLORS,
  SOURCE_COLORS,
  getInitials,
  getAvatarGradient,
  type PipelineStage,
} from "@/lib/data";

// ─── Stage Badge ──────────────────────────────────────────────────────────────

export function StageBadge({ stage }: { stage: PipelineStage }) {
  const colors = STAGE_COLORS[stage];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        colors.bg,
        colors.text,
        colors.border
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", colors.dot)} />
      {stage}
    </span>
  );
}

// ─── Source Badge ─────────────────────────────────────────────────────────────

export function SourceBadge({ source }: { source: string }) {
  const cls = SOURCE_COLORS[source] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium", cls)}>
      {source}
    </span>
  );
}

// ─── Lead Avatar ──────────────────────────────────────────────────────────────

export function LeadAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const gradient = getAvatarGradient(name);
  const initials = getInitials(name);
  const sizeClass = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  }[size];

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold flex-shrink-0",
        gradient,
        sizeClass
      )}
    >
      {initials}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  action,
  imageUrl,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  imageUrl?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="w-24 h-24 mb-4 opacity-80" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-1 font-['Plus_Jakarta_Sans']">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: "blue" | "orange" | "green" | "red";
}) {
  const accentClass = {
    blue: "stat-card-blue",
    orange: "stat-card-orange",
    green: "stat-card-green",
    red: "stat-card-red",
  }[accent];

  const iconBg = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  }[accent];

  return (
    <div className={cn("lmm-card p-5", accentClass)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground font-['Plus_Jakarta_Sans'] leading-none">
            {value}
          </p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
