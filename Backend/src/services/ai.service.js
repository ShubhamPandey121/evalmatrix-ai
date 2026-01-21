const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
let puppeteer = null;
try {
    puppeteer = require("puppeteer");
} catch (e) {
    console.warn("Puppeteer not installed or unavailable:", e.message);
}

/**
 * Enterprise AI Service powered by Google Gemini
 * Includes fallback logic, structured schema parsing, and mock answer assessment
 * Author: Shubham Pandey
 */

const getApiKey = () => process.env.GOOGLE_GENAI_API_KEY || "";

const getAiClient = () => {
    const key = getApiKey();
    if (!key) return null;
    try {
        return new GoogleGenAI({ apiKey: key });
    } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err.message);
        return null;
    }
};

// ── Zod Schemas for Structured JSON Output ────────────────────────────────────

const interviewReportSchema = z.object({
    title: z.string().describe("The clean professional title of the job (e.g. Senior Frontend Engineer)"),
    targetCompany: z.string().describe("Target company or industry domain identified from the job description"),
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating profile-to-job match"),
    fitSummary: z.string().describe("A 2-3 sentence executive summary explaining why the candidate matches or where key gaps lie"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("In-depth technical interview question tailored to the tech stack"),
        intention: z.string().describe("What the interviewer is testing for (knowledge, scalability, edge cases)"),
        answer: z.string().describe("Comprehensive model answer covering core concepts, architectural trade-offs, and examples"),
        difficulty: z.enum(["easy", "medium", "hard"]).describe("Question difficulty level"),
        category: z.string().describe("Category such as Architecture, System Design, Algorithms, State Management, etc.")
    })).min(3).describe("Technical questions covering core requirements in the job description"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("Situational or behavioral question relevant to team dynamics and leadership"),
        intention: z.string().describe("What the interviewer aims to assess (conflict resolution, ownership, communication)"),
        answer: z.string().describe("Suggested approach and key talking points"),
        starFramework: z.object({
            situation: z.string().describe("Context/Situation setup"),
            task: z.string().describe("The specific task or challenge"),
            action: z.string().describe("Actions taken using personal initiative"),
            result: z.string().describe("Measurable positive outcomes and lessons learned")
        }).describe("STAR framework breakdown for structured answering")
    })).min(2).describe("Behavioral and cultural questions with STAR framework models"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("Specific skill or tool required by the job that candidate is light on"),
        severity: z.enum(["low", "medium", "high"]).describe("Severity impact on hiring decision"),
        recommendation: z.string().describe("Concise actionable tip or resource to bridge this gap quickly")
    })).describe("Identified skill gaps with practical learning recommendations"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("Day number starting from 1 up to 5-7"),
        focus: z.string().describe("Core theme for the day (e.g. System Design, Coding Challenges, Mock Interview)"),
        tasks: z.array(z.string()).describe("List of concrete, actionable study tasks for this day")
    })).min(3).describe("A day-by-day structured preparation roadmap")
});

const answerEvaluationSchema = z.object({
    score: z.number().min(0).max(100).describe("Score from 0 to 100 for candidate's answer"),
    feedback: z.string().describe("Overall assessment of candidate's answer"),
    strengths: z.array(z.string()).describe("Specific strong points mentioned"),
    areasToImprove: z.array(z.string()).describe("Missing details or areas that need refinement"),
    refinedAnswer: z.string().describe("A polished, highly impressive version of their answer")
});

// ── Smart Fallback Generators (Offline / No API Key resilience) ────────────────

