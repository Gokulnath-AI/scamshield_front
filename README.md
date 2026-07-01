# ScamShield — AI-Powered Scam Detection for India

A production-ready, award-level web application that uses ML-powered analysis to detect and classify digital scams targeting Indian users. Built with a cinematic 3D experience, scroll-driven camera choreography, and a fully interactive analysis engine.

---

## Features

### Landing Page (Main)
- **3D Atom Model** — A glowing atom with black nucleus, blue electron shells (4 orbital rings, 14 electrons), shield emblem, particle cloud, and energy pulse rings — all animated in real-time with React Three Fiber
- **Scroll-Driven Camera** — 23 keyframes along a Catmull-Rom spline with frame-rate independent smoothing and mouse parallax
- **7 Cinematic Scenes** — Hero, Pipeline (How it Works), Scam Types, Features, Stats, CTA, Footer — each revealed through scroll-based transitions
- **Glassmorphism UI** — Frosted-glass panels with backdrop-blur, semi-transparent backgrounds, and subtle border/shadow effects
- **Network Constellation** — 50 animated nodes with distance-based edges that fade in during scroll
- **Cinematic Lighting** — Key, fill, rim lights + 3 orbiting colored point lights with sinusoidal motion paths
- **Post-Processing** — Bloom + Vignette via @react-three/postprocessing
- **Smooth Scroll** — Lenis with cubic easing (duration 0.8, wheelMultiplier 1.2)
- **Floating HUD** — Glass navbar with scene navigation links and Analyze button
- **Adaptive Quality** — GPU tier detection via detect-gpu, AdaptiveDpr, automatic quality scaling

### Analysis Page (Second Landing)
- **3D Spinning Globe** — Purple dotted globe with accurate continent polygons (17 landmasses with point-in-polygon ray-casting), star field, wireframe hex grid, and atmospheric glow — spins continuously as background
- **Smooth Loading** — Globe canvas fades in over 1.2s to prevent dot flicker
- **Dark Glassmorphism Panels** — Frosted dark panels with backdrop-blur-xl and shadow depth, clearly readable over the globe
- **Seamless Background** — Gradient overlays feather the globe edges for natural content/background blending
- **ML Analysis Pipeline** — Paste suspicious content and watch a 3-phase animated analysis:
  1. **Tokenizing** — Words appear with staggered animation as purple tags
  2. **Classifying** — Spinning orbital rings with Brain icon, step-by-step pipeline progress
  3. **Results** — Threat banner, probability gradient bar, key indicators, risk breakdown grid, recommended action, model info
- **5 Example Indian Scam Messages** — Pre-loaded examples covering KBC lottery, SBI KYC phishing, Amazon customs, crypto investment, and OTP sharing scams
- **Slide-In Transition** — Spring-animated page slide from right
- **Touch Support** — Swipe right to close on mobile, Escape key to close on desktop

### Scam Types Covered
1. UPI Payment Fraud
2. OTP / Verification Scams
3. Fake Job Offers
4. KYC Phishing
5. Lottery / Prize Scams
6. Investment / Crypto Fraud
7. Impersonation Calls
8. Loan App Harassment

