# Udaan (उड़ान) — ST Scholarship Decision-Support & Case-Management Layer

> **Smart India Hackathon 2026 • Problem Statement: SIH26239**  
> **Ministry of Tribal Affairs (MoTA)**  
> *"From 'Pending at District Level' to 'Waiting on this desk, for this reason, until this date.'"*

---

## 🏛️ System Overview & Problem Addressed
Under the National Scholarship Portal (NSP), Post-Matric scholarships for Scheduled Tribe (ST) students endure 3 to 45 month processing delays across 4 sequential approval tiers (INO → DNO → SNO → Centre). 
- Officers must manually eyeball scanned revenue certificates with no connection to state registries.
- Defect notices are vague ("Pending at District Level"), trapping students in bureaucratic limbo.
- Severe document compression caps (200 KB) cause illegible uploads.
- DBT payments bounce silently due to Aadhaar-NPCI mapping failures.

**Udaan does not replace NSP; it sits as an assistive decision-support layer on top of it.**

---

## 📚 Evaluator & Judge Documentation Suite

A complete set of formal documents is available in the [`docs/`](./docs/README.md) directory:

1. [**Product Requirements Document (PRD)**](./docs/01_PRODUCT_REQUIREMENTS_DOCUMENT_%28PRD%29.md): Complete functional specifications, problem background, persona definitions, and rule engine specifications.
2. [**Why a Prototype, Not a Full Monolithic App?**](./docs/02_WHY_A_PROTOTYPE_NOT_A_FULL_APP.md): Strategic architectural justification explaining why we built an interactive DPI decision-support prototype on top of NSP rather than a redundant full-stack app.
3. [**Hackathon Pitch Script & Judge Q&A Defense Matrix**](./docs/03_HACKATHON_PITCH_SCRIPT_%26_JUDGE_QA.md): 3-minute elevator pitch, 5-minute live demo click sequence, and defense answers for the 10 hardest judge questions.
4. [**System Architecture & DPI Integration Blueprint**](./docs/04_SYSTEM_ARCHITECTURE_%26_DPI_INTEGRATION.md): Mathematical algorithms (Laplacian blur kernel, Levenshtein fuzzy match), DPI integration (NSP, DigiLocker, PFMS), and SHA-256 audit chaining.
5. [**Master Documentation Index**](./docs/README.md): Quick navigation index for all project documentation.

---

## 🛡️ Non-Negotiable Design Rules
| Principle | Implementation in Udaan |
| :--- | :--- |
| **No Auto-Disqualification** | AI never auto-rejects or auto-approves. A human officer makes every final decision. |
| **Explainable Rules** | Every flag references a versioned Rule ID (`RULE-INC-01`, `RULE-ST-02`), evidence, and reason. |
| **Non-Punitive Risk Review** | Risk signals route to review, never punishment. Plausible benign hypotheses (cyber-café operator account, hostel warden) are explicitly presented. |
| **Real Open Government Data** | Integrated with **real open data**: Official 32 ST Gazette (MoTA), AISHE College Codes, LGD Admin Codes, and **Live RBI/Razorpay Open IFSC API** queries. |
| **Honest Integration Badging** | Every widget is badged: `LIVE-SELF-HOSTED` (Canvas analyzer, rule engine, speech synthesis), `MOCK-GOVT-ADAPTER` (DigiLocker, PFMS/NPCI), or `SIMULATED` (OCR bounding boxes). |
| **Synthetic & Safe** | All demo applicant records are synthetic to respect DPDP Act 2023. Real administrative gazettes and open bank APIs are used for ground truth. |

---

## ⏱️ 3-Minute Scripted Pitch Walkthrough (For Hackathon Judges)

### Minute 0:00 – 0:45 | Introduction & The Transparency Promise
1. **Open the prototype**: Point to the banner: *"Udaan sits ON TOP of NSP; it replaces nothing."*
2. **Deliver the Problem Headline**:
   > *"Judges, right now thousands of tribal students see 'Pending at District Level' on NSP for up to 45 months without knowing who has their file or what is wrong. Udaan transforms this to: 'Waiting on this desk, for this reason, until this date.' Let us show you how."*
