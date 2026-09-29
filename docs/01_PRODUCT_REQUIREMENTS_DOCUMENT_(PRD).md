# Product Requirements Document (PRD) — Udaan (उड़ान)

**Product Name:** Udaan (उड़ान)  
**Headline:** *"From 'Pending at District Level' to 'Waiting on this desk, for this reason, until this date.'"*  
**Problem Statement:** SIH26239 — Decision Support & Case Management Layer for Scheduled Tribe (ST) Scholarships & Fellowships  
**Nodal Authority:** Ministry of Tribal Affairs (MoTA), Government of India  
**Target Event:** Smart India Hackathon 2026  
**Document Version:** 2.0 (Executive Production Specification)  

---

## 1. Executive Summary & Vision

Every year, hundreds of thousands of Scheduled Tribe (ST) students across India apply for Post-Matric Scholarships and National Fellowships for Higher Education of ST Students (NFST) through the National Scholarship Portal (NSP). 

Despite digital submission, internal audits by the Ministry of Tribal Affairs (MoTA) and Comptroller and Auditor General (CAG) revealed systemic operational gridlocks:
* Applications remain stagnant across approval tiers for **3 to 45 months**.
* Students are locked out by arbitrary 200 KB upload limits, causing blurry scans that officers reject without clear explanations.
* Defect notices sent via SMS read vaguely: *"Pending at District Level"* or *"Application Defective"*, giving rural students no actionable path to remedy errors before application windows close.
* AI and rule-based fraud detection algorithms frequently misidentify shared Common Service Center (CSC) Pragya Kendra bank accounts as fraud syndicates, unfairly freezing legitimate tribal students.

**Udaan (उड़ान)** is an AI-assisted decision-support and case-management layer designed to sit **directly on top of NSP**. It replaces no legacy systems; instead, it supercharges the existing workflow with client-side image diagnostics, automated document-versus-application reconciliation, deterministic zero-hallucination statutory rule evaluation, unified bilingual deficiency notices with speech assistance, and desk-level SLA countdowns with automated statutory escalations.

---

## 2. Core Invariants (Non-Negotiable System Principles)

1. **Human-in-the-Loop Authority:** AI and rule engines **NEVER** auto-reject or auto-approve an application. Constitutional authority remains exclusively with gazetted District Welfare Officers (DWOs) and Institutional Nodal Officers (INOs).
2. **Deterministic, Zero-Hallucination Rule Engine:** All eligibility checks are executed via explicit, versioned, transparent logic (`v1.4.2`). Large Language Models (LLMs) are forbidden from making binding eligibility determinations.
3. **The Non-Accusation Principle:** Statistical anomalies (e.g., multiple students linked to a single bank account node) are routed to human review with **plausible legitimate hypotheses** (e.g., CSC operator helper, hostel warden, joint family account), preventing punitive automated disqualifications.
4. **Actionable Transparency:** Students must never see ambiguous status codes. Status displays must conform to the Udaan Transparency Formula:  
   $$\text{Status} = \text{Desk Owner} + \text{Specific Statutory Reason} + \text{Resolution Deadline}$$
5. **DPDP Act 2023 Compliance:** Zero plain-text Aadhaar storage. Biometric or demographic verification is strictly ephemeral and tokenized.
6. **Consolidated Deficiency Windows:** An applicant must never receive piecemeal defect queries. All discrepancies are batched into a **single unified deficiency packet** with a statutory 15-day cure window.

---

## 3. User Personas & Problem-Solution Matrix

| Persona | Operational Context | Current Friction Point in NSP | Udaan Solution |
| :--- | :--- | :--- | :--- |
| **ST Applicant / CSC Operator** | Rural students applying via Pragya Kendras (Jharkhand/Odisha) on low-bandwidth 4G | 200 KB file cap forces extreme compression, leading to blurry scans and arbitrary rejections months later | **Screen 1:** Client-side HTML5 Canvas Laplacian blur & luminance pre-check before upload completes |
| **Institutional Nodal Officer (INO)** | College scholarship desk officer handling bona-fide student verification | Manually cross-referencing physical fee receipts, attendance registers, and AISHE codes | Automated cross-reference against AISHE Directory and fee structure caps |
| **District Welfare Officer (DWO / DNO)** | High-volume district officer reviewing 5,000+ files per scholarship cycle | Eyeballing small JPEG scans against student input fields; no live link to State Revenue registries | **Screen 2:** Split-screen inspector, AI OCR bounding boxes, side-by-side reconciliation, and 1-click fast lane |
| **State Nodal Officer (SNO)** | State Director of Tribal Welfare supervising 24 districts | Zero visibility into district-level bottlenecks until annual CAG audits highlight fund lapses | **Screen 3:** Automated escalation alerts when desk SLAs breach, re-routing files to district collectors |
| **Central MoTA Administrators** | New Delhi policy officers managing national ST quota and fellowship disbursements | Delayed PFMS disbursement cycles due to late-stage NPCI Aadhaar-bank account seeding mismatches | Upfront PFMS / NPCI DBT readiness validation during intake |

