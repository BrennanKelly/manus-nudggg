# Lake Michigan Marketing — Design Brainstorm

## Design Philosophy Options

<response>
<idea>
**Design Movement:** Coastal Modernism — where Great Lakes ruggedness meets refined agency confidence

**Core Principles:**
1. Asymmetric editorial layouts — content blocks break the grid intentionally, like waves breaking on shore
2. High contrast typography — heavy display weight against airy body text creates visual authority
3. Warm-cool tension — sandy neutrals ground the palette while lake blues provide aspiration
4. Conversion architecture — every scroll reveals a new reason to act

**Color Philosophy:**
- Primary: Deep Lake Blue `oklch(0.38 0.12 240)` — authority, depth, trust
- Accent: Sunset Amber `oklch(0.72 0.18 55)` — urgency, warmth, action
- Background: Warm Sand `oklch(0.97 0.015 80)` — approachable, premium, calm
- Text: Charcoal Slate `oklch(0.18 0.01 250)` — readable, confident
- Muted: Driftwood `oklch(0.88 0.02 75)` — subtle section breaks

**Layout Paradigm:**
- Split-column hero: headline left-aligned at 60%, visual right-aligned at 40%
- Staggered service cards that cascade diagonally
- Full-bleed section dividers using diagonal SVG clips
- Sticky nav that transitions from transparent to frosted glass on scroll

**Signature Elements:**
1. Subtle wave SVG dividers between sections (not cheesy — just a 3° diagonal clip)
2. Amber gradient "glow" on primary CTAs — like a sunset reflection
3. Thin horizontal rule lines in lake blue used as section anchors

**Interaction Philosophy:**
- Entrance animations: elements slide up 20px and fade in on scroll (staggered 100ms)
- CTA buttons: amber fill with subtle scale(1.03) on hover
- Nav links: underline draws left-to-right on hover

**Animation:**
- Framer Motion scroll-triggered entrance for all major sections
- Hero headline: word-by-word stagger reveal (0.08s per word)
- Stats counter: count-up animation when scrolled into view
- Service cards: lift + shadow deepen on hover

**Typography System:**
- Display: `Playfair Display` — editorial authority for H1/H2
- Body: `DM Sans` — modern, clean, readable for paragraphs
- Mono accent: `JetBrains Mono` — used sparingly for metrics/numbers
- Scale: 72px hero → 48px H1 → 32px H2 → 20px H3 → 16px body
</idea>
<probability>0.08</probability>
</response>

<response>
<idea>
**Design Movement:** Brutalist Coastal — raw confidence meets shoreline energy

**Core Principles:**
1. Bold typographic hierarchy dominates — text IS the design
2. High-contrast blocks with no gradients — pure color fields
3. Oversized numbers and stats as visual anchors
4. Unapologetic whitespace as a luxury signal

**Color Philosophy:**
- Near-black navy `oklch(0.15 0.06 245)` for headers/hero
- Pure white backgrounds
- Electric orange `oklch(0.68 0.22 45)` for all CTAs
- Lake teal `oklch(0.55 0.12 200)` for accents

**Layout Paradigm:**
- Full-width text blocks with oversized leading
- Horizontal scrolling service showcase
- Stats displayed in massive 120px numerals

**Signature Elements:**
1. Thick left-border rules in orange on blockquotes
2. Oversized section numbers (01, 02, 03) in muted tone

**Interaction Philosophy:**
- Minimal animation — confidence through stillness
- Hover states: color inversion (white text on dark bg)

**Animation:**
- Clip-path reveal on scroll for section headings
- No entrance animations on body text

**Typography System:**
- Display: `Space Grotesk` — geometric, confident
- Body: `Inter` — utilitarian
</idea>
<probability>0.05</probability>
</response>

<response>
<idea>
**Design Movement:** Soft Luxury Coastal — premium spa-meets-agency aesthetic

**Core Principles:**
1. Whisper-soft color fields — barely-there backgrounds
2. Generous whitespace as the primary design element
3. Photography-forward — large imagery with minimal text overlay
4. Understated CTAs — confidence through restraint

**Color Philosophy:**
- Cream `oklch(0.97 0.01 85)` backgrounds
- Dusty blue `oklch(0.62 0.08 230)` for accents
- Warm taupe `oklch(0.75 0.03 70)` for borders
- Charcoal `oklch(0.2 0.01 260)` for text

**Layout Paradigm:**
- Centered, narrow content columns (max 720px)
- Large full-bleed photography sections
- Minimal nav — just logo + one CTA

**Signature Elements:**
1. Thin serif typography for subheadings
2. Circular image crops for team/testimonials

**Interaction Philosophy:**
- Slow, elegant transitions (600ms ease)
- Parallax on hero image

**Animation:**
- Fade-only entrance animations
- No bounce or spring physics

**Typography System:**
- Display: `Cormorant Garamond` — luxury serif
- Body: `Lato` — clean, neutral
</idea>
<probability>0.04</probability>
</response>

## Selected Design: **Coastal Modernism** (Option 1)

Chosen for its perfect balance of authority and approachability — exactly what a high-converting agency site needs. The asymmetric editorial layouts break the "AI slop" mold, the warm-cool tension reflects the Lake Michigan brand, and the conversion architecture keeps leads flowing.