3. **Show Screen 1 (Student Intake & Pre-Check)**:
   - Click **"Test Blurry Sample"** under ST/Caste Certificate.
   - Point to the **Live Canvas Quality Inspector**:
     > *"Notice this is not a mock percentage. We run an actual Laplacian 3x3 convolution kernel directly over the pixel buffer on HTML5 canvas. The score is 24.1—flagged as blurry—and prompts the student to retake before submitting. This prevents millions of unreadable PDFs from choking officer queues."*

---

### Minute 0:45 – 2:15 | Screen 2: Officer Intelligence Console (Hero Screen)
1. **Switch to Screen 2 (Officer Intelligence Console)**:
   > *"Here is the Hero Screen: the Officer Intelligence Console. It triages applications into 3 transparent lanes: Fast Lane, Standard Review, and Elevated Review."*
2. **Show Case A (Fast Lane - Ramesh Soren)**:
   - Click **Case A**. Point to the left panel (Document Viewer) and right panel (Rule Trace).
   - Show how `RULE-INC-01` (Income ₹1,80,000 <= ₹2,50,000) and `RULE-ST-02` (Santhal verified in Jharkhand ST Schedule) passed live from `rules-v1.4.2.json`.
   - Click **"Approve File"**: Point to instant officer confirmation and immutable audit log entry.
3. **Show Case B (Standard Lane - Sunita Munda - Minor Deficiency)**:
   - Click **Case B**.
   - Notice the document viewer highlights the **Income Certificate Issue Date: 10-03-2025** (18 months old > 12-month limit) and a minor father's name typo (`Mangraa` vs `Mangra`).
   - Scroll to the **Consolidated Actionable Deficiency Packet**:
     > *"Instead of a vague rejection, Udaan generates ONE consolidated packet detailing the document, page, field, exact fix, and a 15-day deadline."*
   - Click **"Play Hindi Audio"**:
     > *Listen as the browser Web Speech API speaks the exact remedy out loud in Hindi for rural applicants with limited literacy.*
4. **Show Case C (Review Lane - Amit Kumar Tirkey - Shared Bank Account)**:
   - Click **Case C**.
   - Show the **Elevated Review Panel**:
     > *"Here, Bank Account ...4821 is linked to 15 different student applications. But notice our strict fairness invariant: AI does not accuse or auto-reject. We surface 3 legitimate hypotheses—such as a Pragya Kendra cyber-café operator mistakenly entering their own commercial account number. The officer has two choices: Request Explanation or Escalate."*

---

### Minute 2:15 – 3:00 | Screen 3: Desk SLA & Payment Readiness
1. **Switch to Screen 3 (Desk SLA & Student Tracker)**:
   - Show the **Active Desk Card**:
     - *Waiting on: District Welfare Officer, Ranchi*
     - *Specific Reason: Revenue certificate cross-verification*
     - *Deadline: 02 Oct 2026 (Days remaining countdown)*
2. **Demonstrate Automated SLA Escalation**:
   - Click **"+5 Days (Overdue Test)"**:
     > *"Watch what happens when an officer lets an application sit past the statutory SLA. The timer turns red, and an automated escalation alert is triggered directly to the State Nodal Officer and District Collector."*
3. **Show DBT / NPCI Seeding Readiness**:
   - Point to the **Aadhaar-NPCI Mapper card**:
     > *"40% of scholarship failures happen at disbursement because student accounts are not NPCI-seeded for DBT. Udaan pre-flights bank accounts against the NPCI mapper before approval, with clear fix instructions for the student."*
4. **Conclusion**:
   > *"Udaan gives the Ministry of Tribal Affairs zero-cost decision support, zero auto-rejections, and 100% transparent accountability. Thank you."*

---

## 🚀 Running the Prototype Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# App runs at: http://localhost:5173
```
