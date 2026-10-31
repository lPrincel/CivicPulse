const { GoogleGenAI } = require('@google/genai');

const VALID_CATEGORIES = ['Roads', 'Sanitation', 'Electricity', 'Water', 'Safety'];
const VALID_URGENCIES = ['Low', 'Medium', 'High', 'Emergency'];

/**
 * Intelligent fallback classifier in case AI API key is missing or network rate limits hit.
 * Ensures your hackathon demo NEVER crashes!
 */
const fallbackTriage = (description = '', location = '') => {
  const text = `${description} ${location}`.toLowerCase();

  // Urgency detection
  let urgency = 'Medium';
  if (/emergency|fire|explosion|sparking|danger|collapse|electrocution|gas leak|flooding/i.test(text)) {
    urgency = 'Emergency';
  } else if (/urgent|blocked|hazard|major|overflow|deep hole|power outage/i.test(text)) {
    urgency = 'High';
  } else if (/minor|small|slow|flickering|cosmetic|light trash/i.test(text)) {
    urgency = 'Low';
  }

  // Category detection
  let category = 'Safety';
  if (/pothole|road|asphalt|sidewalk|traffic light|speed breaker|manhole/i.test(text)) {
    category = 'Roads';
  } else if (/garbage|trash|dump|sanitation|waste|sewage|smell|dead animal/i.test(text)) {
    category = 'Sanitation';
  } else if (/wire|electric|spark|transformer|power|blackout|street light|light/i.test(text)) {
    category = 'Electricity';
  } else if (/water|leak|pipe|drain|flooding|tap|meter|supply/i.test(text)) {
    category = 'Water';
  }

  // Title generation
  const words = description.trim().split(/\s+/).slice(0, 6).join(' ');
  const title = words.length > 0 ? `${words}...` : `Civic issue at ${location || 'local site'}`;

  const aiSummary = `Automated triage: ${urgency} priority issue classified under ${category}. Recommended dispatch for immediate field inspection at ${location || 'site'}.`;

  return { title, category, urgency, aiSummary };
};

/**
 * Triage civic issue using Gemini AI API with automatic graceful fallback
 */
const triageIssue = async (description, location = '') => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[AI Service] GEMINI_API_KEY not configured in .env. Using intelligent rule-based triage.');
    return fallbackTriage(description, location);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an emergency civic triage engine for a smart municipal response system.
Analyze the citizen issue report below:

Issue Description: "${description}"
Location: "${location || 'Unspecified location'}"

Return ONLY a valid JSON object matching this schema:
{
  "title": "A short, professional 4-8 word title summarizing the exact hazard or problem",
  "category": "Must be exactly one of: Roads, Sanitation, Electricity, Water, Safety",
  "urgency": "Must be exactly one of: Low, Medium, High, Emergency",
  "aiSummary": "A concise 1-2 sentence executive briefing for municipal dispatchers describing the hazard severity and recommended immediate action."
}

Do not include markdown ticks, code fences, or any other text. Output strictly raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const rawText = response.text || '';
    
    // Clean potential code fences (```json ... ```)
    const cleaned = rawText
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validate enum values to protect DB integrity
    const category = VALID_CATEGORIES.includes(parsed.category) ? parsed.category : 'Safety';
    const urgency = VALID_URGENCIES.includes(parsed.urgency) ? parsed.urgency : 'Medium';
    const title = parsed.title || 'Reported Civic Issue';
    const aiSummary = parsed.aiSummary || 'Triage completed by CivicPulse AI engine.';

    return { title, category, urgency, aiSummary };
  } catch (error) {
    console.error(`[AI Service Error] ${error.message}. Falling back gracefully.`);
    return fallbackTriage(description, location);
  }
};

module.exports = {
  triageIssue,
  fallbackTriage,
  VALID_CATEGORIES,
  VALID_URGENCIES
};

