# System Architecture & Digital Public Infrastructure (DPI) Integration

**Project:** Udaan (उड़ान) — Decision-Support Layer for Scheduled Tribe Scholarships  
**Smart India Hackathon 2026 | PS SIH26239 | Ministry of Tribal Affairs (MoTA)**  
**Document Type:** Technical Blueprint, Algorithmic Specifications & API Contract  

---

## 1. High-Level Architectural Topology

Udaan is architecturally structured as an **asynchronous decision-support layer** that interfaces between the **National Scholarship Portal (NSP)** and state/national trust anchors:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        NATIONAL SCHOLARSHIP PORTAL (NSP / NIC)                          │
│               Central Registry • Intake Gateway • Student Database                      │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ Read-Replica / Kafka / Webhook Push
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   UDAAN DPI LAYER                                       │
│                                                                                        │
│  ┌────────────────────────┐   ┌───────────────────────────┐   ┌─────────────────────┐  │
│  │  Client Canvas Kernel  │   │  Deterministic Engine     │   │  SLA Escalation     │  │
│  │  • Laplacian Variance  │   │  • Statutory Rules v1.4.2 │   │  • Desk Countdown   │  │
│  │  • Luminance / Contrast│   │  • Levenshtein Fuzzy Match│   │  • Collector Alert  │  │
│  │  • Pixel Resolution   │   │  • Bank Cluster Topology  │   │  • 4-Tier Pipeline  │  │
│  └───────────┬────────────┘   └─────────────┬─────────────┘   └──────────┬──────────┘  │
│              │                              │                            │             │
└──────────────┼──────────────────────────────┼────────────────────────────┼─────────────┘
               │                              │                            │
               ▼                              ▼                            ▼