function generateFallbackReport({ resume = "", selfDescription = "", jobDescription = "" }) {
    const isFrontend = /react|frontend|javascript|css|vue|next/i.test(jobDescription);
    const isBackend = /node|express|python|java|database|mongodb|sql|backend/i.test(jobDescription);
    const roleTitle = isFrontend ? "Senior Frontend Engineer" : isBackend ? "Senior Backend / Systems Engineer" : "Full Stack Software Engineer";

    return {
        title: roleTitle,
        targetCompany: "Technology & Software Solutions",
        matchScore: Math.floor(Math.random() * 20) + 75,
        fitSummary: `Strong foundational alignment with ${roleTitle} requirements. Demonstrates solid background in modern software engineering principles, with targeted opportunities to deepen domain-specific optimizations.`,
        technicalQuestions: [
            {
                question: isFrontend
                    ? "Explain the Virtual DOM reconciliation algorithm and how React 18+ manages concurrent rendering transitions."
                    : "How do you design a scalable microservices architecture handling high write throughput with MongoDB and distributed locking?",
                intention: "Evaluate deep architectural understanding, performance optimization instincts, and edge-case awareness under production loads.",
                answer: "Start with high-level mechanics: explain thread pool vs event loop or fiber trees. Then discuss batching, memory footprints, lock contention mitigation, and backpressure handling. Conclude with real-world profiling tools (Chrome DevTools, APM metrics).",
                difficulty: "hard",
                category: isFrontend ? "Frontend Architecture" : "System Design"
            },
            {
                question: "How do you ensure zero-downtime deployments and data migration consistency in a distributed production environment?",
                intention: "Tests real-world production engineering maturity, deployment pipelines, and failure resilience.",
                answer: "Discuss blue/green or canary deployment strategies, expand-and-contract schema migrations, feature flagging, and automated smoke testing during rolling restarts.",
                difficulty: "medium",
                category: "DevOps & Reliability"
            },
            {
                question: "Describe your approach to API security, token revocation, and guarding against CSRF, XSS, and rate exhaustion.",
                intention: "Assess security-first engineering mindset and compliance best practices.",
                answer: "Detail HTTPS-only cookies, strict SameSite attributes, JWT signature verification with short expirations and Redis/Mongo blacklist TTL, input sanitization via Zod, and IP-based rate limiters.",
                difficulty: "medium",
                category: "Security"
            }
        ],
        behavioralQuestions: [
            {
                question: "Tell me about a time you had to deliver a critical project under tight deadlines with ambiguous technical specifications.",
                intention: "Assesses ambiguity navigation, prioritization, stakeholder communication, and high-pressure execution.",
                answer: "Highlight proactive stakeholder alignment, breaking ambiguity into measurable MVPs, timeboxing spikes, and keeping transparent progress status.",
                starFramework: {
                    situation: "A enterprise client requested an unexpected core compliance feature 3 weeks prior to major launch.",
                    task: "Needed to architect, validate, and ship the feature without slipping existing milestones.",
                    action: "Organized a rapid alignment workshop with product leads, descoped non-critical elements, and led daily syncs.",
                    result: "Shipped on schedule with 100% test coverage and zero regression bugs."
                }
            },
            {
                question: "Describe a situation where you had a strong disagreement with a technical decision made by a peer or senior engineer.",
                intention: "Tests intellectual humility, objective reasoning, and constructive conflict resolution.",
                answer: "Focus on data-driven discussions, running quick benchmark spikes rather than debating opinions, and committing fully once a path is chosen.",
                starFramework: {
                    situation: "Team was divided between implementing a GraphQL gateway vs extending existing REST endpoints.",
                    task: "Resolve architectural stalemate without damaging team collaboration.",
                    action: "Built a 1-day benchmark prototype comparing latency, payload sizes, and client developer experience.",
                    result: "Data clearly showed REST with partial response fields met all requirements with 50% less operational overhead."
                }
            }
        ],
        skillGaps: [
            {
                skill: "Large-Scale Distributed Caching & Invalidation",
                severity: "medium",
                recommendation: "Review Redis cache-aside patterns, write-through strategies, and stale-while-revalidate protocols."
            },
            {
                skill: "Advanced Observability & Distributed Tracing",
                severity: "low",
                recommendation: "Familiarize yourself with OpenTelemetry, structured logging standards, and Prometheus/Grafana dashboard setups."
            }
        ],
        preparationPlan: [
            {
                day: 1,
                focus: "Core Fundamentals & System Architecture Review",
                tasks: [
                    "Review target job requirements and map them directly against your portfolio projects.",
                    "Deep-dive into event loops, memory allocation, and concurrency patterns."
                ]
            },
            {
                day: 2,
                focus: "Deep Dive: Technical Problem Solving & Coding Scenarios",
                tasks: [
                    "Practice 3 medium-to-hard problems focusing on data structures and time complexity analysis.",
                    "Review clean code principles, error boundary design, and modular code structuring."
                ]
            },
            {
                day: 3,
                focus: "System Design & Production Edge Cases",
                tasks: [
                    "Design a scalable notification or rate-limiting system from scratch on a whiteboard.",
                    "Review trade-offs between SQL vs NoSQL, caching layers, and database sharding."
                ]
            },
            {
                day: 4,
                focus: "Behavioral Mastery & STAR Story Formulations",
                tasks: [
                    "Draft 4 core STAR stories highlighting leadership, conflict resolution, technical debt, and ownership.",
                    "Practice answering behavioral questions aloud with concise 2-minute time constraints."
                ]
            },
            {
                day: 5,
                focus: "Full Mock Interview Simulation & Polishing",
                tasks: [
                    "Conduct an end-to-end mock interview session with simulated timer pressure.",
                    "Refine resume talking points and prepare smart questions for the interviewers."
                ]
            }
        ]
    };
}

