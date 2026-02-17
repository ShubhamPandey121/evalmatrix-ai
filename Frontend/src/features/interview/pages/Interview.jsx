import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate, useParams, Link } from "react-router";
import Toast from "../../../components/Toast.jsx";

// ── Navigation Tabs ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
    {
        id: "technical",
        label: "Technical Questions",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: "behavioral",
        label: "STAR Behavioral",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: "roadmap",
        label: "Preparation Roadmap",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
    {
        id: "practice",
        label: "Mock Answer Lab",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
            </svg>
        )
    }
];

// ── Web Speech API Audio Helper ───────────────────────────────────────────────
const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
};

// ── Technical Question Card ───────────────────────────────────────────────────
const TechnicalQuestionCard = ({ item, index, onCopy }) => {
    const [open, setOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [mastered, setMastered] = useState(false);

    const handleSpeak = (e) => {
        e.stopPropagation();
        setIsSpeaking(true);
        speakQuestion(item.question);
        setTimeout(() => setIsSpeaking(false), 4000);
    };

    return (
        <div className={`q-card ${mastered ? "q-card--mastered" : ""}`}>
            <div className="q-card__header" onClick={() => setOpen(o => !o)}>
                <span className="q-card__index">Q{index + 1}</span>
                <div className="q-card__meta-content">
                    <div className="q-card__badges">
                        {item.difficulty && (
                            <span className={`difficulty-badge difficulty--${item.difficulty}`}>
                                {item.difficulty}
                            </span>
                        )}
                        {item.category && (
                            <span className="category-badge">{item.category}</span>
                        )}
                    </div>
                    <p className="q-card__question">{item.question}</p>
                </div>
                <div className="q-card__actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className={`action-icon-btn ${isSpeaking ? "action-icon-btn--active" : ""}`}
                        title="Listen to question"
                        onClick={handleSpeak}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="action-icon-btn"
                        title="Copy question and answer"
                        onClick={() => onCopy(`Question: ${item.question}\n\nIntention: ${item.intention}\n\nModel Answer: ${item.answer}`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                    </button>
                    <button
                        type="button"
                        className={`action-icon-btn ${mastered ? "action-icon-btn--checked" : ""}`}
                        title={mastered ? "Marked as mastered" : "Mark as mastered"}
                        onClick={() => setMastered(!mastered)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </button>
                    <span className={`q-card__chevron ${open ? "q-card__chevron--open" : ""}`} onClick={() => setOpen(o => !o)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </div>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">Interviewer Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Model Answer &amp; Key Concepts</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Behavioral Question Card (STAR Framework) ─────────────────────────────────
const BehavioralQuestionCard = ({ item, index, onCopy }) => {
    const [open, setOpen] = useState(false);
    const star = item.starFramework || {};

    return (
        <div className="q-card q-card--star">
            <div className="q-card__header" onClick={() => setOpen(o => !o)}>
                <span className="q-card__index q-card__index--star">B{index + 1}</span>
                <div className="q-card__meta-content">
                    <span className="category-badge category-badge--star">STAR Method</span>
                    <p className="q-card__question">{item.question}</p>
                </div>
                <div className="q-card__actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className="action-icon-btn"
                        title="Copy behavioral guide"
                        onClick={() => onCopy(`Question: ${item.question}\n\nIntention: ${item.intention}\n\nSTAR Framework:\n- Situation: ${star.situation || ""}\n- Task: ${star.task || ""}\n- Action: ${star.action || ""}\n- Result: ${star.result || ""}\n\nModel Answer: ${item.answer}`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                    </button>
                    <span className={`q-card__chevron ${open ? "q-card__chevron--open" : ""}`} onClick={() => setOpen(o => !o)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </div>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">Interviewer Focus</span>
                        <p>{item.intention}</p>
                    </div>

                    {/* STAR Framework Breakdown */}
                    {(star.situation || star.task || star.action || star.result) && (
                        <div className="star-grid">
                            <div className="star-box">
                                <span className="star-pill">S &bull; Situation</span>
                                <p>{star.situation || "Set context clearly"}</p>
                            </div>
                            <div className="star-box">
                                <span className="star-pill">T &bull; Task</span>
                                <p>{star.task || "Specific challenge faced"}</p>
                            </div>
                            <div className="star-box">
                                <span className="star-pill">A &bull; Action</span>
                                <p>{star.action || "Your specific contribution"}</p>
                            </div>
                            <div className="star-box">
                                <span className="star-pill">R &bull; Result</span>
                                <p>{star.result || "Measurable positive outcome"}</p>
                            </div>
                        </div>
                    )}

                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Comprehensive Response</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Roadmap Day Component with Checkable Tasks ────────────────────────────────
const RoadMapDay = ({ day, reportId }) => {
    const storageKey = `roadmap_${reportId}_day_${day.day}`;
    const [checkedTasks, setCheckedTasks] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const toggleTask = (taskIndex) => {
        setCheckedTasks(prev => {
            const updated = { ...prev, [taskIndex]: !prev[taskIndex] };
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
        });
    };

    const completedCount = Object.values(checkedTasks).filter(Boolean).length;
    const isDayCompleted = day.tasks && day.tasks.length > 0 && completedCount === day.tasks.length;

    return (
        <div className={`roadmap-day ${isDayCompleted ? "roadmap-day--completed" : ""}`}>
            <div className="roadmap-day__header">
                <span className="roadmap-day__badge">Day {day.day}</span>
                <h3 className="roadmap-day__focus">{day.focus}</h3>
                <span className="task-progress-badge">{completedCount}/{day.tasks.length} Done</span>
            </div>
            <ul className="roadmap-day__tasks">
                {day.tasks.map((task, i) => (
                    <li
                        key={i}
                        className={`task-item ${checkedTasks[i] ? "task-item--checked" : ""}`}
                        onClick={() => toggleTask(i)}
                    >
                        <input
                            type="checkbox"
                            checked={!!checkedTasks[i]}
                            onChange={() => toggleTask(i)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// ── Mock Answer Lab Component ─────────────────────────────────────────────────
const MockAnswerLab = ({ questions, onSubmitEvaluation }) => {
    const [selectedQIndex, setSelectedQIndex] = useState(0);
    const [candidateAnswer, setCandidateAnswer] = useState("");
    const [evaluation, setEvaluation] = useState(null);
    const [evaluating, setEvaluating] = useState(false);
    const [timer, setTimer] = useState(120);
    const [timerActive, setTimerActive] = useState(false);

    const currentQuestion = questions[selectedQIndex] || questions[0];

    useEffect(() => {
        let interval = null;
        if (timerActive && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0) {
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timer]);

    const handleStartTimer = () => {
        setTimer(120);
        setTimerActive(true);
    };

    const handleEvaluate = async () => {
        if (!candidateAnswer.trim()) return;
        setEvaluating(true);
        try {
            const result = await onSubmitEvaluation({
                question: currentQuestion.question,
                candidateAnswer,
                expectedIntention: currentQuestion.intention,
                modelAnswer: currentQuestion.answer
            });
            setEvaluation(result);
        } catch (err) {
            console.error(err);
        } finally {
            setEvaluating(false);
        }
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <div className="mock-lab">
            <div className="lab-selector">
                <label>Select Practice Question:</label>
                <select
                    value={selectedQIndex}
                    onChange={(e) => {
                        setSelectedQIndex(Number(e.target.value));
                        setEvaluation(null);
                        setCandidateAnswer("");
                    }}
                >
                    {questions.map((q, idx) => (
                        <option key={idx} value={idx}>
                            Q{idx + 1}: {q.question.slice(0, 65)}...
                        </option>
                    ))}
                </select>
            </div>

            <div className="lab-prompt-card">
                <div className="prompt-header">
                    <span className="prompt-badge">Active Interview Question</span>
                    <div className="timer-box">
                        <span className="timer-text">{formatTime(timer)}</span>
                        <button
                            type="button"
                            className="timer-btn"
                            onClick={() => (timerActive ? setTimerActive(false) : handleStartTimer())}
                        >
                            {timerActive ? "Pause" : "Start 2-Min Timer"}
                        </button>
                    </div>
                </div>
                <h3>{currentQuestion?.question}</h3>
                <p className="intention-hint"><em>Interviewer test:</em> {currentQuestion?.intention}</p>
            </div>

            <div className="lab-editor">
                <label>Type Your Spoken Response:</label>
                <textarea
                    rows={6}
                    placeholder="Structure your answer clearly. Cover core concepts, trade-offs, and metrics..."
                    value={candidateAnswer}
                    onChange={(e) => setCandidateAnswer(e.target.value)}
                />
                <div className="lab-actions">
                    <span className="word-count">{candidateAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <button
                        type="button"
                        className="evaluate-btn"
                        disabled={evaluating || !candidateAnswer.trim()}
                        onClick={handleEvaluate}
                    >
                        {evaluating ? "AI Analyzing Response..." : "Evaluate My Response"}
                    </button>
                </div>
            </div>

            {evaluation && (
                <div className="evaluation-result">
                    <div className="eval-header">
                        <h4>AI Interview Feedback</h4>
                        <span className="eval-score">{evaluation.score} / 100</span>
                    </div>
                    <p className="eval-feedback">{evaluation.feedback}</p>

                    {evaluation.strengths && (
                        <div className="eval-block">
                            <strong>Key Strengths:</strong>
                            <ul>
                                {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}

                    {evaluation.areasToImprove && (
                        <div className="eval-block">
                            <strong>Recommended Refinements:</strong>
                            <ul>
                                {evaluation.areasToImprove.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Main Interview Component ──────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState("technical");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("info");
    const [isDownloading, setIsDownloading] = useState(false);

    const { report, getReportById, loading, getResumePdf, submitAnswerEvaluation } = useInterview();
    const { interviewId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    }, [interviewId]);

    const showToast = (msg, type = "info") => {
        setToastMessage(msg);
        setToastType(type);
        setTimeout(() => setToastMessage(""), 4500);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        showToast("Copied to clipboard!", "success");
    };

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        showToast("Generating ATS-tailored PDF resume...", "info");
        try {
            await getResumePdf(interviewId);
            showToast("Resume downloaded successfully!", "success");
        } catch (err) {
            showToast(err.message || "Failed to download PDF", "error");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleExportMarkdown = () => {
        if (!report) return;

        let md = `# Interview Preparation Plan: ${report.title}\n`;
        md += `*Target Company/Domain:* ${report.targetCompany || "General"}\n`;
        md += `*Match Score:* ${report.matchScore}%\n`;
        md += `*Generated by EvalMatrix AI (Creator: Shubham Pandey - https://github.com/ShubhamPandey121)*\n\n`;

        md += `## Executive Summary\n${report.fitSummary || ""}\n\n`;

        md += `## Technical Questions\n`;
        (report.technicalQuestions || []).forEach((q, i) => {
            md += `### Q${i + 1}: ${q.question} (${q.difficulty || "medium"})\n`;
            md += `**Category:** ${q.category || "General"}\n`;
            md += `**Intention:** ${q.intention}\n`;
            md += `**Model Answer:**\n${q.answer}\n\n`;
        });

        md += `## STAR Behavioral Questions\n`;
        (report.behavioralQuestions || []).forEach((b, i) => {
            md += `### B${i + 1}: ${b.question}\n`;
            md += `**Intention:** ${b.intention}\n`;
            if (b.starFramework) {
                md += `- **Situation:** ${b.starFramework.situation}\n`;
                md += `- **Task:** ${b.starFramework.task}\n`;
                md += `- **Action:** ${b.starFramework.action}\n`;
                md += `- **Result:** ${b.starFramework.result}\n`;
            }
            md += `**Sample Answer:**\n${b.answer}\n\n`;
        });

        md += `## Skill Gaps & Action Items\n`;
        (report.skillGaps || []).forEach((g) => {
            md += `- **${g.skill}** [${g.severity.toUpperCase()}]: ${g.recommendation || ""}\n`;
        });
        md += `\n`;

        md += `## Preparation Plan\n`;
        (report.preparationPlan || []).forEach((day) => {
            md += `### Day ${day.day}: ${day.focus}\n`;
            (day.tasks || []).forEach(t => {
                md += `- [ ] ${t}\n`;
            });
            md += `\n`;
        });

        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Interview_Kit_${report.title.replace(/\s+/g, "_")}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Full Interview Kit exported as Markdown (.md)", "success");
    };

    if (loading || !report) {
        return (
            <main className="loading-screen">
                <div className="spinner-large" />
                <h2>Loading your interview plan...</h2>
                <p>Retrieving personalized questions, roadmap, and resume blueprint</p>
            </main>
        );
    }

    const scoreColor =
        report.matchScore >= 80 ? "score--high" :
            report.matchScore >= 60 ? "score--mid" : "score--low";

    return (
        <div className="interview-page">
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />

            {/* Top Sub-Bar */}
            <div className="interview-topbar">
                <button type="button" className="back-link-btn" onClick={() => navigate("/")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Dashboard
                </button>

                <div className="role-title-heading">
                    <h1>{report.title || "Custom Engineering Role"}</h1>
                    <span className="company-badge">{report.targetCompany || "Technology Domain"}</span>
                </div>

                <div className="export-actions">
                    <button
                        type="button"
                        className="export-btn export-btn--md"
                        onClick={handleExportMarkdown}
                        title="Download Markdown guide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export .MD Kit
                    </button>
                    <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                        className="button primary-button download-resume-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                        </svg>
                        {isDownloading ? "Generating PDF..." : "Download ATS Resume"}
                    </button>
                </div>
            </div>

            {/* 3-Column Interactive Layout */}
            <div className="interview-layout">

                {/* ── Left Navigation ── */}
                <nav className="interview-nav">
                    <div className="nav-content">
                        <p className="interview-nav__label">Sections</p>
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? "interview-nav__item--active" : ""}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className="interview-nav__icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="nav-footer-box">
                        <div className="author-card">
                            <span className="author-tag">EvalMatrix AI</span>
                            <span className="author-name">by Shubham Pandey</span>
                        </div>
                    </div>
                </nav>

                <div className="interview-divider" />

                {/* ── Center Content ── */}
                <main className="interview-content">
                    {activeNav === "technical" && (
                        <section>
                            <div className="content-header">
                                <h2>Technical Interview Questions</h2>
                                <span className="content-header__count">{report.technicalQuestions?.length || 0} questions</span>
                            </div>
                            <div className="q-list">
                                {(report.technicalQuestions || []).map((q, i) => (
                                    <TechnicalQuestionCard key={i} item={q} index={i} onCopy={handleCopy} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === "behavioral" && (
                        <section>
                            <div className="content-header">
                                <h2>Behavioral Questions (STAR Method)</h2>
                                <span className="content-header__count">{report.behavioralQuestions?.length || 0} scenarios</span>
                            </div>
                            <div className="q-list">
                                {(report.behavioralQuestions || []).map((q, i) => (
                                    <BehavioralQuestionCard key={i} item={q} index={i} onCopy={handleCopy} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === "roadmap" && (
                        <section>
                            <div className="content-header">
                                <h2>Day-by-Day Preparation Roadmap</h2>
                                <span className="content-header__count">{report.preparationPlan?.length || 0}-day sprint</span>
                            </div>
                            <div className="roadmap-list">
                                {(report.preparationPlan || []).map((day) => (
                                    <RoadMapDay key={day.day} day={day} reportId={interviewId} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === "practice" && (
                        <section>
                            <div className="content-header">
                                <h2>Interactive Mock Answer Lab</h2>
                                <span className="content-header__count">Real-time AI Evaluator</span>
                            </div>
                            <MockAnswerLab
                                questions={[...(report.technicalQuestions || []), ...(report.behavioralQuestions || [])]}
                                onSubmitEvaluation={submitAnswerEvaluation}
                            />
                        </section>
                    )}
                </main>

                <div className="interview-divider" />

                {/* ── Right Sidebar ── */}
                <aside className="interview-sidebar">

                    {/* Match Score */}
                    <div className="match-score">
                        <p className="match-score__label">Candidate Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className="match-score__value">{report.matchScore || 75}</span>
                            <span className="match-score__pct">%</span>
                        </div>
                        <p className="match-score__sub">
                            {report.matchScore >= 80 ? "Strong alignment for this role" :
                                report.matchScore >= 60 ? "Competitive profile with targeted prep" : "Fundamental alignment needed"}
                        </p>
                    </div>

                    <div className="sidebar-divider" />

                    {/* Executive Summary */}
                    {report.fitSummary && (
                        <div className="fit-summary-box">
                            <p className="sidebar-label">Executive Fit Analysis</p>
                            <p className="fit-text">{report.fitSummary}</p>
                        </div>
                    )}

                    <div className="sidebar-divider" />

                    {/* Skill Gaps */}
                    <div className="skill-gaps">
                        <p className="skill-gaps__label">Targeted Skill Gaps</p>
                        <div className="skill-gaps__list">
                            {(report.skillGaps || []).map((gap, i) => (
                                <div key={i} className="skill-gap-card">
                                    <div className="skill-gap-header">
                                        <span className={`skill-tag skill-tag--${gap.severity || "medium"}`}>
                                            {gap.skill}
                                        </span>
                                        <span className="severity-pill">{gap.severity} priority</span>
                                    </div>
                                    {gap.recommendation && (
                                        <p className="gap-tip">{gap.recommendation}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default Interview;
