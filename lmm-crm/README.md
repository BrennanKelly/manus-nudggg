# LMM CRM — Lake Michigan Marketing

A modern, Vercel-compatible CRM built for Lake Michigan Marketing. Features lead management, a Kanban pipeline, dashboard analytics, and a serverless `POST /api/leads` endpoint for website form integration.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Database (production) | Supabase (PostgreSQL) |
| Email notifications | Resend |
| Deployment | Vercel (serverless) |
| Fonts | Plus Jakarta Sans + Nunito Sans |

## Features

- **Dashboard** — stat cards (total leads, active deals, revenue won, pipeline value), hero banner, recent leads table, quick actions, activity feed, pipeline snapshot
- **Leads Management** — table + card views, search, filter by source/status, add/edit/delete modals, full lead profiles
- **Lead Detail** — contact info, notes, activity timeline, associated deals with stage changer
- **Kanban Pipeline** — drag-and-drop across 6 stages (New Lead → Contacted → Qualified → Proposal Sent → Closed Won → Closed Lost)
- **Settings** — API documentation, Supabase schema, Resend setup, website integration guide, automation hooks

## Quick Start

```bash
cd lmm-crm
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file (never commit this):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (email notifications)
RESEND_API_KEY=re_your_api_key

# Notification recipient
NOTIFICATION_EMAIL=info@lakemichiganmarketing.com
```

Add these to **Vercel → Settings → Environment Variables** for production.

## Lead Capture API

Connect your website forms to this endpoint:

```
POST /api/leads
Content-Type: application/json

{
  "name": "Sarah Johnson",
  "email": "sarah@example.com",
  "phone": "(616) 555-0182",
  "message": "Interested in website redesign",
  "source": "Website"
}
```

Every submission is stored in Supabase and triggers an email notification to `info@lakemichiganmarketing.com` via Resend.

## Supabase Schema

Run in Supabase SQL Editor:

```sql
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
```

## Vercel Deployment

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set root directory to `lmm-crm`
4. Add environment variables
5. Deploy — the `/api/leads` endpoint goes live automatically

## Automation Hooks (Ready to Wire)

- **Twilio SMS** — add `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` env vars
- **Auto email reply** — Resend template ready in `/api/leads` route
- **Pipeline stage triggers** — fire webhooks on stage changes
- **Zapier / Make.com** — connect `/api/leads` as a webhook trigger

## Design

**"Warm Professional"** — HubSpot/Stripe-inspired aesthetic:
- Background: Sandy warm `#F5F0E8`
- Primary: Lake blue `#2B7FBF`
- Accent: Sunset orange `#F47B3A`
- Fonts: Plus Jakarta Sans (headings) + Nunito Sans (body)