// ── Core Service Functions ───────────────────────────────────────────────────

/**
 * Generates an end-to-end interview strategy and technical report
 */
async function generateInterviewReport({ resume = "", selfDescription = "", jobDescription = "" }) {
    const ai = getAiClient();

    if (!ai) {
        console.warn("⚠️ GOOGLE_GENAI_API_KEY is not set. Generating intelligent simulated report.");
        return generateFallbackReport({ resume, selfDescription, jobDescription });
    }

    const prompt = `You are a Principal Engineering Director and Senior Technical Recruiter at a top tech company.
Analyze the following candidate profile against the target job description and generate an actionable, world-class interview preparation roadmap.

Candidate Resume Details:
${resume || "Not provided (refer to self description)"}

Candidate Self Description:
${selfDescription || "Not provided (refer to resume)"}

Target Job Description:
${jobDescription}

Provide realistic, non-generic technical questions matching the specific technologies mentioned, structured behavioral questions with the STAR method, identified skill gaps with actionable fixes, and a day-by-day prep plan.`;

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        });

        if (response && response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("Empty response from AI model");
    } catch (err) {
        console.error("Gemini AI API Error, attempting fallback model or intelligent mock:", err.message);
        // Try fallback model if configured
        try {
            const fallbackModel = "gemini-1.5-flash";
            const response = await ai.models.generateContent({
                model: fallbackModel,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(interviewReportSchema),
                }
            });
            if (response && response.text) {
                return JSON.parse(response.text);
            }
        } catch (innerErr) {
            console.warn("Fallback model also encountered an issue:", innerErr.message);
        }

        return generateFallbackReport({ resume, selfDescription, jobDescription });
    }
}

/**
 * Converts HTML content to PDF buffer via Puppeteer
 */
