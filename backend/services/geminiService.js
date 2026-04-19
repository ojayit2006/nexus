/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  NEXUS — Gemini AI Verification Service
 *
 *  Automated document analysis using Google Gemini 1.5 Flash.
 *  Checks if the uploaded document's Name and ID match the student's profile.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Converts local file to a GoogleGenerativeAI.Part object.
 * Supports PDF and Images.
 */
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType
    },
  };
}

/**
 * Analyzes a document and compares it with expected student data.
 * @param {string} filePath - Path to the uploaded file
 * @param {string} studentName - Expected name of the student
 * @param {string} rollNo - Expected roll number/ID
 * @returns {Promise<Object>} - Verification results
 */
async function analyzeDocument(filePath, studentName, rollNo) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing in .env');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    const prompt = `
      You are an automated document verification system for a university clearance portal.
      Analyze the attached document and extract the following information:
      1. Full Name of the student.
      2. Roll Number or Student ID.

      Compare the extracted data with the following expected values:
      Expected Name: "${studentName}"
      Expected Roll Number/ID: "${rollNo}"

      Criteria for a match:
      - The name should be substantially similar (ignore minor case differences or middle name omissions).
      - The Roll Number/ID must be an exact match if present.

      Return your findings STRICTLY as a JSON object with this structure:
      {
        "match": boolean,
        "extracted_name": "string",
        "extracted_id": "string",
        "name_match": boolean,
        "id_match": boolean,
        "confidence": number (0 to 1),
        "reason": "Short summary of verification results"
      }
    `;

    const filePart = fileToGenerativePart(filePath, mimeType);
    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    // Sometimes Gemini wraps JSON in markdown blocks
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(jsonStr);

    return {
      success: true,
      analysis
    };
  } catch (err) {
    console.error('[GeminiService] Error:', err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = {
  analyzeDocument
};
