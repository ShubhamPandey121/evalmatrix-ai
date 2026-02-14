import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import Toast from "../../../components/Toast.jsx";

/**
 * Quick Pre-fill Role Templates
 */
const SAMPLE_TEMPLATES = [
    {
        title: "Full Stack Engineer",
        jd: "Senior Full Stack Engineer (React & Node.js). Requires 4+ years building high-throughput web applications. Proficiency in TypeScript, React 18+, Node.js, Express, MongoDB, RESTful & GraphQL APIs, microservices architecture, and Docker. Experience with automated CI/CD and AWS is strongly preferred.",
        self: "Full Stack Developer with 4 years building enterprise web apps. Strong in React, TypeScript, Node.js, and MongoDB. Led migration to microservices architecture reducing API latency by 30%."
    },
    {
        title: "Frontend Architect",
        jd: "Staff Frontend Architect (React, Next.js, Design Systems). Deep expertise in modern frontend engineering, core web vitals, performance tuning, component library design, state management with Zustand/Redux, and end-to-end testing with Playwright.",
        self: "Senior Frontend Engineer with 5 years experience specializing in React, Next.js, and design systems. Engineered scalable micro-frontends serving 1M+ active users."
    },
    {
        title: "AI & ML Engineer",
        jd: "GenAI Software Engineer. Responsible for building LLM-powered applications using LangChain, Google Gemini API, OpenAI, RAG vector pipelines (Pinecone/Milvus), and Python backend services. Experience with model fine-tuning and evaluation harnesses.",
        self: "Software Engineer specializing in Applied AI and LLM integrations. Built RAG search pipelines and automated evaluation metrics with Gemini and vector databases."
    }
];

