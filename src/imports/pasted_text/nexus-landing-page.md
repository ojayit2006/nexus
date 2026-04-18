PROJECT OVERVIEW

Design a full landing page UI for "Nexus – Automated Clearance Protocol", a SaaS platform automating college graduation clearance workflows. Apply the Bauhaus constructivist design system throughout: every section is a geometric composition, not just a layout. The page should feel like a 1920s Bauhaus poster brought to life — bold, asymmetric, architectural, and unapologetically graphic.


DESIGN PHILOSOPHY

Core principle: "Form follows function" — every decorative element derives from circles, squares, and triangles. No gradients. No soft shadows. No rounded corners except full pills (9999px). Everything is direct and declarative.
Vibe: Constructivist, geometric, modernist, bold, architectural.
NOT allowed: Soft drop-shadows, blur effects, gradients, rounded-corner cards, subtle palettes, or any effect that reads as generic Tailwind/Bootstrap.


DESIGN TOKENS — USE THESE EXACTLY

Canvas background: #F0F0F0 (off-white)
Foreground / all borders: #121212 (stark black)
Primary Red: #D02020 | Primary Blue: #1040C0 | Primary Yellow: #F0C020
Muted fill: #E0E0E0
Font: "Outfit" (Google Fonts) — weights 400, 500, 700, 900. This is the ONLY typeface.
Display type: font-black (900), ALL CAPS, tracking -0.04em, line-height 0.9.
  – Desktop: 96px | Tablet: 64px | Mobile: 40px
Subheadings: font-bold (700), ALL CAPS, tracking-wide.
Body: font-medium (500), sentence case, line-height 1.6, 18px.
Labels: font-bold (700), ALL CAPS, tracking 0.12em, 12px.

Border rules:
  – Desktop: 4px solid #121212 on all major elements.
  – Mobile: 2px solid #121212.
  – Section dividers: 4px bottom border in #121212 between every section.
  – Radius: ONLY rounded-none (0px) for rectangles OR rounded-full (9999px) for circles/pills. Nothing in between.

Shadows (hard offset only — no blur):
  – Small card: 4px 4px 0px 0px #121212
  – Large card: 8px 8px 0px 0px #121212
  – Button: 4px 4px 0px 0px #121212 (on hover: offset reduces, on active/press: 0px 0px — simulates physical press)


FRAME & GRID SETUP

3 desktop frames at 1440 × 900px + 1 mobile frame at 390 × 844px.
Grid: 12-column, 80px margin, 24px gutter (desktop). 4-column, 16px margin, 16px gutter (mobile).
All sections use max-width 1344px centred. Vertical rhythm: 96px between sections (desktop), 64px (mobile).
Use Figma Auto Layout throughout. Intentionally break the grid with overlapping geometric shapes at section edges to create asymmetric Bauhaus balance.


SECTION 1 — HERO

