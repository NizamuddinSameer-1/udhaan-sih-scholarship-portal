# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: District Welfare Officers (DWO/DNO)** reviewing high volumes of Scheduled Tribe scholarship applications and making the statutory determination.
- **Secondary: ST applicants and Common Service Centre operators** submitting applications, checking document quality, resolving deficiencies, and understanding application status.
- **Other workflow users:** Institutional Nodal Officers, State Nodal Officers, and central Ministry of Tribal Affairs administrators.
- **Evaluators:** Smart India Hackathon reviewers assessing the prototype's feasibility and workflow demonstrations.

## Product Purpose

Udaan (उड़ान) is an AI-assisted decision-support and case-management layer for ST scholarships and fellowships on the National Scholarship Portal (NSP). It aims to reduce avoidable document defects and processing delays while making each application's owner, reason for waiting, and next deadline clear. Success means demonstrating an actionable, explainable workflow while preserving human authority.

## Positioning

Udaan overlays the existing NSP process rather than replacing it. Its distinctive mechanism combines client-side document quality checks, deterministic and explainable rules, human review of risk signals, consolidated bilingual remedies, and desk-level SLA visibility.

## Operating Context

- Students may apply through a Common Service Centre on low-bandwidth mobile connectivity and may need Hindi voice guidance.
- District officers review scanned certificates, compare extracted fields with application data, resolve statutory checks, and record decisions.
- The prototype demonstrates the INO → DNO → SNO → Centre approval chain and desk-level escalation.
- Smart India Hackathon evaluators use seeded scenarios to inspect the core workflows.

## Capabilities and Constraints

- Student intake includes client-side image quality checks, document examples, application details, and a submission demonstration.
- The officer console presents Fast, Standard, and Review lanes, document inspection, rule traces, consolidated deficiency notices, non-punitive bank-cluster hypotheses, and an audit ledger.
- The student tracker communicates the current desk, a specific reason, a deadline, approval stages, escalation behavior, and payment readiness.
- Human officers retain every approval, waiver, inquiry, or escalation decision. Rules and risk signals never auto-approve or auto-reject.
- Risk indicators are non-accusatory and must present plausible benign explanations.
- The prototype is synthetic and is not connected to NSP, JharSewa, DigiLocker, PFMS, or NPCI. Integration states must be labeled honestly as live, mocked, or simulated. The Open IFSC lookup and selected public data are live; several government adapters and OCR overlays are simulated or mocked.
- No plain-text Aadhaar number is stored or exposed.
- The implementation is an existing React and Vite single-page prototype; redesign work should preserve its demonstrated workflows and not add replacement NSP infrastructure.

## Evidence on Hand

- Product behavior and personas: `docs/01_PRODUCT_REQUIREMENTS_DOCUMENT_(PRD).md`.
- Prototype scope and NSP overlay rationale: `docs/02_WHY_A_PROTOTYPE_NOT_A_FULL_APP.md`.
- Algorithms, integration boundaries, and API contracts: `docs/04_SYSTEM_ARCHITECTURE_&_DPI_INTEGRATION.md`.
- Seeded synthetic cases and interface implementation: `src/data/seededCases.js` and `src/components/`.
- The project contains no production NSP connection or verified deployment evidence; do not present the prototype's integrations or outcome metrics as deployed results.

## Product Principles

1. Keep decisions with authorized human officers.
2. Explain every rule result with its evidence and reason.
3. Show students who holds the file, why, and by when.
4. Treat statistical anomalies as prompts for fair review, never as accusations.
5. Make prototype, mock, simulated, and live data boundaries clear.

## Accessibility & Inclusion

The experience must support bilingual English and Hindi guidance, speech assistance for applicants with limited literacy, visible and actionable deficiency instructions, keyboard access, and use on low-bandwidth mobile connections.
