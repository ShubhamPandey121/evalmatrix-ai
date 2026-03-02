# EvalMatrix AI 🚀
### Autonomous AI Technical Interview Simulator & Career Intelligence Platform
**Designed & Developed by [Shubham Pandey](https://github.com/ShubhamPandey121)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.2-61dafb.svg)](https://react.dev/)
[![Gemini 2.5](https://img.shields.io/badge/Google%20GenAI-Gemini%202.5%20Flash-orange.svg)](https://ai.google.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Framework-Express%205.x-black.svg)](https://expressjs.com/)

---

## 📌 Executive Summary

**EvalMatrix AI** is an enterprise-grade career intelligence and autonomous interview simulation platform built for modern software engineers and engineering candidates. By ingesting candidate resumes (via multi-page PDF stream parsing) alongside target job specifications, EvalMatrix AI utilizes Google Gemini 2.5 Flash to compute granular compatibility vectors, pinpoint technical blindspots, generate domain-calibrated technical questions with interviewer intentions, model STAR-framework behavioral answers, orchestrate interactive answer evaluation labs with audio speech synthesis, and dynamically synthesize ATS-compliant targeted resumes in PDF format.

Architected with strict separation of concerns, the platform pairs an **Express 5.x RESTful backend** featuring Zod-constrained structured JSON schema outputs and dual-layer JWT/TTL token invalidation with a **React 19 Vite client** engineered for instant state persistence and sub-second interactions.

---

## 💡 Key Features & Business Rationale

| Feature | Description | Business Rationale |
| :--- | :--- | :--- |
| **Multi-Modal Profile & JD Ingestion** | Ingests PDF resumes via memory buffer stream extraction or raw candidate dossiers paired against rich JD requirements. | Eliminates manual copy-pasting; standardizes candidate profiles regardless of formatting variations. |
| **Match Scoring & Fit Diagnostics** | Calculates 0-100% compatibility scores accompanied by executive summaries, highlight strengths, and prioritized skill gaps. | Gives candidates quantitative clarity on job readiness before entering high-stakes screening rounds. |
| **Calibrated Technical Question Engine** | Generates system design, algorithmic, and architecture questions with interviewer intentions and model answers. | Prepares candidates for deep technical scrutiny beyond generic trivia questions. |
| **STAR Behavioral Framework Engine** | Structures behavioral questions into Situation, Task, Action, and Measurable Result breakdowns. | Trains candidates to articulate impact using the gold-standard hiring framework recognized by Big Tech. |
| **Interactive Practice Lab & Timer** | Live in-browser response recorder with speech synthesis question audio and a 2-minute timed pressure gauge. | Simulates high-pressure live interview dynamics to develop conciseness and fluency. |
| **Real-Time Answer Evaluation** | Algorithmic scoring (0-100%) evaluating candidate responses against expected rubrics with constructive critiques. | Delivers instant iterative feedback without needing expensive mock interview coaches. |
| **Interactive 7-Day Roadmap** | Dynamic day-by-day learning schedule with client-side localStorage state persistence. | Breaks daunting preparation into structured, manageable daily sprints. |
| **Automated ATS Resume Generator** | Headless Puppeteer engine synthesizing role-tailored ATS-optimized resumes in downloadable PDF format. | Maximizes applicant tracking system pass rates by aligning resume terminology directly with target JDs. |
| **Resilient Offline Fallback Simulation** | Fallback cascading engine ensuring zero service downtime even during upstream GenAI quota restrictions. | Guarantees 99.9% uptime for local development, demo environments, and continuous user workflows. |

---

## 🏗️ Technical Architecture & System Design

```
                                  +---------------------------------------+
                                  |         Client Tier (Frontend)        |
                                  |   React 19 + Vite 7 + Sass Modular    |
                                  |   React Router 7 + Context State API  |
                                  |   HTML5 Web Speech API Rehearsal Lab  |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS / REST (JSON + Multipart)
                                                      | JWT Auth Header + Secure Cookies
                                                      v
                                  +---------------------------------------+
                                  |          API Tier (Backend)           |
                                  |      Express 5.x on Node.js 22/26     |
                                  |   - Centralized Async Error Handler   |
                                  |   - Zod Input & Schema Validation     |
                                  |   - Multer Memory File Streamer       |
                                  |   - Dual-Mode JWT & TTL Auth Guard    |
                                  +---------+-------------------+---------+
                                            |                   |
                     Mongoose Connection    |                   |  Structured Prompts & Schemas
                     BSON Document Streams  |                   |  (@google/genai SDK)
                                            v                   v
+-----------------------------------------------+   +-----------------------------------------------+
|               Persistence Tier                |   |              GenAI & PDF Tier                 |
|                   MongoDB                     |   |           Google Gemini 2.5 Flash             |
|   - UserModel: Auth credentials & roles       |   |   - Zod Structured JSON Output Enforcement    |
|   - InterviewReportModel: Complex interview   |   |   - Dynamic Role-Aware Mock Generators        |
|     diagnostics, STAR questions, roadmap      |   |   - Puppeteer Headless Chromium Engine        |
|   - BlacklistModel: Auto-expiring tokens      |   |     (Targeted ATS PDF Resume Synthesis)       |
+-----------------------------------------------+   +-----------------------------------------------+
```

---

## 🗄️ Data Dictionary & Schemas

### 1. `users` Collection
Stores authenticated user credentials and profile metadata.

| Field | Type | Index / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Primary Key | Unique internal MongoDB user identifier |
| `username` | `String` | Required, Trimmed | Unique display username |
| `email` | `String` | Required, Unique, Lowercase | User email address used for credentials and notifications |
| `password` | `String` | Required, Select: false | Bcrypt-hashed password (10 salt rounds) |
| `createdAt` | `Date` | Default: `Date.now` | Account creation timestamp |
| `updatedAt` | `Date` | Default: `Date.now` | Last account update timestamp |

### 2. `interviewreports` Collection
Stores full AI-generated interview diagnostics, evaluation questions, and roadmaps.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Primary identifier for the interview report session |
| `user` | `ObjectId (Ref: User)` | Indexed foreign key linking report to creator |
| `title` | `String` | Canonical role title (e.g., "Staff Backend Systems Architect") |
| `targetCompany` | `String` | Identified target employer or industry domain |
| `matchScore` | `Number (0-100)` | Candidate profile-to-job compatibility index |
| `fitSummary` | `String` | Executive diagnosis explaining readiness and gaps |
| `technicalQuestions` | `Array<Object>` | List of technical challenges `{ question, intention, answer, difficulty, category }` |
| `behavioralQuestions`| `Array<Object>` | Situational challenges with `{ question, intention, answer, starFramework: { situation, task, action, result } }` |
| `skillGaps` | `Array<Object>` | Highlighted gaps with `{ skill, severity: "low"\|"medium"\|"high", recommendation }` |
| `preparationPlan` | `Array<Object>` | 7-day curriculum `{ day: Number, focus: String, tasks: Array<String> }` |
| `atsResume` | `String` | Formatted Markdown resume tailored to job requirements |
| `createdAt` | `Date` | Creation timestamp |

### 3. `tokenblacklists` Collection
Maintains invalidated JWTs for zero-trust logout enforcement with automatic memory cleanup.

| Field | Type | Index / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Primary Key | Blacklist entry identifier |
| `token` | `String` | Required, Unique | Revoked JSON Web Token string |
| `createdAt` | `Date` | TTL Index (`expires: '7d'`) | Native MongoDB TTL index that auto-purges stale records after 7 days |

---

## 📁 Repository Structure

```
.
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection with retry logic
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # User registration, login, logout, profile
│   │   │   └── interview.controller.js # Resume parser, report generator, answer scoring
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   # Dual-mode (Bearer + Cookie) JWT validator
│   │   │   ├── file.middleware.js   # Multer memory storage & PDF validation
│   │   │   └── validate.middleware.js # Express Zod schema validation gate
│   │   ├── models/
│   │   │   ├── blacklist.model.js   # Expiring JWT blacklist schema
│   │   │   ├── interviewReport.model.js # Comprehensive interview report schema
│   │   │   └── user.model.js        # User credentials & authentication schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Auth endpoint routing declarations
│   │   │   └── interview.routes.js  # Interview and assessment endpoint routing
│   │   ├── services/
│   │   │   └── ai.service.js        # Gemini 2.5 SDK integration, fallbacks, Puppeteer PDF
│   │   ├── utils/
│   │   │   ├── asyncHandler.js      # Express async error wrapper
│   │   │   └── response.js          # Standardized ApiResponse & ApiError structures
│   │   ├── validations/
│   │   │   ├── auth.validation.js   # Auth request schema definitions
│   │   │   └── interview.validation.js # Interview generation & answer evaluation schemas
│   │   └── app.js                   # Express application setup & middleware stack
│   ├── .env.example                 # Backend environment variable template
│   ├── package.json                 # Backend dependencies and scripts
│   └── server.js                    # Server bootstrap & graceful shutdown handler
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx           # Global sticky footer with author links
│   │   │   ├── Navbar.jsx           # Responsive header with profile menu
│   │   │   └── Toast.jsx            # Notification banner component
│   │   ├── features/
│   │   │   ├── auth/                # Auth pages, context, and JWT management
│   │   │   └── interview/           # Dashboard, question cards, practice lab, roadmap
│   │   ├── style/                   # Modular Sass stylesheets and mixins
│   │   ├── App.jsx                  # Root router provider
│   │   ├── app.routes.jsx           # Route definitions & protected guards
│   │   └── main.jsx                 # React 19 DOM entrypoint
│   ├── .env.example                 # Frontend client environment template
│   ├── index.html                   # HTML5 template with SEO metadata
│   ├── package.json                 # Frontend dependencies and Vite scripts
│   └── vite.config.js               # Vite build configuration & server proxies
├── docs/
│   ├── API_DOCUMENTATION.md         # Exhaustive REST API contract reference
│   └── ARCHITECTURE.md              # Architectural diagrams and deep-dive notes
├── .env.example                     # Root environment configuration
├── .gitignore                       # Production Git ignore rules
├── package.json                     # Monorepo convenience scripts
└── README.md                        # Master project documentation
```

---

## ⚡ Setup & Execution Instructions

### 1. Prerequisites
- **Node.js**: `v20.x` or later
- **npm**: `v10.x` or later
- **MongoDB**: Local daemon running at `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI
- **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

### 2. Clone Repository & Setup Environment
```bash
# Clone the repository
git clone https://github.com/ShubhamPandey121/evalmatrix-ai.git
cd evalmatrix-ai

# Configure Backend environment variables
cp Backend/.env.example Backend/.env

# Configure Frontend environment variables
cp Frontend/.env.example Frontend/.env
```

Ensure `Backend/.env` contains your active MongoDB URI and Gemini API key:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/evalmatrix_ai
JWT_SECRET=evalmatrix_ai_shubham_pandey_super_secret_jwt_key_2026
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
# Install root, backend, and frontend dependencies in one command
npm run install:all
```
*(Or install manually: `cd Backend && npm install && cd ../Frontend && npm install`)*

### 4. Run Development Servers
```bash
# Option A: Start both Backend and Frontend concurrently from root
npm run dev

# Option B: Run in separate terminals
# Terminal 1: Backend API (Port 3000)
npm run dev:backend

# Terminal 2: Frontend Client (Port 5173)
npm run dev:frontend
```

Open your browser at `http://localhost:5173` to access **EvalMatrix AI**.

---

## 🧪 Testing & Health Checks

Verify your backend connection and engine status anytime via the public health check endpoint:

```bash
curl -X GET http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "platform": "EvalMatrix AI",
  "version": "2.0.0",
  "author": "Shubham Pandey",
  "email": "shubham230884@gmail.com",
  "github": "https://github.com/ShubhamPandey121",
  "timestamp": "2026-03-02T10:00:00.000Z",
  "uptime": "142 seconds"
}
```

---

## 👤 Author & Developer

**Shubham Pandey**
- **GitHub**: [@ShubhamPandey121](https://github.com/ShubhamPandey121)
- **Email**: [shubham230884@gmail.com](mailto:shubham230884@gmail.com)
- **Role**: Sole Creator, Lead Architect & Full-Stack Developer

---

## 📄 License

This project is licensed under the **MIT License** - see the `package.json` for details.
All original design, engineering implementations, and documentation are proprietary to **Shubham Pandey**.
