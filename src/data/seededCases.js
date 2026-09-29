/**
 * Seeded Demo Cases for Udaan Prototype (SIH26239)
 * All data is strictly synthetic and anonymized.
 * No real Aadhaar numbers or personal PII.
 */

export const SEEDED_CASES = {
  CASE_A: {
    id: "APP-JH-2026-00412",
    caseLabel: "Case A: Clean File (Fast Lane)",
    lane: "FAST_LANE",
    studentName: "Ramesh Soren",
    category: "Scheduled Tribe (ST)",
    state: "Jharkhand",
    district: "Dumka",
    districtLgdCode: 335,
    institute: "Sido Kanhu Murmu University, Dumka",
    aisheCode: "U-0210",
    course: "B.Sc. Mathematics (Year 2)",
    scheme: "Post-Matric Scholarship for ST Students",
    parentName: "Sohan Soren",
    dob: "2005-04-12",
    gender: "Male",
    maskedAadhaar: "XXXX-XXXX-6192",
    bankDetails: {
      accountNumber: "XXXX-XXXX-6192",
      ifsc: "SBIN0000073",
      bankName: "State Bank of India",
      branchName: "Court Compound Branch, Dumka (PIN: 814101)",
      npciSeeded: true,
      dbtActive: true,
      seedingDate: "2024-08-11"
    },
    formData: {
      studentName: "Ramesh Soren",
      parentName: "Sohan Soren",
      income: 180000,
      state: "Jharkhand",
      district: "Dumka",
      bankAccount: "XXXX-XXXX-6192",
      ifsc: "SBIN0000073",
      scheme: "Post-Matric Scholarship for ST Students"
    },
    extractedData: {
      certStudentName: "Ramesh Soren",
      certParentName: "Sohan Soren",
      casteCommunity: "Santhal",
      casteCertNo: "JH/ST/2025/089421",
      casteCertIssueDate: "2025-01-15",
      casteIssuingAuthority: "Sub-Divisional Officer (SDO), Dumka",
      income: 180000,
      incomeCertNo: "JH/INC/2026/021948",
      incomeCertIssueDate: "2026-02-20",
      incomeIssuingAuthority: "Circle Officer, Dumka Sadar",
      qrCodeVerified: true
    },
    fraudMetadata: {
      sharedBankCount: 1,
      sharedPhoneCount: 1,
      ipClusterCount: 1,
      isSyndicateFlagged: false,
      riskScore: 0.04
    },
    currentDesk: {
      deskName: "Institutional Nodal Officer (INO)",
      officerTitle: "Nodal Officer, SKM University",
      assignedDate: "2026-09-27",
      slaDaysAllowed: 5,
      daysElapsed: 2,
      dueDate: "2026-10-02",
      statusText: "Configured sample checks are within the shown rules · officer review pending"
    },
    documents: {
      casteCertUrl: "/certificates/caste_cert_ramesh_soren.png",
      incomeCertUrl: "/certificates/income_cert_ramesh_soren.png",
      casteCertNo: "JH/ST/2025/089421",
      incomeCertNo: "JH/INC/2026/021948",
      casteTitle: "Jharkhand Scheduled Tribe Certificate",
      incomeTitle: "Annual Income Assessment Certificate",
      jharSewaRef: "JH-EDIST-2025-089421",
      digitalSignatory: "Sub-Divisional Officer, Dumka",
      signDate: "2025-01-15T11:42:00Z"
    },
    simulatedBoundingBoxes: {
      caste: [
        { id: "c4", label: "Certificate No", text: "JH/ST/2025/089421", x: 5.6, y: 21.2, w: 34, h: 2.2, conf: 0.99 },
        { id: "c6", label: "Issue Date", text: "15-01-2025", x: 64, y: 21.2, w: 29, h: 2.2, conf: 0.99 },
        { id: "c1", label: "Student Name", text: "Ramesh Soren", x: 19, y: 30.5, w: 18, h: 2.2, conf: 0.99 },
        { id: "c2", label: "Parent Name", text: "Sohan Soren", x: 53, y: 30.5, w: 18, h: 2.2, conf: 0.98 },
        { id: "c3", label: "Community", text: "Santhal (ST)", x: 26, y: 35.8, w: 20, h: 2.4, conf: 0.99 },
        { id: "c7", label: "Official Seal", text: "SDO Dumka Stamp", x: 11, y: 67, w: 17, h: 11, conf: 0.97 },
        { id: "c5", label: "Signature area", text: "Mark shown in sample only", x: 51.5, y: 68.2, w: 43, h: 6.8, conf: 0.98 }
      ],
      income: [
        { id: "i4_no", label: "Certificate No", text: "JH/INC/2026/021948", x: 5.6, y: 21.2, w: 34, h: 2.2, conf: 0.99 },
        { id: "i3", label: "Issue Date", text: "20-02-2026", x: 64, y: 21.2, w: 29, h: 2.2, conf: 0.98 },
        { id: "i2", label: "Applicant Name", text: "Ramesh Soren", x: 23, y: 31.0, w: 20, h: 2.2, conf: 0.98 },
        { id: "i1", label: "Assessed Gross Income", text: "₹ 1,80,000/-", x: 58, y: 43.6, w: 32, h: 3.2, conf: 0.99 },
        { id: "i5", label: "Revenue Stamp", text: "Circle Officer Dumka", x: 11, y: 67, w: 17, h: 11, conf: 0.96 },
        { id: "i6", label: "Signature area", text: "Mark shown in sample only", x: 51.5, y: 68.2, w: 43, h: 6.8, conf: 0.98 }
      ]
    }
  },

  CASE_B: {
    id: "APP-JH-2026-00789",
    caseLabel: "Case B: Minor Deficiency (Standard Lane)",
    lane: "STANDARD_LANE",
    studentName: "Sunita Munda",
    category: "Scheduled Tribe (ST)",
    state: "Jharkhand",
    district: "Khunti",
    districtLgdCode: 353,
    institute: "Birsa College, Khunti",
    aisheCode: "C-43891",
    course: "B.A. Political Science (Year 1)",
    scheme: "Post-Matric Scholarship for ST Students",
    parentName: "Mangra Munda",
    dob: "2006-09-18",
    gender: "Female",
    maskedAadhaar: "XXXX-XXXX-3829",
    bankDetails: {
      accountNumber: "XXXX-XXXX-3829",
      ifsc: "BKID0004915",
      bankName: "Bank of India",
      branchName: "Main Road Khunti Branch (PIN: 835210)",
      npciSeeded: true,
      dbtActive: true,
      seedingDate: "2025-01-20"
    },
    formData: {
      studentName: "Sunita Munda",
      parentName: "Mangra Munda",
      income: 140000,
      state: "Jharkhand",
      district: "Khunti",
      bankAccount: "XXXX-XXXX-3829",
      ifsc: "BKID0004915",
      scheme: "Post-Matric Scholarship for ST Students"
    },
    extractedData: {
      certStudentName: "Sunita Munda",
      certParentName: "Mangraa Munda", // Typo in extracted certificate
      casteCommunity: "Munda",
      casteCertNo: "JH/ST/2024/033109",
      casteCertIssueDate: "2024-05-10",
      casteIssuingAuthority: "Sub-Divisional Officer, Khunti",
      income: 140000,
      incomeCertNo: "JH/INC/2025/001290",
      incomeCertIssueDate: "2025-03-10", // 18+ months old -> Expired in Jharkhand (limit 12 months)
      incomeIssuingAuthority: "Circle Officer, Torpa",
      qrCodeVerified: true
    },
    fraudMetadata: {
      sharedBankCount: 1,
      sharedPhoneCount: 1,
      ipClusterCount: 1,
      isSyndicateFlagged: false,
      riskScore: 0.18
    },
    currentDesk: {
      deskName: "District Nodal Officer (DNO)",
      officerTitle: "District Welfare Officer, Khunti",
      assignedDate: "2026-09-22",
      slaDaysAllowed: 7,
      daysElapsed: 4,
      dueDate: "2026-09-29",
      statusText: "Waiting on Income Certificate Re-upload & Name Clarification"
    },
    documents: {
      casteCertUrl: "/certificates/caste_cert_sunita_munda.png",
      incomeCertUrl: "/certificates/income_cert_sunita_munda.png",
      casteCertNo: "JH/ST/2024/033109",
      incomeCertNo: "JH/INC/2025/001290",
      casteTitle: "Jharkhand Scheduled Tribe Certificate",
      incomeTitle: "Annual Income Assessment Certificate (EXPIRED > 12M)",
      jharSewaRef: "JH-EDIST-2024-033109",
      digitalSignatory: "Sub-Divisional Officer, Khunti",
      signDate: "2024-05-10T14:15:00Z"
    },
    simulatedBoundingBoxes: {
      caste: [
        { id: "c4", label: "Certificate No", text: "JH/ST/2024/033109", x: 5.6, y: 21.2, w: 34, h: 2.2, conf: 0.99 },
        { id: "c6", label: "Issue Date", text: "10-05-2024", x: 64, y: 21.2, w: 29, h: 2.2, conf: 0.99 },
        { id: "c1", label: "Student Name", text: "Sunita Munda", x: 19, y: 30.5, w: 18, h: 2.2, conf: 0.99 },
        { id: "c2", label: "Parent Name (Discrepancy)", text: "Mangraa Munda", x: 53, y: 30.5, w: 22, h: 2.2, conf: 0.94, alert: true },
        { id: "c3", label: "Community", text: "Munda (ST)", x: 26, y: 35.8, w: 18, h: 2.4, conf: 0.99 },
        { id: "c7", label: "Official Seal", text: "SDO Khunti Stamp", x: 11, y: 67, w: 17, h: 11, conf: 0.97 },
        { id: "c5", label: "Signature area", text: "Mark shown in sample only", x: 51.5, y: 68.2, w: 43, h: 6.8, conf: 0.98 }
      ],
      income: [
        { id: "i4_no", label: "Certificate No", text: "JH/INC/2025/001290", x: 5.6, y: 21.2, w: 34, h: 2.2, conf: 0.99 },
        { id: "i3", label: "Issue Date (EXPIRED)", text: "10-03-2025 (>12m)", x: 64, y: 21.2, w: 29, h: 2.2, conf: 0.98, alert: true },
        { id: "i2", label: "Applicant Name", text: "Sunita Munda", x: 23, y: 31.0, w: 20, h: 2.2, conf: 0.98 },
        { id: "i1", label: "Assessed Gross Income", text: "₹ 1,40,000/-", x: 58, y: 43.6, w: 32, h: 3.2, conf: 0.98 },
        { id: "i5", label: "Revenue Stamp", text: "Circle Officer Torpa", x: 11, y: 67, w: 17, h: 11, conf: 0.96 },
        { id: "i6", label: "Signature area", text: "Mark shown in sample only", x: 51.5, y: 68.2, w: 43, h: 6.8, conf: 0.98 }
      ]
    },
    deficiencyPacket: {
      packetId: "DEF-JH-2026-00789-A",
      document: "Income Certificate (आय प्रमाण पत्र)",
      pageNumber: "Page 1",
      field: "Issue Date & Freshness",
      currentValue: "10-03-2025 (Issued 18 months ago)",
      ruleReference: "RULE-VAL-03 (Validity ceiling: 12 months)",
      fixRequiredEn: "Please upload an Income Certificate issued within the past 12 months by a designated Revenue Authority (Circle Officer / Tehsildar) for FY 2026-27.",
      fixRequiredHi: "कृपया पिछले 12 महीनों के भीतर जारी किया गया नया आय प्रमाण पत्र (अंचल अधिकारी/तहसीलदार द्वारा वित्तीय वर्ष 2026-27 हेतु) पुनः अपलोड करें।",
      minorDiscrepancyNoteEn: "Note: In your Caste Certificate, father's name appears as 'Mangraa Munda' while application lists 'Mangra Munda'. A minor discrepancy self-declaration will be accepted.",
      minorDiscrepancyNoteHi: "नोट: जाति प्रमाण पत्र में पिता का नाम 'Mangraa Munda' दर्ज है जबकि फॉर्म में 'Mangra Munda' है। इसके लिए एक सामान्य शपथ पत्र स्वीकार्य होगा।",
      deadlineDays: 15,
      deadlineDate: "14 Oct 2026"
    }
  },

  CASE_C: {
    id: "APP-JH-2026-01554",
    caseLabel: "Case C: Shared Bank Account Cluster (Review Lane)",
    lane: "REVIEW_LANE",
    studentName: "Amit Kumar Tirkey",
    category: "Scheduled Tribe (ST)",
    state: "Jharkhand",
    district: "Ranchi",
    districtLgdCode: 340,
    institute: "Government Polytechnic, Ranchi",
    aisheCode: "C-43821",
    course: "Diploma in Electrical Engineering (Year 1)",
    scheme: "Post-Matric Scholarship for ST Students",
    parentName: "Sushil Tirkey",
    dob: "2006-11-04",
    gender: "Male",
    maskedAadhaar: "XXXX-XXXX-4821",
    bankDetails: {
      accountNumber: "XXXX-XXXX-4821",
      ifsc: "PUNB0760900",
      bankName: "Punjab National Bank",
      branchName: "Kanke Road Branch Near Rock Garden, Ranchi (PIN: 834008)",
      npciSeeded: false, // DBT Issue
      dbtActive: false,
      seedingDate: null,
      bounceReason: "Sample scenario marks NPCI mapping inactive. The shared account is a separate review cue, not evidence of misuse."
    },
    formData: {
      studentName: "Amit Kumar Tirkey",
      parentName: "Sushil Tirkey",
      income: 195000,
      state: "Jharkhand",
      district: "Ranchi",
      bankAccount: "XXXX-XXXX-4821",
      ifsc: "PUNB0760900",
      scheme: "Post-Matric Scholarship for ST Students"
    },
    extractedData: {
      certStudentName: "Amit Kumar Tirkey",
      certParentName: "Sushil Tirkey",
      casteCommunity: "Oraon",
      casteCertNo: "JH/ST/2025/099182",
      casteCertIssueDate: "2025-08-14",
      casteIssuingAuthority: "Sub-Divisional Officer, Ranchi Sadar",
      income: 195000,
      incomeCertNo: "JH/INC/2026/044812",
      incomeCertIssueDate: "2026-05-18",
      incomeIssuingAuthority: "Circle Officer, Kanke",
      qrCodeVerified: true
    },
    fraudMetadata: {
      sharedBankCount: 15, // 15 students sharing this exact bank account!
      sharedPhoneCount: 1,
      ipClusterCount: 12,
      isSyndicateFlagged: true,
      riskScore: 0.88,
      riskSignals: [
        {
          id: "SIG-01",
          name: "High Fan-in Bank Account",
          detail: "Account XXXX-4821 linked to 15 distinct ST applicant IDs submitted between 24-Sep and 27-Sep 2026 across 3 colleges in Ranchi district."
        },
        {
          id: "SIG-02",
          name: "NPCI DBT Inactive Status",
          detail: "Account is not seeded on NPCI National Mapper for Direct Benefit Transfer (DBT)."
        }
      ],
      legitimateHypotheses: [
        {
          id: "HYP-01",
          title: "Common Service Centre assistance",
          explanation: "Ask whether an operator helped enter the account details and confirm them with each applicant. Shared use alone does not indicate misuse."
        },
        {
          id: "HYP-02",
          title: "Guardian or institution account",
          explanation: "Check whether a guardian or institution account is being used and whether the arrangement is allowed for the scheme."
        },
        {
          id: "HYP-03",
          title: "Other account support arrangement",
          explanation: "If another person helps with banking, ask the students how the arrangement works and explain the official payment options without presuming wrongdoing."
        }
      ],
      clusterApplicants: [
        { name: "Amit Kumar Tirkey", appNo: "APP-JH-2026-01554", inst: "Ranchi College of Higher Studies" },
        { name: "Deepak Toppo", appNo: "APP-JH-2026-01555", inst: "Ranchi College of Higher Studies" },
        { name: "Suresh Minz", appNo: "APP-JH-2026-01556", inst: "Govt Polytechnic Ranchi" },
        { name: "Anjali Kujur", appNo: "APP-JH-2026-01557", inst: "Ranchi Women's College" },
        { name: "Kishore Bhagat", appNo: "APP-JH-2026-01558", inst: "Govt Polytechnic Ranchi" },
        { name: "Pooja Bakhla", appNo: "APP-JH-2026-01559", inst: "Birsa Institute of Tech" },
        { name: "Raju Kerketta", appNo: "APP-JH-2026-01560", inst: "Govt Polytechnic Ranchi" },
        { name: "Manoj Ekka", appNo: "APP-JH-2026-01561", inst: "Ranchi College of Higher Studies" },
        { name: "Rita Lakra", appNo: "APP-JH-2026-01562", inst: "Ranchi Women's College" },
        { name: "Prakash Dhanwar", appNo: "APP-JH-2026-01563", inst: "Govt Polytechnic Ranchi" },
        { name: "Sunil Linda", appNo: "APP-JH-2026-01564", inst: "Birsa Institute of Tech" },
        { name: "Meena Tirkey", appNo: "APP-JH-2026-01565", inst: "Ranchi Women's College" },
        { name: "Sunil Toppo", appNo: "APP-JH-2026-01566", inst: "Ranchi College of Higher Studies" },
        { name: "Santosh Munda", appNo: "APP-JH-2026-01567", inst: "Govt Polytechnic Ranchi" },
        { name: "Bablu Oraon", appNo: "APP-JH-2026-01568", inst: "Ranchi College of Higher Studies" }
      ]
    },
    currentDesk: {
      deskName: "District Welfare Officer (DNO)",
      officerTitle: "District Nodal Officer, Ranchi",
      assignedDate: "2026-09-28",
      slaDaysAllowed: 5,
      daysElapsed: 1,
      dueDate: "2026-10-03",
      statusText: "Shared-account cue · confirm the context with applicants"
    },
    documents: {
      casteCertUrl: "/certificates/caste_cert_amit_tirkey.png",
      incomeCertUrl: "/certificates/income_cert_amit_tirkey.png",
      casteCertNo: "JH/ST/2025/099182",
      incomeCertNo: "JH/INC/2026/044812",
      casteTitle: "Jharkhand Scheduled Tribe Certificate",
      incomeTitle: "Annual Income Assessment Certificate",
      jharSewaRef: "JH-EDIST-2025-099182",
      digitalSignatory: "Sub-Divisional Officer, Ranchi Sadar",
      signDate: "2025-08-14T16:30:00Z"
    },
    simulatedBoundingBoxes: {
      caste: [
        { id: "c4", label: "Certificate No", text: "JH/ST/2025/099182", x: 5.6, y: 21.2, w: 34, h: 2.2, conf: 0.99 },
        { id: "c6", label: "Issue Date", text: "14-08-2025", x: 64, y: 21.2, w: 29, h: 2.2, conf: 0.99 },
        { id: "c1", label: "Student Name", text: "Amit Kumar Tirkey", x: 19, y: 30.5, w: 20, h: 2.2, conf: 0.99 },
        { id: "c2", label: "Parent Name", text: "Sushil Tirkey", x: 55, y: 30.5, w: 18, h: 2.2, conf: 0.98 },
        { id: "c3", label: "Community", text: "Oraon (ST)", x: 26, y: 35.8, w: 18, h: 2.4, conf: 0.99 },
        { id: "c7", label: "Official Seal", text: "SDO Ranchi Stamp", x: 11, y: 67, w: 17, h: 11, conf: 0.97 },
        { id: "c5", label: "Signature area", text: "Mark shown in sample only", x: 51.5, y: 68.2, w: 43, h: 6.8, conf: 0.98 }
      ],
      income: [
        { id: "i4_no", label: "Certificate No", text: "JH/INC/2026/044812", x: 5.6, y: 21.2, w: 34, h: 2.2, conf: 0.99 },
        { id: "i3", label: "Issue Date", text: "18-05-2026", x: 64, y: 21.2, w: 29, h: 2.2, conf: 0.98 },
        { id: "i2", label: "Applicant Name", text: "Amit Kumar Tirkey", x: 23, y: 31.0, w: 22, h: 2.2, conf: 0.98 },
        { id: "i1", label: "Assessed Gross Income", text: "₹ 1,95,000/-", x: 58, y: 43.6, w: 32, h: 3.2, conf: 0.98 },
        { id: "i5", label: "Revenue Stamp", text: "Circle Officer Kanke", x: 11, y: 67, w: 17, h: 11, conf: 0.96 },
        { id: "i6", label: "Signature area", text: "Mark shown in sample only", x: 51.5, y: 68.2, w: 43, h: 6.8, conf: 0.98 }
      ]
    }
  }
};