### Stats Dashboard
- Interactive charts (Line, Pie, Area, Bar) via Recharts
- Animated counters with cubic ease-out
- Model metrics: Accuracy, Precision, Recall, F1 Score

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 3D Engine | React Three Fiber + Drei |
| Post-Processing | @react-three/postprocessing |
| Animations | Framer Motion |
| Smooth Scroll | Lenis |
| State Management | Zustand |
| Charts | Recharts |
| Icons | Lucide React |
| GPU Detection | detect-gpu |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind v4 config, glass utilities, animations
│   ├── layout.tsx           # Root layout with Inter font, SEO metadata
│   └── page.tsx             # Main orchestrator — all scenes + 3D canvas
├── components/
│   ├── overlay/
│   │   ├── HUD.tsx          # Floating glass navbar with scene links
│   │   ├── ScrollProgress.tsx
│   │   └── CursorLight.tsx  # Radial gradient following cursor
│   ├── scenes/
│   │   ├── HeroScene.tsx    # Hero with badge, heading, stats, CTA
│   │   ├── PipelineScene.tsx # How it works — 4-step pipeline
│   │   ├── ScamTypesScene.tsx # 8 scam type cards
│   │   ├── FeaturesScene.tsx # Feature grid
│   │   ├── StatsScene.tsx   # Charts + model metrics (dynamic import)
│   │   ├── CTAScene.tsx     # Call to action
│   │   ├── FooterScene.tsx  # Footer
│   │   └── AnalysisPage.tsx # Full analysis page with globe background
│   ├── three/
│   │   ├── AICore.tsx       # 3D atom model (nucleus + electrons + particles)
│   │   ├── CameraRig.tsx    # 23-keyframe Catmull-Rom camera path
│   │   ├── SceneCanvas.tsx  # R3F Canvas with adaptive DPR
│   │   ├── SceneLights.tsx  # Cinematic multi-light setup
│   │   ├── PostFX.tsx       # Bloom + Vignette
│   │   ├── NetworkConstellation.tsx # Animated node network
│   │   └── GlobeBackground.tsx # Purple dotted globe with continent polygons
│   └── ui/
│       ├── GlassPanel.tsx   # Reusable glass card
│       ├── MagneticButton.tsx # Cursor-aware magnetic button
│       └── AnimatedCounter.tsx # Number counter animation
├── data/
│   └── mock.ts             # All mock data (scam types, metrics, stats)
├── hooks/
│   ├── useLenisScroll.ts   # Smooth scroll with Lenis
│   ├── useGPUTier.ts       # GPU capability detection
│   ├── useReducedMotion.ts # Accessibility: reduced motion
│   └── useCursorLight.ts   # Cursor position tracking
├── stores/
│   └── useAppStore.ts      # Zustand store (scroll, scene, GPU, analysis)
└── lib/
    └── animations.ts       # Shared animation configs
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Deployment

### Vercel (Recommended)

1. Push the project to a GitHub/GitLab/Bitbucket repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js — click Deploy
4. Your site will be live at `your-project.vercel.app`

Or use the CLI:

```bash
npx vercel
```

### Netlify

```bash
npm run build
# Deploy the `.next` folder using the @netlify/plugin-nextjs plugin
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export

Add `output: 'export'` to `next.config.ts` for static HTML export:

```ts
const nextConfig: NextConfig = {
  output: 'export',
};
```

Then `npm run build` generates a static `out/` folder deployable anywhere.

---

## How It Works

### Main Landing Page Flow

1. **Page loads** — GPU tier is detected, Lenis smooth scroll initializes, 3D canvas mounts with the atom model
2. **User scrolls** — Camera follows a 23-keyframe spline path through the 3D scene. Each scene section (Hero, Pipeline, Scam Types, etc.) is overlaid as HTML content over the fixed 3D background
3. **Frame-rate independent** — All animations use exponential smoothing for consistent motion regardless of refresh rate (60Hz, 120Hz, 144Hz)
4. **Adaptive quality** — Low-end GPUs get reduced DPR, disabled post-processing, and simplified geometry

### Analysis Engine Flow

1. **User clicks "Analyze"** — The analysis page slides in from the right with a spring animation
2. **Globe loads** — A second R3F canvas renders the purple dotted globe (continent positions computed via polygon ray-casting at initialization, cached in useMemo)
3. **User pastes content** — Text is entered in the input panel or selected from 5 example Indian scam messages
4. **Tokenization phase** — Words appear with 80ms stagger as tagged tokens
5. **Classification phase** — Animated orbital rings spin while pipeline steps light up sequentially
6. **Results** — Threat level, probability bar, key indicators, risk breakdown, and recommended action are displayed with staggered animations

### Globe Rendering

The globe uses procedural continent detection — 17 landmass polygons (Africa, Europe, Asia, India, North/South America, Australia, Japan, UK, Indonesia, Madagascar, New Zealand, Greenland, Philippines, Sri Lanka, Taiwan, Korea) are defined as lat/lon coordinate arrays. A point-in-polygon ray-casting algorithm tests each sphere sample point against all polygons. Land points get bright purple dots; ocean areas get a sparse faint grid. The result is a recognizable world map rendered entirely in code with no texture files needed.

---

## Performance

- DPR capped at 1.5 (main scene) / 2.0 (globe) with AdaptiveDpr for auto-scaling
- Post-processing disabled on GPU tier < 2
- Stencil buffer disabled on main canvas
- Multisampling set to 0 on post-processing
- Dynamic imports for StatsScene (Recharts) and GlobeBackground (R3F)
- Reduced motion respected via `prefers-reduced-motion` media query

---

## Browser Support

- Chrome 90+ (recommended)
- Firefox 90+
- Safari 15+
- Edge 90+

WebGL 2.0 required for 3D features.

---

## License

MIT

---

Built for hackathon excellence. Designed to win.
