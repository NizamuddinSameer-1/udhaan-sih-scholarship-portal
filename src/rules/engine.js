/**
 * Deterministic Rule Evaluation Engine for Udaan
 * Evaluates versioned rules against form and extracted certificate data.
 * Pure logic, transparent evidence, zero black-box scoring.
 */

// Simple Levenshtein distance for fuzzy string matching
function getLevenshteinSimilarity(str1 = '', str2 = '') {
  const s1 = str1.trim().toLowerCase();
  const s2 = str2.trim().toLowerCase();
  if (s1 === s2) return 1.0;
  if (!s1.length || !s2.length) return 0.0;

  const track = Array(s2.length + 1).fill(null).map(() =>
    Array(s1.length + 1).fill(null));
  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - distance / maxLen;
}

export function evaluateApplication(applicant, rulesConfig) {
  const traces = [];
  const rules = rulesConfig.rules || [];

  // 1. RULE-INC-01: Parental Annual Income Ceiling
  const incRule = rules.find(r => r.id === 'RULE-INC-01');
  if (incRule) {
    const declaredIncome = Number(applicant.formData.income || 0);
    const extractedIncome = Number(applicant.extractedData.income || declaredIncome);
    const ceiling = incRule.threshold;

    const incomeMismatch = Math.abs(declaredIncome - extractedIncome) > 5000;
    const isExceeded = extractedIncome > ceiling;

    let status = 'PASS';
    let reason = `The sample income value ₹${extractedIncome.toLocaleString('en-IN')} is within the configured demo limit of ₹${ceiling.toLocaleString('en-IN')}.`;

    if (isExceeded) {
      status = 'INELIGIBLE';
      reason = `The sample income value ₹${extractedIncome.toLocaleString('en-IN')} is above the configured demo limit of ₹${ceiling.toLocaleString('en-IN')}. Check current scheme guidance before making a determination.`;
    } else if (incomeMismatch) {
      status = 'DISCREPANCY';
      reason = `Declared income (₹${declaredIncome.toLocaleString('en-IN')}) differs from certificate (₹${extractedIncome.toLocaleString('en-IN')}).`;
    }

    traces.push({
      ruleId: incRule.id,
      name: incRule.name,
      category: incRule.category,
      status,
      evidence: `Sample declared value: ₹${declaredIncome.toLocaleString('en-IN')} | Sample extracted value: ₹${extractedIncome.toLocaleString('en-IN')} | Configured demo limit: ₹${ceiling.toLocaleString('en-IN')}`,
      reason,
      statutoryRef: incRule.statutoryReference
    });
  }

  // 2. RULE-ST-02: State Scheduled Tribe Schedule Verification
  const stRule = rules.find(r => r.id === 'RULE-ST-02');
  if (stRule) {
    const extractedTribe = applicant.extractedData.casteCommunity || '';
    const validTribes = stRule.validTribesInJharkhand || [];
    
    // Check if tribe matches any in the State Gazette
    const isMatched = validTribes.some(t => t.toLowerCase() === extractedTribe.toLowerCase());

    let status = isMatched ? 'PASS' : 'FLAGGED';
    let reason = isMatched
      ? `Community "${extractedTribe}" appears in the bundled Jharkhand demo list. This is a consistency cue, not status verification.`
      : `Community "${extractedTribe}" is not in the bundled demo list. Compare the source document and confirm with an authoritative record.`;

    traces.push({
      ruleId: stRule.id,
      name: stRule.name,
      category: stRule.category,
      status,
      evidence: `Extracted Community: "${extractedTribe}" | Issuing State: ${applicant.formData.state || 'Jharkhand'}`,
      reason: `${reason} A human officer confirms status from authoritative records.`,
      statutoryRef: stRule.statutoryReference
    });
  }

  // 3. RULE-VAL-03: Income Certificate Freshness Window
  const valRule = rules.find(r => r.id === 'RULE-VAL-03');
  if (valRule) {
    const issueDateStr = applicant.extractedData.incomeCertIssueDate;
    const maxMonths = valRule.thresholdMonths || 12;
    
    let monthsElapsed = 6; // default
    if (issueDateStr) {
      const issueDate = new Date(issueDateStr);
      const now = new Date('2026-09-29'); // Deterministic current date
      monthsElapsed = Math.max(0, Math.floor((now - issueDate) / (1000 * 60 * 60 * 24 * 30.43)));
    }

    const isExpired = monthsElapsed > maxMonths;
    const status = isExpired ? 'DEFICIENT' : 'PASS';
    const reason = isExpired
      ? `The sample date is ${monthsElapsed} months old (issued ${issueDateStr}), outside the configured ${maxMonths}-month demo window.`
      : `The sample date is ${monthsElapsed} months old (issued ${issueDateStr}), within the configured ${maxMonths}-month demo window.`;

    traces.push({
      ruleId: valRule.id,
      name: valRule.name,
      category: valRule.category,
      status,
      evidence: `Issue Date: ${issueDateStr || 'N/A'} | Age: ~${monthsElapsed} months | Allowed: ${maxMonths} months`,
      reason,
      statutoryRef: valRule.statutoryReference
    });
  }

  // 4. RULE-ID-04: Applicant Identity Fuzzy Consistency
  const idRule = rules.find(r => r.id === 'RULE-ID-04');
  if (idRule) {
    const formName = applicant.formData.studentName || '';
    const certName = applicant.extractedData.certStudentName || formName;
    const similarity = getLevenshteinSimilarity(formName, certName);
    const threshold = idRule.threshold || 0.85;

    let status = 'PASS';
    let reason = `Sample name text matches with ${(similarity * 100).toFixed(0)}% string similarity. Compare the source document before recording a decision.`;

    if (similarity < 1.0 && similarity >= threshold) {
      status = 'MINOR_TYPO';
      reason = `Minor character discrepancy detected ("${formName}" vs "${certName}"). Similarity ${(similarity * 100).toFixed(0)}% >= ${threshold * 100}%.`;
    } else if (similarity < threshold) {
      status = 'DISCREPANCY';
      reason = `Significant name mismatch ("${formName}" vs "${certName}"). Similarity ${(similarity * 100).toFixed(0)}% < ${threshold * 100}%.`;
    }

    traces.push({
      ruleId: idRule.id,
      name: idRule.name,
      category: idRule.category,
      status,
      evidence: `Form Name: "${formName}" | Certificate: "${certName}" | Levenshtein Match: ${(similarity * 100).toFixed(0)}%`,
      reason,
      statutoryRef: idRule.statutoryReference
    });
  }

  // 5. RULE-BANK-05: Bank Account Multi-Applicant Clustering
  const bankRule = rules.find(r => r.id === 'RULE-BANK-05');
  if (bankRule) {
    const sharedCount = applicant.fraudMetadata?.sharedBankCount || 1;
    const threshold = bankRule.threshold || 3;
    const isShared = sharedCount >= threshold;

    let status = isShared ? 'REVIEW_ALERT' : 'PASS';
    let reason = isShared
      ? `This account suffix appears in ${sharedCount} bundled sample files. Shared use is a review cue, not evidence of wrongdoing; confirm the context with applicants.`
      : `No shared-account cue appears in the bundled sample set.`;

    traces.push({
      ruleId: bankRule.id,
      name: bankRule.name,
      category: bankRule.category,
      status,
      evidence: `Sample account: ${applicant.formData.bankAccount || 'masked'} | Linked sample files: ${sharedCount}`,
      reason,
      statutoryRef: bankRule.statutoryReference
    });
  }

  // Determine Recommended Queue
  let recommendedQueue = 'FAST_LANE';
  if (traces.some(t => t.status === 'REVIEW_ALERT' || t.status === 'INELIGIBLE')) {
    recommendedQueue = 'REVIEW_LANE';
  } else if (traces.some(t => t.status === 'DEFICIENT' || t.status === 'MINOR_TYPO' || t.status === 'DISCREPANCY' || t.status === 'FLAGGED')) {
    recommendedQueue = 'STANDARD_LANE';
  }

  return {
    ruleTraces: traces,
    recommendedQueue,
    timestamp: new Date().toISOString(),
    ruleVersion: rulesConfig.version || 'v1.4.2'
  };
}
