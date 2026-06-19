# Product Requirements Document (PRD): Agency Operating System (Agency OS)

## 1. Executive Summary
Agency OS is a self-hosted, 100% open-source enterprise SaaS alternative replacing ClickUp, Asana, Monday, Jira, HubSpot, Zoho Projects, and AgencyAnalytics. It acts as the central command center for agencies, handling clients (CRM), project tasks, employee productivity, automated social media posting, design pipelines, sales, payroll, file storage, and advanced AI predictions (burnout, capacity, revenue forecasting, churn).

---

## 2. User Roles & Permission Matrix
The system uses Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) to restrict resources:

| Role | CRM | Projects & Tasks | Social Posting | Screen Monitor | Payroll Setup | AI Command | File Manager |
|---|---|---|---|---|---|---|---|
| **CEO** | Read/Write | Full Access | Full Access | View Output | Read/Write | Full Access | Full Access |
| **Admin** | Read/Write | Full Access | Full Access | Configure | Read/Write | Full Access | Full Access |
| **Manager** | Read/Write | Full Access | Approve/Post | View Group | Read Slips | Query (Group) | Full Access |
| **Team Leader** | Read/Write | Lead Team Tasks | Approve | No View | Read Slip | Query (Self) | Team Access |
| **Designer** | Read Only | Assign Tasks | Submit Designs | Consent Only| Read Slip | No | Design Folders |
| **Video Editor** | Read Only | Assign Tasks | Submit Videos | Consent Only| Read Slip | No | Video Folders |
| **Social Exec** | Read Only | Execute Tasks | Draft/Queue | Consent Only| Read Slip | No | Social Folders |
| **SEO Exec** | Read Only | Execute Tasks | No | Consent Only| Read Slip | No | Report Folders |
| **Google Ads** | Read/Write | Execute Tasks | No | Consent Only| Read Slip | No | Report Folders |
| **Meta Ads** | Read/Write | Execute Tasks | No | Consent Only| Read Slip | No | Report Folders |
| **Sales Exec** | Full CRM | No Tasks | No | Consent Only| Read Slip | No | Proposal Folder|
| **HR** | View | No Tasks | No | Consent Only| Full Admin | No | HR Folder |
| **Accountant** | View | No Tasks | No | Consent Only| Full Admin | No | Invoice Folder |
| **Client** | Self CRM | View Tasks | View/Approve | N/A | N/A | N/A | Client Folder |

---

## 3. Core Functional Requirements

### 3.1. Client CRM
- Store fields: Business Name, Contact Name, Email, Mobile, WhatsApp, Website, Social Handles, Meta Business and Ad Account IDs, Monthly Package details, Budgets, and Assigned Teams.
- Track client contract dates with auto-notification templates.

### 3.2. Client Health AI
- Engagement score, Response latency score, Renewal probability, Client Risk (Churn prediction), Profitability, and Growth indicators.
- Uses local vector store databases and Qwen/Mistral LLM for conversational analyses.

### 3.3. Social Media Management & Meta Integration
- Post content planner, weekly/monthly calendar view.
- Connects to Meta Graph API, queues and pushes posts.
- Detects failed posts, escalates to Team Leaders and Managers via tasks and real-time push alerts.

### 3.4. Design Approval Workflow
- Manager assigns → Designer uploads → Team Lead checks → Manager confirms → Social Exec Schedules → Post published -> performance logs.

### 3.5. Employee Monitoring & Daily Work Planner
- Attendance clocking (In, Break, Out), Idle detection, Application and URL usage stats, location logs.
- periodic desktop screenshot captures (when enabled by Admin, requires explicit employee consent).
- Daily Tasks check sheet, urgent prompts, and automated EOD reporting logs.

### 3.6. Sales CRM & AI Sales Assistant
- Visual Kanban pipelines (Lead, Qualified, Meeting, Proposal, Negotiation, Won, Lost).
- Conversion rate logs, Revenue reports.
- Local LLM generators for Proposals, Follow-up Emails, and meeting summary notes.

### 3.7. Payroll & Document Storage
- Generate payslips with deductions, bonuses, leave reductions, and direct PDF generation.
- Self-hosted files repository (MinIO S3 wrapper) automating logical folders (`Client/`, `Design/`, `Video/`, `Document/`, `Report/`, `Contract/`).

---

## 4. Proprietary AI Features
- **AI Workload Balancer:** Evaluates current backlogs and routes incoming tasks to under-utilized staff.
- **AI Capacity Analyzer & Burnout Detector:** Evaluates activity patterns, working hours, and task delay factors to predict fatigue and potential delays.
- **AI Revenue Forecast:** Predicts 12-month metrics using regressions and historical pipeline velocities.
- **AI Agency Brain:** Local natural language chat interface executing query searches (e.g., "Which designer is overloaded?").

---

## 5. Security & Isolation
- JWT Authentication, httpOnly refresh token rotation, multi-factor (2FA) verification.
- Tenant isolation schema where every record resolves to a tenant ID.
- Advanced audit logs capturing every administrative interaction.
- Strict XSS/CSRF protections, AES-256 encrypted fields, and TLS 1.3 setups.