Split layout: Left 55% white panel | Right 45% solid Blue (#1040C0) panel. Full viewport height. Hard 4px black border between panels.
Left panel (white):
  – Nav bar: Logo = three stacked geometric shapes (filled circle #D02020, filled square #1040C0, filled triangle #F0C020) + wordmark "NEXUS" in Outfit 900. Right: nav links in Outfit 700 uppercase + pill CTA button (Red #D02020, white text, 4px black border, 4px hard shadow).
  – Headline: "AUTOMATE YOUR GRADUATION CLEARANCE." — 3 lines, 96px, font-black, ALL CAPS, tracking -0.04em, line-height 0.9.
  – Subtext: 18px, font-medium, #121212 — max-width 480px.
  – Social proof row: 4 avatar circles (grayscale, rounded-full) + "Trusted by 12,000+ students" label (12px, font-bold, uppercase).
  – CTA row: Red primary button "GET STARTED →" (rounded-none, 4px border, 4px hard black shadow) + outline button "SEE HOW IT WORKS" (white bg, black border, black text, same shadow).
Right panel (Blue #1040C0):
  – Overlapping geometric composition centred: Large white circle (50% opacity), rotated 45° filled black square (40% opacity), centred solid yellow square with a white triangle (clip-path) inside. All shapes at ~200–320px.
  – Dot grid texture: radial-gradient white 2px circles, 20px spacing, 15% opacity layered over.
Animation notes (label in Figma): Headline words stagger-in from bottom (60ms each). Right panel shapes rotate on Y axis (slow loop). Button active state: translate +4px / +4px, shadow disappears.


SECTION 2 — STATS BAR

Full-width Yellow (#F0C020) color block. 4px black border top and bottom.
4-column grid separated by 4px black vertical dividers.
Each stat: large number in Outfit 900 at 64px (black), label in 12px uppercase font-bold below.
Stats: "12,000+ Students" | "98% Clearance Rate" | "3 Approval Steps" | "< 48 Hours".
Each number sits inside a geometric shape: alternate between circle (rounded-full) and rotated 45° square — filled black, number in yellow.
Animation note: Numbers count up from 0 on scroll enter.


SECTION 3 — WORKFLOW STEPS

White background. Section label "HOW IT WORKS" (12px, uppercase, font-bold, tracked). H2: "THREE STEPS. ZERO PAPERWORK." (64px, font-black).
4-column step cards connected by a thick 4px black dashed horizontal line (hidden on mobile).
Each step card: white bg, 4px black border, 8px hard black shadow, rounded-none. Step number in a rotated 45° square (Red #D02020), counter-rotated inner number so it reads upright.
  – Step 1: Upload icon + "STUDENT SUBMITS DOCUMENTS & CLEARS DUES"
  – Step 2: Check-circle icon + "HOD REVIEWS & APPROVES"
  – Step 3: Seal icon + "PRINCIPAL SIGNS OFF"
  – Step 4: QR icon + "DIGITAL CERTIFICATE ISSUED"
Connecting arrows between cards: solid black chevron right, 24px.
Animation note: Cards appear left→right, 200ms stagger. Connector line draws left→right (stroke-dashoffset). Active step: border color shifts to Red.


SECTION 4 — FEATURES GRID

White background, 4px black bottom border. H2: "EVERYTHING THE REGISTRAR NEEDS." 3-column grid (1 col mobile, 2 col tablet, 3 col desktop), 8px gaps.
Each feature card: white bg, 4px black border, 8px hard black shadow, rounded-none. Small 8px geometric corner decoration top-right (alternate circle/square/triangle in Red/Blue/Yellow).
Icon: inside a white bordered square box with 4px black border, Lucide icon stroke 2px.
  – Document Upload | Dues Tracking | Digital Certificates | Real-time Status | QR Verification | Audit Trail
Card hover: lift -4px (translate Y), shadow unchanged.
Animation note: Cards scale from 0.96 → 1.0 on scroll enter, 100ms stagger.


SECTION 5 — DASHBOARD PREVIEW

Full-width Red (#D02020) color block. Left: white text block. Right: browser-frame mockup (white bg, 4px black border, 8px hard shadow, rounded-none).
Text block (white on Red): Section label, H2 "SEE EVERY STUDENT'S STATUS AT A GLANCE.", 16px body, "VIEW DASHBOARD →" link with underline.
Dashboard mockup:
  – Top nav: "NEXUS ADMIN" wordmark (Outfit 900, white on black strip). Avatar circle (grayscale).
  – Left sidebar: icon navigation on black strip — icons in white, 4px right border in Yellow.
  – Main area: heatmap grid 8×10 student cells, each cell 32×32px, 2px black border.
    Colours: Cleared = Yellow #F0C020 | Pending = Blue #1040C0 (white label) | Outstanding = Red #D02020 (white label).
  – Stat cards above heatmap: 3 cards side by side, white bg, 4px black border, hard shadow. "CLEARED 1,248" | "PENDING 312" | "DUES OUTSTANDING 88".
Animation note: Heatmap cells fill in progressively. Stat numbers count up. Mockup slides up 24px on scroll enter.


SECTION 6 — PAYMENT & DUES

Yellow (#F0C020) color block. H2: "CLEAR YOUR DUES IN ONE TAP." (black, font-black). 3-column card row.
Each card: white bg, 4px black border, 8px hard shadow, rounded-none.
  – Library Fine ₹450 — "PAY NOW" Red button (rounded-none, 4px border, hard shadow).
  – Lab Deposit ₹1,200 — "PAY NOW" Blue button.
  – Hostel Dues ₹0 — "CLEARED" — Yellow badge (rounded-none, black text, 4px black border).
Amount in Outfit 900 at 40px. Label in 12px uppercase font-bold. Button full-width.
Animation note: Cleared card: green tick replaced by Yellow geometric check shape with scale-bounce on enter.


SECTION 7 — QR VERIFICATION

White background. Split 50/50. Left: large QR code block (black squares on white, 4px outer border, 8px hard black shadow, rounded-none). Scan-line: thick 4px Red horizontal line animates top→bottom in loop.
Right: H2 "VERIFY ANY CERTIFICATE INSTANTLY." + 16px body text. Feature list: 3 rows, each with a Yellow filled circle badge containing a black checkmark.
  – "Issued by registrar" | "Immutable audit log" | "Works offline after first scan"
Animation note: QR scan line loops. Text block slides in from right on scroll enter.


SECTION 8 — FINAL CTA

Yellow (#F0C020) color block. Centred. Large decorative Red filled circle (300px, 50% opacity) bottom-left. Large Blue rotated 45° square (250px, 50% opacity) top-right. Both are background decoration only.
H2: "YOUR CLEARANCE. DONE." (96px, font-black, black, ALL CAPS). Subtext 18px black.
CTA: Red primary button "APPLY FOR CLEARANCE →" (rounded-none, 4px black border, 8px hard black shadow, white text Outfit 700 uppercase). Outline button "LEARN MORE" beside it.
Animation note: Decorative shapes drift slowly (opposite directions, subtle). Buttons have hard-press active state.


SECTION 9 — FOOTER

Near-black (#121212) background. White text. 4-column grid: Logo + tagline | Product links | Resources | Contact. Geometric logo repeated large (60% opacity) as background decoration.
Bottom bar: "© 2026 NEXUS. ALL RIGHTS RESERVED." + social icon circles (white outline, rounded-full).
4px Yellow top border on the footer strip.


FIGMA-SPECIFIC INSTRUCTIONS

– Name every frame: "Hero/Desktop", "Stats/Desktop", "Workflow/Desktop" etc.
– Components: Nav, Button/Primary-Red, Button/Primary-Blue, Button/Yellow, Button/Outline, FeatureCard, StepCard, PaymentCard, StatCard, HeatmapCell (3 variants: cleared/pending/outstanding), Footer.
– Variables:
  Color: bg-canvas (#F0F0F0), fg (#121212), red (#D02020), blue (#1040C0), yellow (#F0C020), muted (#E0E0E0).
  Typography: display/heading/body/label (size + weight + tracking as above).
  Spacing: 4 / 8 / 12 / 16 / 24 / 48 / 96px.
  Shadow: shadow-sm (4px 4px 0 0 #121212), shadow-lg (8px 8px 0 0 #121212).
– Prototype: Scroll triggers on each section (On scroll → Appear with Smart Animate, 300ms ease-out). Button active state: translate +4px/+4px, shadow → none.
– Export: All sections exportable @1x and @2x PNG. Components exportable as SVG.
– DO NOT use: Any soft shadows, gradient fills, border-radius between 1px and 9998px, Inter/Roboto/system fonts, or muted color palettes. Bauhaus only.