---

## 4. Functional Specifications

### Screen 1: Student Intake & Client-Side Canvas Pre-Check
* **Purpose:** Catch document quality flaws, name typos, and bank routing errors at the point of entry before the applicant leaves the Common Service Center.
* **Key Features:**
  1. **Live HTML5 Canvas Quality Diagnostics:**
     * Runs directly in the applicant's browser on raw image pixel buffers without sending uncompressed files to the cloud.
     * Computes **Laplacian Variance** ($3 \times 3$ convolution kernel) to measure edge sharpness. Threshold: $> 85.0$ indicates sharp focus; $< 85.0$ flags `BLURRY PHOTO / RETAKE RECOMMENDED`.
     * Computes **Mean Luminance** and **Contrast Standard Deviation** to catch overexposed flash glare or underexposed dark photographs.
     * Measures effective pixel resolution (minimum $1000 \times 1400\text{ px}$ for A4 document readability).
  2. **Live Open IFSC Bank Branch Resolver:**
     * Integrates with open-source RBI bank branch registries.
     * Instantly resolves 11-digit IFSC codes (e.g., `SBIN0000073` $\rightarrow$ State Bank of India, Dumka Court Compound) and checks NEFT/IMPS/DBT readiness.
  3. **Pre-Seeded Real Government Scenarios:**
     * One-click demo switchers for **Case A (Fast Lane - Clean Santhal ST)**, **Case B (Standard Lane - Expired Income & Typo)**, and **Case C (Review Lane - Oraon ST Bank Cluster)**.

---

### Screen 2: Officer Intelligence Console (HERO SCREEN)
* **Purpose:** Provide District Welfare Officers with an enterprise-grade dual-pane decision environment that eliminates manual eyeballing while preserving 100% human discretion.
* **Key Features:**
  1. **Automated Triage Queues:**
     * **Fast Lane (Clean):** 100% match across application data and revenue certificate; instant 1-click approval pushes application to the next tier in $< 10\text{ seconds}$.
     * **Standard Lane (Deficiencies / Discrepancies):** Highlights minor typos or expired certificates; generates a consolidated cure packet.
     * **Review Lane (High Fan-In Bank Clusters):** Flags statistical anomalies (e.g., $>3$ applicants sharing an account) for non-punitive human inquiry.
  2. **Authentic Scanned Document Inspector:**
     * High-resolution, multi-layered A4 certificate floating on an optical desk mat (`#111827`) with studio drop shadows.
     * Authentic Jharkhand e-District JharSewa layouts with Devanagari headers, revenue circle seals, barcodes, and digital PKI signature stamps.
     * **Interactive AI Bounding Boxes:** Clicking extracted fields in the comparison table pans and highlights the corresponding bounding box on the scanned paper with confidence scores ($98\% - 99\%$).
  3. **Deterministic Statutory Rule Engine (`v1.4.2`):**
     * `RULE-INC-01`: Parental Annual Income Ceiling ($\le ₹2,50,000$ per MoTA guidelines).
     * `RULE-ST-02`: State Scheduled Tribe Schedule Verification (cross-referenced against the Constitution Scheduled Tribes Order 1950, Jharkhand Part XXI).
     * `RULE-VAL-03`: Income Certificate Freshness Window (enforces state revenue circulars requiring certificates issued within the past 12 months).
     * `RULE-ID-04`: Applicant Identity Fuzzy Consistency (Levenshtein distance matching with tolerance for single-letter tribal surname transliterations).
     * `RULE-BANK-05`: Bank Account Multi-Applicant Clustering (PFMS DBT guardrail).
  4. **The Non-Accusation Bank Cluster Panel (Case C):**
     * Displays a network link topology showing Bank Account `PNB ...4821` linked to 15 student files across Ranchi district.
     * Surfaces **3 Plausible Legitimate Hypotheses**:
       * *Hypothesis 1 (Pragya Kendra Helper):* Local CSC kiosk operator mistakenly entered center account for rural students without personal accounts.
       * *Hypothesis 2 (College Hostel / Warden Account):* Polytechnic hostel warden assisting first-generation residential students.
       * *Hypothesis 3 (Joint Undivided Family):* Sibling group sharing a single verified post office savings account.
  5. **Consolidated Deficiency Notice & Multilingual Voice Guidance (Case B):**
     * Generates a single unified cure notice in English (for official records) and Hindi (for WhatsApp/SMS).
     * **Web Speech API Audio Player:** Synthesizes clear verbal instructions in Hindi (`hi-IN`) and English (`en-IN`) to accommodate low-literacy applicants and guardians.
  6. **Immutable Officer Audit Ledger:**
     * Every action (Approve, Waive Typo, Request Explanation, Escalate) generates a tamper-evident log record stored with officer ID, action code, timestamp, and rule engine version.

