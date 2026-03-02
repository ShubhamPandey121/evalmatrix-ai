# 📡 EvalMatrix AI - API Reference Documentation

> **Platform Owner & Architect:** Shubham Pandey  
> **Email:** shubham230884@gmail.com  
> **GitHub:** [ShubhamPandey121](https://github.com/ShubhamPandey121)  
> **API Version:** 2.0.0  
> **Base URL:** `http://localhost:3000/api`

---

## 🔐 Authentication Endpoints

All protected endpoints require an `Authorization: Bearer <token>` header or a valid `token` cookie set by login/register.

### 1. Register User
- **Route:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "username": "shubham_pandey",
  "email": "shubham230884@gmail.com",
  "password": "Password@123"
}
```
- **Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "id": "67b9...",
      "username": "shubham_pandey",
      "email": "shubham230884@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1Ni..."
  },
  "message": "User registered successfully",
  "success": true
}
```

---

### 2. Login User
- **Route:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "shubham230884@gmail.com",
  "password": "Password@123"
}
```
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "id": "67b9...",
      "username": "shubham_pandey",
      "email": "shubham230884@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1Ni..."
  },
  "message": "Logged in successfully",
  "success": true
}
```

---

### 3. Logout User
- **Route:** `POST /api/auth/logout` or `GET /api/auth/logout`
- **Access:** Public / Authenticated
- **Description:** Clears the HTTP cookie and records the token in the TTL-expiring blacklist.
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Logged out successfully",
  "success": true
}
```

---

### 4. Get Current User Profile
- **Route:** `GET /api/auth/get-me`
- **Access:** Protected (JWT required)
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "id": "67b9...",
      "username": "shubham_pandey",
      "email": "shubham230884@gmail.com",
      "createdAt": "2026-02-23T00:00:00.000Z"
    }
  },
  "message": "User profile retrieved successfully",
  "success": true
}
```

---

### 5. Update Profile
- **Route:** `PUT /api/auth/profile`
- **Access:** Protected (JWT required)
- **Request Body:**
```json
{
  "username": "shubham_pandey_updated"
}
```

---

## 🎯 Interview Strategy & AI Endpoints

### 1. Generate Interview Strategy & Report
- **Route:** `POST /api/interview/`
- **Access:** Protected
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `jobDescription` (text, required): Minimum 15 characters
  - `selfDescription` (text, optional): Candidate summary
  - `resume` (file, optional): PDF document (max 5MB)
- **Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "interviewReport": {
      "_id": "67ba...",
      "title": "Senior Frontend Engineer",
      "targetCompany": "Google",
      "matchScore": 88,
      "fitSummary": "Strong alignment with modern React and TypeScript architecture...",
      "technicalQuestions": [
        {
          "question": "Explain React 18 Concurrent Rendering transitions...",
          "intention": "Evaluate architectural depth and performance instincts...",
          "answer": "Start by clarifying non-blocking state updates...",
          "difficulty": "hard",
          "category": "Frontend Architecture"
        }
      ],
      "behavioralQuestions": [
        {
          "question": "Tell me about a time you handled production technical debt...",
          "intention": "Assesses prioritization and stakeholder management...",
          "answer": "Focus on business value delivery and incremental refactoring...",
          "starFramework": {
            "situation": "Legacy monolithic frontend had 10-minute compile times...",
            "task": "Migrate to modern modular builds without freezing features...",
            "action": "Championed Vite migration in phased sprints...",
            "result": "Cut compile times to 300ms, boosted developer velocity by 40%."
          }
        }
      ],
      "skillGaps": [
        {
          "skill": "Large-Scale State Machines",
          "severity": "medium",
          "recommendation": "Review XState patterns and predictable state machines."
        }
      ],
      "preparationPlan": [
        {
          "day": 1,
          "focus": "Core Architecture Review",
          "tasks": ["Review component lifecycle", "Analyze fiber tree reconciliation"]
        }
      ]
    }
  },
  "message": "Interview strategy and prep plan generated successfully.",
  "success": true
}
```

---

### 2. Get All Interview Plans
- **Route:** `GET /api/interview/?search=Frontend`
- **Access:** Protected
- **Query Params:**
  - `search` (optional): Filter by role title or company
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "interviewReports": [ ... ]
  },
  "message": "Interview reports retrieved successfully.",
  "success": true
}
```

---

### 3. Get Plan by ID
- **Route:** `GET /api/interview/report/:interviewId`
- **Access:** Protected (Ownership enforced)
- **Response (200 OK):** Returns complete interview plan with all sections.

---

### 4. Delete Interview Plan
- **Route:** `DELETE /api/interview/report/:interviewId`
- **Access:** Protected (Ownership enforced)
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Interview report deleted successfully.",
  "success": true
}
```

---

### 5. Download ATS Resume PDF
- **Route:** `POST /api/interview/resume/pdf/:interviewReportId`
- **Access:** Protected (Ownership enforced)
- **Response:** PDF binary attachment (`Content-Disposition: attachment; filename="ATS_Resume_<id>.pdf"`)

---

### 6. User Prep Analytics
- **Route:** `GET /api/interview/stats`
- **Access:** Protected
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "totalReports": 5,
    "averageMatchScore": 84,
    "readinessLevel": "Interview Ready",
    "topSkillGaps": [
      { "skill": "System Design", "count": 3 }
    ]
  },
  "message": "User interview statistics fetched successfully.",
  "success": true
}
```

---

### 7. Mock Answer Evaluation
- **Route:** `POST /api/interview/evaluate-answer`
- **Access:** Protected
- **Request Body:**
```json
{
  "question": "How do you handle database migration rollbacks in production?",
  "candidateAnswer": "I use expand-and-contract migrations with feature toggles...",
  "expectedIntention": "Evaluate zero-downtime database strategies.",
  "modelAnswer": "Detail decoupled schema changes..."
}
```
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "evaluation": {
      "score": 88,
      "feedback": "Strong demonstration of zero-downtime engineering principles.",
      "strengths": ["Mentioned expand/contract pattern", "Clear rollback strategy"],
      "areasToImprove": ["Add specifics on data backfills and indexing locks"],
      "refinedAnswer": "..."
    }
  },
  "message": "Answer evaluated successfully.",
  "success": true
}
```

---

## 🩺 System Health Check

- **Route:** `GET /api/health`
- **Access:** Public
- **Response (200 OK):**
```json
{
  "success": true,
  "status": "healthy",
  "platform": "EvalMatrix AI",
  "version": "2.0.0",
  "author": "Shubham Pandey",
  "timestamp": "2026-02-23T00:00:00.000Z",
  "uptime": "124 seconds"
}
```
