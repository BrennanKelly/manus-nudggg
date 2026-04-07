/*
 * Settings — LMM CRM
 * Design: Warm Professional — API docs, env var setup, integration guide
 */

import { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Database,
  Mail,
  MessageSquare,
  Info,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border/60">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/60">
        <span className="text-xs font-mono text-muted-foreground">{lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs font-mono text-foreground overflow-x-auto bg-card leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="lmm-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/60 bg-muted/20">
        <div className="text-[#2B7FBF]">{icon}</div>
        <h3 className="font-semibold text-sm font-['Plus_Jakarta_Sans']">{title}</h3>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

const LEAD_ENDPOINT_EXAMPLE = `POST https://your-vercel-app.vercel.app/api/leads
Content-Type: application/json

{
  "name": "Sarah Johnson",
  "email": "sarah@coastalrealty.com",
  "phone": "(616) 555-0182",
  "message": "Interested in website redesign",
  "source": "Website"
}`;

const LEAD_RESPONSE_EXAMPLE = `{
  "success": true,
  "message": "Lead captured successfully",
  "lead": {
    "id": "lead_abc123",
    "name": "Sarah Johnson",
    "email": "sarah@coastalrealty.com",
    "createdAt": "2026-04-07T10:00:00Z"
  }
}`;

const WEBSITE_FORM_EXAMPLE = `// Connect your website contact form to the CRM
async function submitContactForm(formData) {
  const response = await fetch('https://your-crm.vercel.app/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      source: 'Website'
    })
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('Lead captured:', result.lead.id);
  }
}`;

const ENV_VARS_EXAMPLE = `# Supabase (database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (email notifications)
RESEND_API_KEY=re_your_api_key

# Notification recipient
NOTIFICATION_EMAIL=info@lakemichiganmarketing.com`;

const SUPABASE_SCHEMA = `-- Run this in Supabase SQL Editor
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT,
  source TEXT DEFAULT 'Website',
  status TEXT DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  stage TEXT DEFAULT 'New Lead',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;`;

const RESEND_TEMPLATE = `// /api/leads route — email notification via Resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'CRM <crm@lakemichiganmarketing.com>',
  to: ['info@lakemichiganmarketing.com'],
  subject: \`New Lead: \${lead.name}\`,
  html: \`
    <h2>New Lead Captured</h2>
    <p><strong>Name:</strong> \${lead.name}</p>
    <p><strong>Email:</strong> \${lead.email}</p>
    <p><strong>Phone:</strong> \${lead.phone}</p>
    <p><strong>Source:</strong> \${lead.source}</p>
    <p><strong>Message:</strong> \${lead.message}</p>
  \`
});`;

export default function Settings() {
  return (
    <DashboardLayout
      title="Settings & Integration"
      subtitle="API documentation, environment setup, and integration guides"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Status Banner */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#2B7FBF] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#1A5F96] font-['Plus_Jakarta_Sans']">
              This CRM is ready for Vercel deployment
            </p>
            <p className="text-xs text-[#2B7FBF]/80 mt-0.5 leading-relaxed">
              The frontend is fully functional with localStorage. To connect Supabase and Resend, follow the setup guides below and deploy to Vercel. The <code className="bg-blue-100 px-1 rounded font-mono">/api/leads</code> endpoint will be live automatically.
            </p>
          </div>
        </div>

        {/* API Endpoint */}
        <Section title="Lead Capture API Endpoint" icon={<Code2 className="w-4 h-4" />}>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            This endpoint accepts lead submissions from your website (<strong>lakemichiganmarketing.com</strong>) and any other source. It stores the lead in Supabase and sends an email notification via Resend.
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Request</p>
              <CodeBlock code={LEAD_ENDPOINT_EXAMPLE} lang="http" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Response</p>
              <CodeBlock code={LEAD_RESPONSE_EXAMPLE} lang="json" />
            </div>
          </div>
        </Section>

        {/* Website Connection */}
        <Section title="Connect lakemichiganmarketing.com" icon={<ExternalLink className="w-4 h-4" />}>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Add this JavaScript snippet to your website's contact form submit handler. Every form submission will flow directly into this CRM and trigger an email notification to <strong>info@lakemichiganmarketing.com</strong>.
          </p>
          <CodeBlock code={WEBSITE_FORM_EXAMPLE} lang="javascript" />
          <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
            <p className="text-xs text-orange-700 font-medium">
              <strong>CORS Note:</strong> Add <code className="bg-orange-100 px-1 rounded font-mono">https://lakemichiganmarketing.com</code> to your Vercel project's allowed origins in the <code className="bg-orange-100 px-1 rounded font-mono">/api/leads</code> route headers.
            </p>
          </div>
        </Section>

        {/* Environment Variables */}
        <Section title="Environment Variables" icon={<Zap className="w-4 h-4" />}>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Add these to your Vercel project settings under <strong>Settings → Environment Variables</strong>. Never commit API keys to your repository.
          </p>
          <CodeBlock code={ENV_VARS_EXAMPLE} lang=".env" />
        </Section>

        {/* Supabase Schema */}
        <Section title="Supabase Database Schema" icon={<Database className="w-4 h-4" />}>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Run this SQL in your Supabase project's SQL Editor to create the required tables. Supabase provides a hosted PostgreSQL database with a REST API — perfect for Vercel serverless functions.
          </p>
          <CodeBlock code={SUPABASE_SCHEMA} lang="sql" />
          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#2B7FBF] hover:text-[#1A5F96] font-medium"
            >
              Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Section>

        {/* Resend Email */}
        <Section title="Email Notifications (Resend)" icon={<Mail className="w-4 h-4" />}>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Every new lead triggers an email to <strong>info@lakemichiganmarketing.com</strong> with full lead details. Uses Resend — the recommended email API for Vercel/Next.js projects.
          </p>
          <CodeBlock code={RESEND_TEMPLATE} lang="typescript" />
          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://resend.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#2B7FBF] hover:text-[#1A5F96] font-medium"
            >
              Get Resend API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Section>

        {/* Automation Hooks */}
        <Section title="Automation-Ready Hooks" icon={<MessageSquare className="w-4 h-4" />}>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            The CRM is structured for easy automation expansion. These hooks are ready to wire up when you're ready to scale:
          </p>
          <div className="space-y-3">
            {[
              { label: "SMS via Twilio", desc: "Trigger SMS to lead on creation or stage change. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN env vars.", status: "Ready to wire" },
              { label: "Auto email reply", desc: "Send automated welcome email to new leads via Resend. Template ready in /api/leads route.", status: "Ready to wire" },
              { label: "Pipeline stage triggers", desc: "Fire webhooks or automations when a deal moves to Proposal Sent or Closed Won.", status: "Ready to wire" },
              { label: "Zapier / Make.com", desc: "Connect the /api/leads endpoint as a Zap trigger to automate any downstream workflow.", status: "Ready to wire" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}
