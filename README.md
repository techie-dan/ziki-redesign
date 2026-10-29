# Ziki Synapse — Adaptive Human-Agent Co-Steering Platform

> An interactive human-agent collaboration platform and enhancement for **ziki.dev/issues**, featuring simplified no-code agent creation, in-flight decision waypoints, multi-approach intent alignment, and verifiable dual-consensus delivery.

---

## 📖 Description

**Ziki Synapse** improves how software engineering teams and autonomous AI coding agents interact. 

In traditional AI software workflows, agents often operate as an opaque "black box": once an issue is assigned, the agent works in isolation until it submits a massive pull request. If the agent makes wrong architectural assumptions, engineers suffer from review fatigue and are forced into costly PR rejections.

**Ziki Synapse introduces a collaborative co-steering layer:**

* **Simplified AI Teammate Creation**: Non-technical users can build and deploy specialized agents using 1-click role blueprints (Frontend Polisher, Security Guardian, Performance Tuner, Independent Verifier) or simply by describing their needs in everyday English.
* **In-Flight Decision Points (Waypoints)**: When an agent encounters an architectural crossroad (e.g., *In-Memory Deduplication vs Distributed Redis Mutex*), it pauses mid-flight and requests 1-click direction with plain-English trade-offs.
* **Multi-Approach Intent Canvas**: Before touching code, agents formulate alternative execution strategies with estimated token costs and blast radius ratings for human sign-off.
* **Independent Cross-Owner Verification**: A neutral verifier agent (with a strictly different human owner) reproduces the issue and runs stress tests before final merge.
* **Interactive Live Sandbox**: Test concurrency bursts, token race conditions, and retry jitter directly in the browser before merging code.
* **Vercel Deployment Ready**: Built with Vite and React 19, pre-configured with SPA routing rewrites for zero-config Vercel hosting.

---

## 📂 Project Structure

```text
├── .env.example              # Environment variables template (API keys, App URL)
├── .gitignore                # Git ignore patterns (node_modules, dist, etc.)
├── .npmrc                    # npm configuration with legacy-peer-deps=true for stable builds
├── index.html                # HTML entry point with metadata and OpenGraph tags
├── metadata.json             # AI Studio applet metadata and capabilities
├── package.json              # Project scripts, dependencies (React 19, Vite, Tailwind v4)
├── package-lock.json         # Deterministic dependency lockfile
├── tsconfig.json             # TypeScript compiler settings and path aliases (@/*)
├── vercel.json               # Vercel deployment configuration (build command, output directory, rewrites)
├── vite.config.ts            # Vite configuration with Tailwind CSS v4 and React plugins
│
├── public/                   # Static assets served at root
│
└── src/                      # Application source code
    ├── main.tsx              # React application entry point (DOM root mount)
    ├── index.css             # Tailwind CSS v4 theme and global stylesheet
    ├── App.tsx               # Main application layout, view switching, and state management
    ├── types.ts              # Core TypeScript interfaces (ZikiIssue, AgentActor, Waypoint, etc.)
    │
    ├── components/           # Modular UI components
    │   ├── Header.tsx            # Clean, non-technical navigation header (Issues vs AI Agents)
    │   ├── IssueCard.tsx         # Interactive issue card with waypoint alerts and status badges
    │   ├── IssueDetailModal.tsx  # Co-steering flight deck, waypoints, code diff, and audit trail
    │   ├── CreateAgentModal.tsx  # Simplified agent creator (1-click blueprints or plain English prompt)
    │   ├── AgentRoster.tsx       # Team overview of active AI agents, roles, and guardrails
    │   ├── LifecycleProgress.tsx # Visual 6-step Ziki lifecycle tracker (Report to Merge)
    │   ├── SandboxRunner.tsx     # In-browser live stress simulator for bugs and fixes
    │   ├── HowItWorksModal.tsx   # Friendly non-technical guide explaining co-steering
    │   ├── ProposalModal.tsx     # Full ZIP-04 technical specification and RFC export
    │   ├── NewIssueModal.tsx     # Issue filing modal with pre-configured engineering templates
    │   └── VercelDeployModal.tsx # Step-by-step Vercel deployment troubleshooting and guide
    │
    └── data/                 # Data stores and specifications
        ├── mockIssues.ts         # Realistic engineering scenarios (OAuth races, webhooks, leaks, idempotency)
        ├── mockAgents.ts         # Pre-configured agent personas with guardrails and specialties
        └── zip04Proposal.ts      # Formal Ziki Improvement Proposal (ZIP-04) specification
```

---

## 🚀 How to Run on Your System

### 1. Prerequisites

Ensure you have **Node.js** installed on your machine:
* **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
* **npm**: `v9.0.0` or higher (comes with Node.js)

Verify your installation:
```bash
node -v
npm -v
```

---

### 2. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ziki-redesign.git
cd ziki-redesign
```

---

### 3. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

> **Note**: The repository includes `.npmrc` with `legacy-peer-deps=true` to guarantee clean installation across all environments.

---

### 4. Start the Development Server

Start Vite in local development mode:

```bash
npm run dev
```

The application will start immediately:
```text
  VITE v8.3.5  ready in 180 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

### 5. Build for Production

To create an optimized, minified production build:

```bash
npm run build
```

This compiles your application into the **`dist/`** directory.

---

### 6. Preview the Production Build Locally

To test the compiled production build locally before deploying:

```bash
npm run preview
```

Navigate to the provided preview URL (typically `http://localhost:4173`).

---

### 7. Run Code Quality Checks

Verify TypeScript typing:

```bash
npm run lint
```

---

## ☁️ Deploying to Vercel

This repository is pre-configured with a root `vercel.json` file for zero-config deployment.

### Option A: Deploy via GitHub (Recommended)
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Ziki Synapse platform"
   git push origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Import your repository.
4. Click **Deploy**. Vercel will automatically detect `npm run build` and serve from `dist`.

### Option B: Deploy via Vercel CLI
```bash
npx vercel --prod
```

---

## 🛠️ Key Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server on port 3000 |
| `npm run build` | Compiles and bundles production assets into `dist/` |
| `npm run preview` | Serves the production bundle locally for testing |
| `npm run lint` | Runs TypeScript compiler checks without emitting files |
| `npm run clean` | Cleans build artifacts (`dist`) |

---

## 👥 Human-Agent Lifecycle Overview

```text
[1. Report]      →   [2. Confirm]    →   [3. Authorize]   →   [4. Deliver]     →   [5. Prove]       →   [6. Merge]
Issue Created        Triager Verified     Intent & Plan        In-Flight           Independent          Human Gatekeeper
with Context Graph   & Blast Radius       Multi-Approach       Co-Steering         Verifier Tests       Consensus Sign-Off
                                          Sign-off             Waypoints           & Live Sandbox
```

---

## 📄 License

Apache-2.0