---

### Screen 3: Desk SLA & Student Transparency Tracker
* **Purpose:** Eliminate the notorious 3–45 month black-box delays by providing real-time desk tracking and automated escalation workflows.
* **Key Features:**
  1. **Active Desk Ownership Card:**
     * Explicitly displays which officer desk currently holds the file (`District Welfare Officer, Ranchi`).
     * States the exact operational reason (`Under Review: Bank Account Shared Verification Required`).
     * Real-time countdown timer showing remaining days within the statutory 15-day resolution window.
  2. **Automated Escalation Simulator:**
     * Evaluators can click `+5 Days (Overdue Test)` to simulate an unresponsive desk.
     * When the countdown expires, the status chip shifts from warm amber to high-contrast rose red (`SLA OVERDUE by 1 Days! Escalated`).
     * Displays an active statutory escalation banner notifying that the case has been escalated directly to the State Nodal Officer (SNO) and District Collector.
  3. **4-Tier Approval Pipeline Progress:**
     * Visual milestone tracker across the four governance layers:
       $$\text{Tier 1: INO (College)} \longrightarrow \text{Tier 2: DNO (District)} \longrightarrow \text{Tier 3: SNO (State)} \longrightarrow \text{Tier 4: PFMS / MoTA (Centre)}$$
  4. **NPCI DBT & Aadhaar Seeding Readiness:**
     * Pre-checks whether the student's Aadhaar is actively seeded with NPCI mapper to prevent disbursement bounces.

---

## 5. Technical Specifications & Stack

* **Frontend Framework:** React 19 + Vite (Single Page Application architecture)
* **Design System & Styling:** Modern Tailwind CSS with custom sovereign tokens (`#090e17` obsidian, `#f8fafc` slate, `#059669` emerald, `#d97706` amber, `#7c3aed` purple)
* **Typography:** Plus Jakarta Sans (Headings), Inter (Data Grid), JetBrains Mono (Tabular Numeral System), Noto Sans Devanagari (Hindi Script)
* **Computer Vision / Image Diagnostics:** HTML5 Canvas 2D Context, Laplacian kernel matrix convolution, RGB luminance transformation
* **Voice Synthesis:** Web Speech API (`SpeechSynthesisUtterance`) with automatic voice discovery for Indian regional accents (`hi-IN`, `en-IN`)
* **Icons:** Lucide React (vector icon suite)
* **Live External API:** Razorpay IFSC Public Registry (querying real RBI bank branch records)

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

| Metric | Baseline in Legacy NSP | Target with Udaan Layer |
| :--- | :--- | :--- |
| **Average End-to-End Processing Time** | 3 to 45 months | **14 to 21 business days** |
| **Fast Lane 1-Click Clearance Time** | 8 to 15 minutes per dossier | **$< 30$ seconds per dossier** |
| **Defective Upload Rejection Rate** | ~28% due to unreadable / blurry scans | **$< 2\%$ (caught upfront by Canvas diagnostics)** |
| **Deficiency Resolution Success Rate** | $< 35\%$ (students miss deadlines due to vague SMS) | **$> 85\%$ (due to 15-day cure notice + Hindi audio)** |
| **False Accusation Rate on Shared Accounts** | Severe (automatic disqualification) | **$0\%$ (guaranteed by Non-Accusation inquiry workflow)** |