┌────────────────────────────┐  ┌───────────────────────────┐  ┌─────────────────────────┐
│     CITIZEN INTERFACE      │  │     STATE TRUST ANCHORS   │  │  CENTRAL DISBURSEMENT   │
│ • Bilingual SMS / WhatsApp │  │ • JharSewa / e-District   │  │ • PFMS Gateway          │
│ • Web Speech Voice Synthes.│  │ • 32 ST Gazette Schedule  │  │ • NPCI Aadhaar Mapper   │
│ • 15-Day Cure Window Draft │  │ • AISHE College Directory │  │ • RBI IFSC Registry     │
└────────────────────────────┘  └───────────────────────────┘  └─────────────────────────┘
```

---

## 2. Mathematical & Algorithmic Foundation

### 2.1 Client-Side Laplacian Blur Detection (HTML5 Canvas 2D)
To eliminate blurry uploads caused by the 200 KB cap, Udaan analyzes the sharpness of image edges directly in the browser using the **discrete Laplacian convolution operator**:

$$\nabla^2 I(x, y) = \frac{\partial^2 I}{\partial x^2} + \frac{\partial^2 I}{\partial y^2}$$

Implemented using the standard $3 \times 3$ discrete convolution kernel:

$$K_{\text{Laplacian}} = \begin{bmatrix} 0 & 1 & 0 \\ 1 & -4 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$

**Algorithm:**
1. Image is loaded into an off-screen HTML5 Canvas downscaled to a max dimension of $1000\text{ px}$.
2. Convert each RGB pixel $(R, G, B)$ into grayscale luminance:
   $$Y = 0.299R + 0.587G + 0.114B$$
3. Convolve the image with kernel $K_{\text{Laplacian}}$.
4. Calculate the statistical variance of the Laplacian output across all interior pixels:
   $$\text{Variance} = \frac{1}{N} \sum_{i=1}^N (L_i - \mu_L)^2$$
5. **Threshold Criteria:**
   * $\text{Variance} \ge 85.0 \implies \text{ACCEPTABLE SHARPNESS}$
   * $\text{Variance} < 85.0 \implies \text{BLURRY PHOTO / RETAKE RECOMMENDED}$

### 2.2 Luminance & Exposure Quality Control
$$\mu_Y = \frac{1}{N} \sum_{i=1}^N Y_i, \quad \sigma_Y = \sqrt{\frac{1}{N} \sum_{i=1}^N (Y_i - \mu_Y)^2}$$
* **Overexposed Check:** $\mu_Y > 250$ AND $\sigma_Y < 15.0$ (indicates flash washout obscuring text).
* **Underexposed Check:** $\mu_Y < 40$ (indicates dark room photo).

### 2.3 Levenshtein Distance & Fuzzy Transliteration
Tribal surnames often undergo minor phonetic transliteration differences between English and Hindi documents (e.g., *Mangra* vs *Mangraa*).

$$\text{Similarity}(S_1, S_2) = 1 - \frac{\text{LevenshteinDistance}(S_1, S_2)}{\max(|S_1|, |S_2|)}$$
* $\text{Similarity} = 1.0 \implies \text{EXACT\_MATCH}$ (Fast Lane)
* $0.85 \le \text{Similarity} < 1.0 \implies \text{MINOR\_TYPO}$ (Discretionary waiver suggested)
* $\text{Similarity} < 0.85 \implies \text{DISCREPANCY}$ (Requires identity cure)

---

## 3. Deterministic Rule Engine Schema (`v1.4.2`)

The rule engine executes stateless, reproducible JSON rule definitions:

```json
{
  "ruleSetVersion": "1.4.2",
  "applicableScheme": "POST_MATRIC_ST_2026",
  "statutoryRules": [
    {
      "ruleId": "RULE-INC-01",
      "name": "Parental Annual Income Ceiling",
      "statutoryRef": "MoTA Post-Matric Guidelines Sec 4.2",
      "ceilingAmount": 250000,
      "operator": "LESS_THAN_OR_EQUAL",
      "field": "extractedData.income",
      "failureCode": "INCOME_EXCEEDS_CEILING"
    },
    {
      "ruleId": "RULE-ST-02",
      "name": "State Scheduled Tribe Schedule Verification",
      "statutoryRef": "Constitution (Scheduled Tribes) Order 1950 (Jharkhand Part XXI)",
      "stateCode": "JH",
      "registry": "OFFICIAL_32_ST_GAZETTE",
      "field": "extractedData.casteCommunity",
      "failureCode": "COMMUNITY_NOT_IN_ST_SCHEDULE"
    },
    {
      "ruleId": "RULE-VAL-03",
      "name": "Income Certificate Freshness Window",
      "statutoryRef": "Jharkhand Revenue Dept Circular No. 14/Rev/2023",
      "maxAgeMonths": 12,
      "referenceDateField": "extractedData.incomeCertIssueDate",
      "failureCode": "INCOME_CERT_EXPIRED"
    },
    {
      "ruleId": "RULE-BANK-05",
      "name": "Bank Account Multi-Applicant Clustering",
      "statutoryRef": "PFMS DBT Integrity Guardrail 2025",
      "maxClusterThreshold": 3,
      "failureCode": "HIGH_FAN_IN_BANK_CLUSTER"
    }
  ]
}
```

---

## 4. Digital Public Infrastructure (DPI) Integration Specifications

### 4.1 Integration with National Scholarship Portal (NSP)
* **Ingestion:** Udaan listens on an authorized webhook or Kafka topic: `nsp.application.submitted`.
* **Payload:** Contains applicant demographic data, uploaded certificate URIs, and masked identifier tokens.
* **Return Callback:** When the District Welfare Officer submits their determination:
  ```json
  POST /api/v2/nsp/officer-determination
  {
    "applicationId": "APP-JH-2026-00412",
    "officerId": "DWO-JH-RNC-04",
    "determination": "OFFICER_APPROVED",
    "actionTimestamp": "2026-09-29T10:14:02Z",
    "ruleVersion": "1.4.2",
    "waiversApplied": [],
    "auditRecordHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
  ```

### 4.2 State Revenue Registry (e-District / JharSewa)
* Reconciles certificate reference numbers (e.g., `JH/ST/2025/099182`) against the state revenue database.
* Confirms digital PKI signature validity, revenue circle of origin, and issuing authority credentials.

### 4.3 PFMS & NPCI Aadhaar Payment Bridge (APB) Seeding Check
* Queries the NPCI Direct Benefit Transfer (DBT) lookup endpoint.
* Verifies that the student's bank account is actively Aadhaar-seeded before institutional approval, eliminating payment bounces that delay funds by 6–12 months.

---

## 5. Tamper-Evident Chained Audit Hash Specification

To prevent post-hoc tampering by administrators or colluding officers, the audit ledger implements a **cryptographic hash chain**:

$$H_0 = \text{SHA256}("UDAAN\_GENESIS\_BLOCK\_SIH26239")$$

$$H_i = \text{SHA256}(H_{i-1} \parallel \text{Timestamp} \parallel \text{OfficerID} \parallel \text{ApplicationID} \parallel \text{ActionType} \parallel \text{DeterminationNote})$$

If an audit record is altered or deleted in the database, the hash chain breaks, triggering an automated alert during annual CAG and state audits.
