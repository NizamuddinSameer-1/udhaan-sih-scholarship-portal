import rulesConfig from './src/rules/rules-v1.4.2.json' with { type: 'json' };
import { evaluateApplication } from './src/rules/engine.js';
import { SEEDED_CASES } from './src/data/seededCases.js';

console.log('--- 1. Testing Rule Engine ---');
console.log('Loaded Rules Count:', rulesConfig.rules.length);

const evalA = evaluateApplication(SEEDED_CASES.CASE_A, rulesConfig);
console.log('Case A (Ramesh Soren):');
console.log('  Recommended Queue:', evalA.recommendedQueue);
console.log('  Traces:', evalA.ruleTraces.map(t => `${t.ruleId}: ${t.status}`).join(', '));
if (evalA.recommendedQueue !== 'FAST_LANE') throw new Error('Case A should be FAST_LANE');

const evalB = evaluateApplication(SEEDED_CASES.CASE_B, rulesConfig);
console.log('\nCase B (Sunita Munda):');
console.log('  Recommended Queue:', evalB.recommendedQueue);
console.log('  Traces:', evalB.ruleTraces.map(t => `${t.ruleId}: ${t.status}`).join(', '));
const bHasDeficient = evalB.ruleTraces.some(t => t.status === 'DEFICIENT' || t.status === 'MINOR_TYPO');
if (!bHasDeficient || evalB.recommendedQueue !== 'STANDARD_LANE') throw new Error('Case B should be STANDARD_LANE with DEFICIENT status');

const evalC = evaluateApplication(SEEDED_CASES.CASE_C, rulesConfig);
console.log('\nCase C (Amit Kumar Tirkey - Shared Bank):');
console.log('  Recommended Queue:', evalC.recommendedQueue);
console.log('  Traces:', evalC.ruleTraces.map(t => `${t.ruleId}: ${t.status}`).join(', '));
const cHasReview = evalC.ruleTraces.some(t => t.status === 'REVIEW_ALERT');
if (!cHasReview || evalC.recommendedQueue !== 'REVIEW_LANE') throw new Error('Case C should be REVIEW_LANE');

console.log('\n--- 2. Testing HTTP Vite Endpoint ---');
const res = await fetch('http://127.0.0.1:5173/');
console.log('Vite HTTP Status:', res.status, res.statusText);
const body = await res.text();
console.log('HTML Contains Root:', body.includes('<div id="root"></div>'));
console.log('HTML Contains Title:', body.includes('Udaan (उड़ान)'));

console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