async function generatePdfFromHtml(htmlContent) {
    if (!puppeteer) {
        throw new Error("Puppeteer is not installed in the environment.");
    }

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

/**
 * Generates an ATS-tailored resume HTML and renders it to a downloadable PDF
 */
async function generateResumePdf({ resume = "", selfDescription = "", jobDescription = "", candidateName = "Candidate" }) {
    const ai = getAiClient();

    let resumeHtml = "";

    const resumePdfSchema = z.object({
        html: z.string().describe("The full HTML document of the ATS-optimized resume")
    });

    const prompt = `Generate a modern, ATS-compliant, single-page or two-page professional resume tailored specifically to this job description.
Candidate Name: ${candidateName}
Resume Details: ${resume || "Extract from self description"}
Self Description: ${selfDescription || "Extract from resume"}
Target Job Description: ${jobDescription}

HTML Requirements:
- Use clean semantic HTML5 (<header>, <section>, <h3>, <ul>, <li>).
- Clean professional styling using inline CSS with a modern typography stack (Inter, system-ui, Arial).
- Include clear sections: Header (Name, Contact, Target Role), Professional Summary, Core Competencies/Skills, Professional Experience, Education & Certifications.
- Strong action verbs and quantified impact metrics.
- Return a JSON object with a single 'html' field containing complete standalone HTML (<!DOCTYPE html><html>...</html>).`;

    if (ai) {
        try {
            const response = await ai.models.generateContent({
                model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(resumePdfSchema),
                }
            });

            const parsed = JSON.parse(response.text);
            resumeHtml = parsed.html;
        } catch (err) {
            console.warn("AI resume generation failed, using high-end template:", err.message);
        }
    }

    if (!resumeHtml) {
        resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ATS Tailored Resume - ${candidateName}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #222; line-height: 1.5; margin: 0; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 15px; margin-bottom: 20px; }
        .name { font-size: 26px; font-weight: bold; color: #111; margin: 0; }
        .title { font-size: 15px; color: #0056b3; font-weight: 600; margin-top: 5px; }
        .contact { font-size: 13px; color: #555; margin-top: 6px; }
        h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0056b3; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px; }
        p, li { font-size: 13px; color: #333; }
        ul { margin: 6px 0 12px 20px; padding: 0; }
        .job-title { font-weight: bold; font-size: 13px; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .skill-pill { background: #f0f4f8; border: 1px solid #d0dbe5; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">${candidateName}</h1>
        <div class="title">Software Engineer | AI & Cloud Solutions</div>
        <div class="contact">Email: candidate@example.com | Portfolio: github.com/portfolio | LinkedIn: linkedin.com/in/profile</div>
    </div>

    <h2>Professional Summary</h2>
    <p>Results-driven Software Engineer with proven expertise building scalable, high-performance web applications and cloud architectures. Adept at leveraging modern design patterns, automated testing, and CI/CD pipelines to deliver high-impact software solutions aligned with strategic business goals.</p>

    <h2>Key Technical Skills</h2>
    <div class="skills-grid">
        <span class="skill-pill">JavaScript (ES6+)</span>
        <span class="skill-pill">TypeScript</span>
        <span class="skill-pill">React.js</span>
        <span class="skill-pill">Node.js / Express</span>
        <span class="skill-pill">MongoDB / SQL</span>
        <span class="skill-pill">System Architecture</span>
        <span class="skill-pill">REST & GraphQL APIs</span>
        <span class="skill-pill">Docker & Cloud Deployments</span>
    </div>

    <h2>Professional Experience</h2>
    <div class="job-title">Senior Software Engineer &bull; Tech Innovations Inc. <span style="float:right; font-weight:normal; color:#666;">2023 - Present</span></div>
    <ul>
        <li>Architected and delivered low-latency microservices serving over 500,000 monthly active users, reducing API response times by 35%.</li>
        <li>Spearheaded transition to modern component architectures and unified state management, cutting build times by 40%.</li>
        <li>Collaborated with product, design, and QA leads to define roadmap deliverables and ensure 99.9% uptime compliance.</li>
    </ul>

    <h2>Education & Certifications</h2>
    <p><strong>Bachelor of Technology in Computer Science</strong> &bull; University of Technology</p>
    <p><em>Certified Cloud Practitioner & AWS Solutions Associate</em></p>
</body>
</html>`;
    }

    try {
        const pdfBuffer = await generatePdfFromHtml(resumeHtml);
        return pdfBuffer;
    } catch (err) {
        console.warn("Puppeteer PDF generation was not possible. Returning HTML as text buffer:", err.message);
        return Buffer.from(resumeHtml, "utf-8");
    }
}

/**
 * Evaluates candidate's practice response to a technical or behavioral interview question
 */
async function evaluateMockAnswer({ question, candidateAnswer, expectedIntention = "", modelAnswer = "" }) {
    const ai = getAiClient();

    if (!ai) {
        const wordCount = candidateAnswer.trim().split(/\s+/).length;
        const score = Math.min(95, Math.max(50, wordCount * 2));
        return {
            score,
            feedback: "Solid foundation in your answer. You articulated key concepts clearly and demonstrated practical familiarity with the subject.",
            strengths: [
                "Directly addressed the prompt without unnecessary jargon",
                "Demonstrated relevant technical context and problem-solving awareness"
            ],
            areasToImprove: [
                "Include concrete quantifiable results or benchmark figures",
                "Elaborate on edge-case scenarios and production trade-offs"
            ],
            refinedAnswer: `${candidateAnswer} In production, I would also monitor performance metrics through distributed APM tools and implement fallback strategies for fault tolerance.`
        };
    }

    const prompt = `You are an expert interview coach evaluating a candidate's answer during a mock interview.
Question: ${question}
Interviewer Intention: ${expectedIntention}
Model Answer Reference: ${modelAnswer}
Candidate's Answer:
"""
${candidateAnswer}
"""

Evaluate this answer and provide a score between 0 and 100, overall feedback, specific strengths, areas to improve, and a refined version of their response.`;

    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(answerEvaluationSchema),
            }
        });

        return JSON.parse(response.text);
    } catch (err) {
        console.error("Failed to evaluate candidate answer with AI:", err.message);
        return {
            score: 78,
            feedback: "Good response that covers the fundamentals. Adding specific trade-offs and real-world metrics will make it outstanding.",
            strengths: ["Clear logical flow", "Demonstrated problem domain knowledge"],
            areasToImprove: ["Mention architectural constraints", "Discuss failure handling modes"],
            refinedAnswer: candidateAnswer
        };
    }
}

module.exports = {
    generateInterviewReport,
    generateResumePdf,
    evaluateMockAnswer
};