const Home = () => {
    const { loading, generateReport, reports, getReports, deleteReport, stats, fetchStats } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("info");
    const [loadingTipIndex, setLoadingTipIndex] = useState(0);

    const resumeInputRef = useRef();
    const navigate = useNavigate();

    const LOADING_TIPS = [
        "Analyzing target job requirements and core competency metrics...",
        "Evaluating candidate profile alignment and mapping technical skill gaps...",
        "Formulating realistic technical questions and STAR behavioral models...",
        "Assembling day-by-day personalized preparation milestones...",
        "Synthesizing ATS-tailored resume blueprint..."
    ];

    // Load reports and stats on mount
    useEffect(() => {
        getReports();
        fetchStats();
    }, []);

    // Rotate tips while loading
    useEffect(() => {
        let timer;
        if (loading) {
            timer = setInterval(() => {
                setLoadingTipIndex(idx => (idx + 1) % LOADING_TIPS.length);
            }, 4000);
        }
        return () => clearInterval(timer);
    }, [loading]);

    const showToast = (msg, type = "info") => {
        setToastMessage(msg);
        setToastType(type);
        setTimeout(() => setToastMessage(""), 4500);
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith(".pdf")) {
            showToast("Please select a PDF format file (.pdf)", "error");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast("File size exceeds 5MB limit. Please choose a smaller PDF.", "error");
            return;
        }
        setSelectedFile(file);
        showToast(`Resume attached: ${file.name}`, "success");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleTemplateClick = (template) => {
        setJobDescription(template.jd);
        setSelfDescription(template.self);
        showToast(`Applied preset: ${template.title}`, "info");
    };

    const handleGenerate = async () => {
        if (!jobDescription || jobDescription.trim().length < 15) {
            showToast("Please enter a target job description (at least 15 characters)", "error");
            return;
        }

        if (!selectedFile && (!selfDescription || selfDescription.trim().length < 5)) {
            showToast("Please attach your resume PDF or write a quick self-description", "error");
            return;
        }

        try {
            const data = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile: selectedFile
            });

            if (data && data._id) {
                navigate(`/interview/${data._id}`);
            }
        } catch (err) {
            showToast(err.message || "Failed to generate interview strategy. Please try again.", "error");
        }
    };

    const handleDeletePlan = async (e, reportId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this interview plan?")) {
            try {
                await deleteReport(reportId);
                showToast("Interview plan deleted successfully", "success");
                fetchStats();
            } catch (err) {
                showToast(err.message || "Failed to delete plan", "error");
            }
        }
    };

    const filteredReports = reports.filter(r =>
        (r.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.targetCompany || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="spinner-large" />
                <h2>Building Your Interview Strategy</h2>
                <p className="loading-tip">{LOADING_TIPS[loadingTipIndex]}</p>
                <div className="loading-progress-bar">
                    <div className="loading-progress-fill" />
                </div>
                <span className="ai-subtext">Powered by Google Gemini 2.5 &bull; Architected by Shubham Pandey</span>
            </main>
        );
    }

    return (
        <div className="home-page">
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />

            {/* Quick Analytics Bar */}
            {stats && (
                <div className="stats-banner">
                    <div className="stat-card">
                        <span className="stat-label">Total Plans</span>
                        <span className="stat-value">{stats.totalReports || reports.length}</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-card">
                        <span className="stat-label">Average Match</span>
                        <span className="stat-value">{stats.averageMatchScore || 0}%</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-card">
                        <span className="stat-label">Readiness Status</span>
                        <span className="stat-value stat-status">{stats.readinessLevel || "Ready"}</span>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <header className="page-header">
                <h1>Craft Your Winning <span className="highlight">Interview Strategy</span></h1>
                <p>AI extracts core competencies, creates custom technical &amp; STAR behavioral questions, highlights skill gaps, and tailors an ATS resume.</p>
            </header>

            {/* Preset Templates */}
            <div className="template-pills">
                <span className="template-label">⚡ Quick Fill Sample:</span>
                {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                    <button
                        key={idx}
                        className="template-btn"
                        type="button"
                        onClick={() => handleTemplateClick(tmpl)}
                    >
                        {tmpl.title}
                    </button>
                ))}
            </div>

            {/* Main Interactive Card */}
            <div className="interview-card">
                <div className="interview-card__body">

                    {/* Left Panel - Job Description */}
                    <div className="panel panel--left">
                        <div className="panel__header">
                            <span className="panel__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className="badge badge--required">Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="panel__textarea"
                            placeholder="Paste the target job description or requirements here...&#10;e.g. 'Senior Software Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                            maxLength={5000}
                        />
                        <div className="char-counter">{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="panel-divider" />

                    {/* Right Panel - Profile */}
                    <div className="panel panel--right">
                        <div className="panel__header">
                            <span className="panel__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <h2>Your Candidate Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className="upload-section">
                            <label className="section-label">
                                Attach Resume PDF
                                <span className="badge badge--best">Recommended</span>
                            </label>

                            {selectedFile ? (
                                <div className="selected-file-box">
                                    <div className="file-info">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                            <line x1="16" y1="13" x2="8" y2="13"/>
                                            <line x1="16" y1="17" x2="8" y2="17"/>
                                            <polyline points="10 9 9 9 8 9"/>
                                        </svg>
                                        <div className="file-details">
                                            <span className="file-name">{selectedFile.name}</span>
                                            <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="remove-file-btn"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            if (resumeInputRef.current) resumeInputRef.current.value = "";
                                        }}
                                        title="Remove file"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className={`dropzone ${isDragging ? "dropzone--dragging" : ""}`}
                                    htmlFor="resume"
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                >
                                    <span className="dropzone__icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 16 12 12 8 16" />
                                            <line x1="12" y1="12" x2="12" y2="21" />
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                        </svg>
                                    </span>
                                    <p className="dropzone__title">Click to upload or drag &amp; drop</p>
                                    <p className="dropzone__subtitle">PDF Document (Max 5MB)</p>
                                    <input
                                        ref={resumeInputRef}
                                        hidden
                                        type="file"
                                        id="resume"
                                        name="resume"
                                        accept=".pdf"
                                        onChange={(e) => handleFileSelect(e.target.files[0])}
                                    />
                                </label>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className="or-divider"><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className="self-description">
                            <label className="section-label" htmlFor="selfDescription">Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id="selfDescription"
                                name="selfDescription"
                                className="panel__textarea panel__textarea--short"
                                placeholder="Highlight your years of experience, core tech stack, key projects, and domains..."
                                maxLength={1000}
                            />
                            <div className="char-counter char-counter--short">{selfDescription.length} / 1000 chars</div>
                        </div>

                        {/* Info Notice */}
                        <div className="info-box">
                            <span className="info-box__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" />
                                </svg>
                            </span>
                            <p>Either a <strong>Resume PDF</strong> or <strong>Self Description</strong> is used to calibrate your custom strategy.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="interview-card__footer">
                    <span className="footer-info">EvalMatrix AI Strategy Engine &bull; Shubham Pandey Edition</span>
                    <button
                        onClick={handleGenerate}
                        className="generate-btn"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                        Generate Interview Strategy
                    </button>
                </div>
            </div>

            {/* Past Interview Reports Section */}
            {reports.length > 0 && (
                <section className="recent-reports">
                    <div className="recent-reports__header">
                        <h2>My Interview Preparation Roadmaps</h2>
                        <div className="search-box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search past positions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="reports-grid">
                        {filteredReports.map((report) => (
                            <div
                                key={report._id}
                                className="report-card"
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <div className="report-card__header">
                                    <div className="role-badge">Role</div>
                                    <button
                                        type="button"
                                        className="delete-card-btn"
                                        onClick={(e) => handleDeletePlan(e, report._id)}
                                        title="Delete plan"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                        </svg>
                                    </button>
                                </div>
                                <h3>{report.title || "Custom Engineering Role"}</h3>
                                <p className="report-company">{report.targetCompany || "Technology Domain"}</p>
                                <div className="report-card__footer">
                                    <span className={`match-badge ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}>
                                        {report.matchScore || 75}% Match
                                    </span>
                                    <span className="report-date">
                                        {new Date(report.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
