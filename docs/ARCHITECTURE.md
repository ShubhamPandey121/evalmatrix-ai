# 🏗️ EvalMatrix AI - System Architecture & Design

> **Author & Lead Architect:** Shubham Pandey  
> **Email:** shubham230884@gmail.com  
> **GitHub:** [ShubhamPandey121](https://github.com/ShubhamPandey121)  
> **System Classification:** Autonomous AI-Orchestrated Technical Interview & Career Copilot

---

## 1. High-Level Architecture Diagram

```
+--------------------------------------------------------------------------------+
|                             Client Tier (Frontend)                             |
|  React 19 + Vite 7 + Sass + Context API + HTML5 Web Speech API                |
|  [ Dashboard ]  [ Mock Answer Lab ]  [ Roadmap Tracker ]  [ Resume Viewer ]     |
+---------------------------------------+----------------------------------------+
                                        |  RESTful JSON & Multipart Form Data
                                        |  (CORS with credentials, JWT Bearer)
                                        v
+--------------------------------------------------------------------------------+
|                             API Tier (Backend)                                 |
|  Express 5.x on Node.js 22/26                                                  |
|  - Auth Middleware (JWT + TTL Blacklist Check)                                 |
|  - File Upload Pipeline (Multer + PDF-Parse text extractor)                    |
|  - Input Validation Layer (Zod Schemas)                                        |
|  - Centralized Error & Async Handler                                           |
+-------------------+-----------------------------------+------------------------+
                    |                                   |
                    v                                   v
+------------------------------------+   +------------------------------------+
|          Persistence Tier          |   |          GenAI / PDF Engine        |
|  MongoDB with Mongoose             |   |  - Google Gemini AI (GenAI SDK)    |
|  - UserModel (Credentials/Profile) |   |    Structured Zod Output Schemas   |
|  - InterviewReportModel            |   |    Graceful Model Fallbacks        |
|  - BlacklistModel (TTL 7 Days)     |   |  - Headless Puppeteer Chromium     |
+------------------------------------+   +------------------------------------+
```

---

## 2. Core Architectural Pillars

### 1. Robust AI Prompt Engineering & Fallback Topology
- **Structured Output Guarantees:** Output is defined strictly with Zod schemas converted to JSON schemas (`zod-to-json-schema`), ensuring responses adhere 100% to TypeScript/JSON contracts without hallucinated schemas.
- **Resilient Model Cascading:**
  1. Default: `gemini-2.5-flash` for high throughput, sub-second reasoning, and structured adherence.
  2. Fallback 1: `gemini-1.5-flash` or `gemini-2.0-flash`.
  3. Offline Simulation Engine: In instances where network or API keys are unavailable, an intelligent role-aware generator creates complete, realistic reports so user workflows are never blocked.

### 2. Dual-Mode Authentication & Security Hardening
- **Header & Cookie Dual Access:** Auth middleware accepts tokens via `Authorization: Bearer <token>` or HTTP-Only cookies with `SameSite: Lax`.
- **Automated Blacklist Expiration:** The `TokenBlacklistModel` leverages native MongoDB TTL indexes (`expires: 7 days`), preventing unbounded collection bloat.
- **Ownership Verification:** Every mutation and fetch operation (`/report/:id`, `/resume/pdf/:id`) strictly enforces `{ _id: id, user: req.user.id }`.

### 3. State Management & Zero-Redundant Network Calls
- In React 19, session discovery runs solely on the initial mount inside `AuthProvider`.
- Data-fetching hooks are decoupled from automatic continuous rendering loops, preventing cascading re-renders and duplicate calls.

### 4. Interactive Candidate Tools
- **Web Speech Synthesis API:** In-browser zero-dependency text-to-speech for audible question rehearsal.
- **STAR Framework Structuring:** Explicit decomposition of behavioral scenarios into Situation, Task, Action, and Result.
- **Dynamic Roadmap Storage:** Task completion persists in client `localStorage` with real-time progress indicators.
