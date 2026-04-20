/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  NEXUS — Gemini Verification Test
 *
 *  Mocks a student profile and tests the Gemini AI verification logic against
 *  a real file.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

require('dotenv').config({ path: './backend/.env' });
const gemini = require('./services/geminiService');
const path = require('path');
const fs = require('fs');

async function runTest() {
  const testFile = '1776551862995-834521322.pdf';
  const filePath = path.join(__dirname, 'uploads', 'documents', testFile);

  if (!fs.existsSync(filePath)) {
    console.error('Test file not found at:', filePath);
    process.exit(1);
  }

  console.log('--- Testing Gemini AI Verification ---');
  console.log('File:', testFile);

  // Test Case 1: Mismatched Name
  console.log('\n[TEST 1] Testing Mismatched Name (Expect rejection)...');
  const result1 = await gemini.analyzeDocument(filePath, 'Wrong Person Name', 'ROLL-000');
  console.log('Result:', JSON.stringify(result1, null, 2));

  // Test Case 2: Correct Info (We check if it can extract)
  // In a real test, you'd provide the actual name inside that PDF.
  // Since I don't know the name in the PDF, I'll just see what Gemini extracts.
  console.log('\n[TEST 2] Testing extraction (See what is inside)...');
  const result2 = await gemini.analyzeDocument(filePath, 'Any Student', 'ANY-ID');
  console.log('Extracted Info:', result2.analysis?.extracted_name, '/', result2.analysis?.extracted_id);
  console.log('Reason:', result2.analysis?.reason);
}

runTest().catch(err => console.error('Test Failed:', err));
