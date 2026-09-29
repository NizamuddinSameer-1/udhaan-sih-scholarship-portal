# Udaan (उड़ान) — Project Documentation & Evaluator Dossier

> **Smart India Hackathon 2026** | **Problem Statement:** SIH26239  
> **Nodal Authority:** Ministry of Tribal Affairs (MoTA), Government of India  
> **Product Vision:** AI-Assisted Decision-Support & Case-Management Layer for Scheduled Tribe (ST) Scholarships & Fellowships  
> **Headline:** *"From 'Pending at District Level' to 'Waiting on this desk, for this reason, until this date.'"*

---

## Documentation Index

This directory contains the complete product, architectural, strategic, and presentation documentation suite for **Udaan (उड़ान)**:

| Document | Title | Purpose & Audience |
| :--- | :--- | :--- |
| [**01_PRODUCT_REQUIREMENTS_DOCUMENT_(PRD).md**](./01_PRODUCT_REQUIREMENTS_DOCUMENT_%28PRD%29.md) | **Comprehensive PRD** | Full functional & non-functional requirements, problem background, persona definitions, and rule engine specifications. |
| [**02_WHY_A_PROTOTYPE_NOT_A_FULL_APP.md**](./02_WHY_A_PROTOTYPE_NOT_A_FULL_APP.md) | **Strategic Architectural Rationale** | Detailed explanation of why Udaan is built as an interactive decision-support prototype on top of NSP rather than a redundant full-stack app. |
| [**03_HACKATHON_PITCH_SCRIPT_&_JUDGE_QA.md**](./03_HACKATHON_PITCH_SCRIPT_%26_JUDGE_QA.md) | **Pitch Script & Judge Defense Q&A** | 3-minute elevator pitch, 5-minute live demo click sequence, and defense answers for the 10 hardest judge questions. |
| [**04_SYSTEM_ARCHITECTURE_&_DPI_INTEGRATION.md**](./04_SYSTEM_ARCHITECTURE_%26_DPI_INTEGRATION.md) | **Technical Architecture & DPI Blueprint** | Mathematical algorithms (Laplacian blur kernel, Levenshtein fuzzy match), DPI integration (NSP, DigiLocker, PFMS), and SHA-256 audit chaining. |

---

## Core Project Highlights

### 1. The Real Problem (From Ministry Audits)
* **3 to 45 Months Delay:** Sequential 4-tier approval (`INO → DNO → SNO → Centre`) without desk accountability.
* **Unreadable 200 KB Scans:** Harsh compression caps produce blurry certificate uploads that officers reject months later.
* **Vague Defect Notices:** Students receive cryptic SMS messages (*"Pending at District Level"*) with no explanation of how to fix errors.
* **Punitive AI:** Shared bank accounts at rural Common Service Centers (Pragya Kendras) are automatically banned as fraud syndicates.

### 2. Our Strategic Decision: Prototype on Top of NSP
* **We do NOT replace NSP.** NSP is the multi-million-dollar national system of record operated by NIC.
* **Udaan sits ON TOP of NSP** as a high-velocity decision-support and case-management layer.
* Our prototype focuses 100% on solving the hard algorithmic and human-centered problems rather than setting up generic login screens.

### 3. Key Innovations in Udaan
1. **Client-Side HTML5 Canvas Laplacian Blur Pre-Check:** Catches defective scans before the applicant leaves the CSC kiosk.
2. **Dual-Pane Document Inspector:** Genuine scanned Jharkhand revenue certificates with AI OCR bounding boxes.
3. **Deterministic Statutory Rule Engine (`v1.4.2`):** Zero-hallucination verification of income ceilings and State ST Schedules.
4. **Consolidated Bilingual Notices with Voice:** 15-day cure window with Web Speech audio guidance in Hindi and English.
5. **Non-Accusation Bank Cluster Reasoning:** 3 legitimate hypotheses for shared accounts, protecting tribal students from false fraud accusations.
6. **Automated Desk SLA Escalations:** Active countdown timers that escalate overdue files directly to District Collectors.
7. **Tamper-Evident SHA-256 Chained Audit Ledger:** Complete officer accountability for state and CAG audits.

---

## Quick Start & Verification

### Running the Live Prototype
```bash
# Install dependencies
npm install

# Launch Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in any modern web browser.

### Generating Verified High-Resolution Scanned Certificates
```bash
python generate_real_certificates.py
```
Generates 6 authentic Jharkhand revenue certificates (Santhal, Munda, Oraon) with Devanagari Hindi headers and digital signatures in `public/certificates/`.

### Automated Visual Verification Suite (Playwright)
```bash
python verify_ui.py
```
Runs end-to-end browser tests across all three screens, testing fast-lane approvals, deficiency notices, Web Speech audio, cluster graphs, and SLA escalations.
