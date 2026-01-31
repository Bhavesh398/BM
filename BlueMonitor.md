Product Requirements Document (PRD): BlueMonitor Intelligence Platform
Version: 1.1 (Hackathon MVP - Refined)
Status: Approved for Development
Target Platform: Web (Responsive Mobile-First)
1. Executive Summary
BlueMonitor is a hybrid water intelligence platform designed to address UN SDG-6 (Clean Water & Sanitation). It serves two distinct functions:
1.	"JalGyan": A public educational portal using immersive storytelling to raise awareness about water contamination and microplastics.
2.	"JalScan & JalMap": A professional-grade tool for NGOs and Government bodies to log water quality data, classify it using a 5-Tier matrix, and visualize it on a global heatmap.
2. Tech Stack Architecture
Dev Note: Strict adherence to this stack is required for the hackathon speed/performance balance.
●	Framework: Next.js 14 (App Router)
●	Language: TypeScript (Strict Mode)
●	Authentication & Database: Supabase
○	Auth: Email/Password + Magic Link
○	DB: PostgreSQL
○	Geo: PostGIS extension (Required for geospatial queries)
●	Styling: Tailwind CSS + clsx + tailwind-merge
●	UI Library: shadcn/ui (Radix Primitives)
●	Animation:
○	Micro-interactions: Framer Motion
○	Scrollytelling (Part 1): GSAP ScrollTrigger
●	Maps: react-leaflet with OpenStreetMap tiles
●	Data Viz: Tremor (Charts) + Recharts (Radar/Spider plots)
●	Media: react-player (Lazy loaded)
3. Database Schema (Supabase)
Table: profiles
●	id (uuid, PK, references auth.users)
●	organization_name (text)
●	is_verified (boolean, default false)
●	role (enum: 'citizen', 'ngo', 'government')
Table: water_reports
●	id (uuid, PK)
●	created_at (timestamptz)
●	user_id (uuid, FK)
●	location (geography(POINT, 4326)) -- Critical for PostGIS
●	ph_level (float)
●	turbidity (float)
●	dissolved_oxygen (float)
●	conductivity (float)
●	bacteria_load (float)
●	metal_concentration (float)
●	calculated_tier (int, 1-5)
●	is_public (boolean)
●	notes (text)
4. Feature Specifications
🌊 PART 1: "JalGyan" (Public Educational Route)
Route: /
1.1 Hero Section (SDG-6 Command Center)
●	UI: Full-screen immersive video background (water theme).
●	Component: "The 2030 Countdown" – A GSAP-driven timeline animation that ticks down.
●	Data: Static mapping of 8 UN Targets. Hovering over a target reveals progress bars (CSS transitions).
1.2 The Contamination Chronicles (Scrollytelling)
●	Tech: GSAP ScrollTrigger pinning.
●	Interaction:
○	Before/After Sliders: A draggable component comparing pristine vs. polluted water (Minamata/Flint).
○	Microplastic Body: An SVG of the human body. As user scrolls, particles fill the body. Tooltips on organs show health impacts (Endocrine disruption, inflammation).
1.3 The Survival Library
●	Video Modal: Use react-player. Videos must not load until the user clicks "Play" to preserve Core Web Vitals.
●	Calculators: Simple React state forms.
○	Input: Water Volume (Liters), Contaminant Type.
○	Output: Required Bleach (drops) or Chlorine tablets.
🔬 PART 2: "JalScan" (Data Ingestion)
Route: /analyze (Protected Route)
2.1 Data Input Interface
●	Simulation Mode (Hackathon Feature):
○	Button: "Fetch Telemetry (Proteus Simulation)"
○	Action: When clicked, populate the form fields with randomized realistic data and a loading spinner to simulate IoT delay.
●	Manual Mode:
○	shadcn/ui Sliders for inputs to ensure data normalization.
2.2 Analysis & Report Generation (The 5-Tier Algorithm)
●	Dev Note: This logic runs client-side for immediate feedback, then saves to DB.
A. The Classification Matrix
The algorithm analyzes the input parameters from Section 2.1 and assigns a Tier based on the limiting factor (worst-performing parameter).
| Tier | Classification | Definition | Usage Permissions |
| Tier 1 | Pure/Potable | Sterile and balanced for immediate consumption | Direct drinking, cooking, medical use |
| Tier 2 | Household-Usable | Safe for external contact and non-consumption purposes | Bathing, laundry, irrigation, cleaning (boil before drinking) |
| Tier 3 | Conditioned-Ready | Currently contaminated but upgradable to Tier 1 or 2 via treatment | Requires filtration/chlorination/boiling |
| Tier 4 | Industrial-Grade | Heavy contamination suitable only for industrial/agricultural processing | Cooling systems, construction, treated irrigation only |
| Tier 5 | Biohazard | Toxic chemical or extreme biological contamination | Avoid all contact; environmental hazard |
B. The Output Report
Once the Tier is determined, the system generates a dynamic report card containing:
1.	Tier Badge: Large, color-coded status indicator (e.g., Red for Tier 5).
2.	Upgrade Path Visualization: A flowchart showing how to improve the water quality.
○	Concept: Current State → Treatment Sequence → Achievable Tier.
○	Example: "Current Tier 3 (Bacteria) → Ceramic Filtration + UV → Achievable Tier 1".
3.	Treatment ROI: Estimated cost per 1000 Liters and time required for the upgrade step.
4.	Staging Protocols: Multi-step treatment plans (e.g., "First flocculation to reach Tier 4, then charcoal filtration to reach Tier 2").
2.3 Submission Handling
●	Geolocation: Use navigator.geolocation.getCurrentPosition().
●	Map Preview: Small react-leaflet with OpenStreetMap tiles instance showing the current pin. Allow drag-to-adjust.
●	Privacy Toggle: Checkbox "Broadcast Publicly".
○	If Checked: is_public = true. Data Link: This action triggers an automatic update to Part 3 (JalMap). The report and its computed Tier will immediately appear as a clickable marker on the global map for all users to see.
○	If Unchecked: is_public = false. The data is saved securely in the database but remains visible only in the user's private dashboard.
🗺️ PART 3: "JalMap" (Global Intelligence)
Route: /map
3.1 Interactive Map (react-leaflet with OpenStreetMap tiles)
●	View State: Default to global, but if IP location detects India, flyTo India coordinates on load.
●	Layers:
○	Heatmap Layer: For low zoom levels (aggregated data).
○	Marker Layer: For high zoom levels (individual reports).
●	Markers: Custom SVG icons colored by Tier (Blue -> Red).
●	Pulsing Effect: CSS Keyframe animation on Tier 5 markers.
3.2 Report Modal (Drill Down)
●	Trigger: OnClick marker.
●	Chart: Recharts Radar Chart comparing the 6 parameters against the "Safe Baseline".
●	Report Summary: Displays the 5-Tier Classification and recommended "Treatment Roadmap" generated in Part 2.2.
●	Download: Generate a simple PDF using jspdf (client-side) summarizing the report.
3.3 Filtering
●	Tech: Client-side filtering of the GeoJSON data is faster for hackathons than re-fetching SQL for every filter change (unless data set is massive).
●	State: React Context to manage activeFilters (e.g., { tier: [1,2], contaminant: 'arsenic' }).
5. UI/UX & Design System
Color Palette (Tailwind Config)
●	primary: #0ea5e9 (Sky-500) - Represents Clean Water.
●	danger: #ef4444 (Red-500) - Biohazard/Tier 5.
●	warning: #f59e0b (Amber-500) - Tier 3/4.
●	safe: #22c55e (Green-500) - Tier 2.
●	pure: #3b82f6 (Blue-500) - Tier 1.
●	background: #0f172a (Slate-900) - Deep ocean dark mode.
Typography
●	Headings: Inter (Clean, scientific).
●	Data/Numbers: JetBrains Mono or Roboto Mono (Precision feel).
6. Implementation Roadmap (Hackathon Schedule)
Phase 1: Foundation (Hours 0-4)
●	Initialize Next.js repo with TypeScript.
●	Setup Supabase project & Table RLS policies.
●	Install Shadcn/ui components (Forms, Dialogs, Cards).

Phase 2: Core Logic (Hours 4-12)
●	Build the JalScan input form.
●	Write the "Tier Classification" TypeScript function with the 5-Tier Matrix logic.
●	Implement the "Simulation" button.
●	Connect Form Submit to Supabase water_reports.
Phase 3: Visualization (Hours 12-20)
●	Build JalMap. Fetch data from Supabase.
●	Implement the Radar Charts in the popup.
●	Build the JalGyan landing page (GSAP animations).
Phase 4: Polish (Hours 20-24)
●	Add loading states (Skeletons).
●	Refine mobile responsiveness.
●	Add toast notifications (Success/Error).
●	Final deployment to Vercel.
