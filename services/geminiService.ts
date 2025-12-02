import { GoogleGenAI, Type, Chat } from "@google/genai";
import {
  ActionPlan,
  CryptoExperience,
  CryptoUrgency,
  BackupStorage,
  BackupSecurity,
} from "../types";

// --- API key handling ------------------------------------------------------

// Prefer Vite-style env var in browser builds.
// In dev you can set this in a .env file as: VITE_GEMINI_API_KEY=xxxx
const viteKey =
  (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

// Fallback to process.env.API_KEY only if it's been defined via Vite's `define`
// (in many browser builds this will just be "undefined" or empty).
const processKey = (process.env.API_KEY as string | undefined) || undefined;

const apiKey = viteKey || processKey;

// Flag we can use elsewhere in the app to show/hide AI features.
export const GEMINI_ENABLED = !!apiKey && apiKey !== "undefined";

let ai: GoogleGenAI | null = null;

if (GEMINI_ENABLED) {
  ai = new GoogleGenAI({ apiKey: apiKey! });
} else {
  console.warn(
    '[Self-Defi] Gemini API key missing – AI features are disabled in this build.'
  );
}

const MODEL_NAME = "gemini-2.5-flash";

// Schema definition reused for structure
const actionPlanSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    timeframe: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    notes: { type: Type.STRING },
  },
  required: ["title", "timeframe", "steps", "notes"],
};

function ensureAI() {
  if (!ai) {
    throw new Error(
      "Gemini is not configured for this build (no API key set)."
    );
  }
  return ai;
}

// ---------------------------------------------------------------------------

export const createChatSession = (
  context: "SECURE_CRYPTO" | "BACKUP_ACCOUNTS" | "AI_TRUST" | null
): Chat => {
  const aiClient = ensureAI();

  let systemContextInstructions = "";

  if (context === "SECURE_CRYPTO") {
    systemContextInstructions =
      "You are currently assisting the user on the 'Secure My Crypto' page. Focus strictly on cryptocurrency safety, self-custody, wallets, and seed phrases.";
  } else if (context === "BACKUP_ACCOUNTS") {
    systemContextInstructions =
      "You are currently assisting the user on the 'Backup My Accounts' page. Focus strictly on password managers, 2FA, and digital hygiene.";
  } else if (context === "AI_TRUST") {
    systemContextInstructions =
      "You are currently assisting the user on the 'AI Trust Snapshot' page. Focus strictly on AI data privacy, what to paste vs what to hide, and tool safety.";
  } else {
    systemContextInstructions =
      "You are currently on the Home page. You can help with general questions about crypto safety, backups, or AI privacy.";
  }

  return aiClient.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: `You are the "Self-Defi Security Guide" for the "Self Defi - 60 Second Starter" app.
      
      CONTEXT:
      ${systemContextInstructions}

      HARD RULES:
      1. NO financial, trading, investment, tax, or legal advice. Refuse respectfully.
      2. NEVER ask for or generate private keys, seed phrases, passwords, or personal data.
      3. If asked about off-topic things (cooking, sports, etc.), refuse: "I’m focused on security, backups, and AI trust..."
      4. Keep answers SHORT (2-5 sentences). Simple English. Actionable.
      5. Beginner-friendly tone. No hype.
      `,
    },
  });
};

export const generateCryptoPlan = async (
  experience: CryptoExperience,
  urgency: CryptoUrgency
): Promise<ActionPlan> => {
  const prompt = `
    Generate a crypto security action plan based on:
    - Experience Level: ${experience}
    - Urgency: ${urgency}
    
    Rules:
    1. Title must reflect experience and urgency.
    2. Timeframe must be a short phrase like "Do this in the next 24 hours".
    3. Steps must be exactly 3 clear, non-technical actions the user can take without connecting a wallet or revealing keys.
    4. Notes must be a short safety reminder about never sharing seed phrases, private keys, or passwords.
  `;

  return await callGemini(prompt);
};

export const generateBackupPlan = async (
  storage: BackupStorage,
  security: BackupSecurity
): Promise<ActionPlan> => {
  const prompt = `
    Generate a password/identity backup plan based on:
    - Current Storage: ${storage}
    - Preferred Approach: ${security}

    Rules:
    1. Focus on improving password manager usage or safe backup locations.
    2. Steps must be exactly 3 clear actions to reduce single points of failure.
    3. Timeframe should be realistic (e.g., "This weekend").
    4. Notes should be a safety reminder.
  `;

  return await callGemini(prompt);
};

export const generateAiTrustSnapshot = async (
  toolNameOrUrl: string
): Promise<ActionPlan> => {
  const prompt = `
    Generate an AI Trust Snapshot for the tool: "${toolNameOrUrl}".
    
    Rules:
    1. Title must be the tool name + " Trust Snapshot".
    2. Timeframe must be "Use these rules anytime you use this tool".
    3. Steps must be exactly 3 concrete "do / don't" style rules (e.g., what is safe to paste, what to avoid).
    4. Notes must include a disclaimer to review the tool's own privacy policy.
  `;

  return await callGemini(prompt);
};

export const generateStepExplainer = async (
  stepText: string,
  context: string
): Promise<string> => {
  const aiClient = ensureAI();

  // Map technical context keys to human-readable prompts
  let humanContext = context;
  if (context === "SECURE_CRYPTO") humanContext = "Secure My Crypto";
  if (context === "BACKUP_ACCOUNTS") humanContext = "Backup My Accounts";
  if (context === "AI_TRUST") humanContext = "AI Trust Snapshot";

  const prompt = `
    Context: ${humanContext}
    Step: "${stepText}"

    Explain this crypto / security / AI safety step in simple, non-technical language for a beginner. 
    Keep it under 200 words and include 2–3 very concrete sub-actions they can perform.
    Do not use markdown formatting like bold or headers, just plain text paragraphs.
    Never ask for or reference private keys, seed phrases, passwords, or personal data.
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return text.trim();
  } catch (error) {
    console.error("Gemini Explainer Error:", error);
    throw new Error("Could not generate explanation.");
  }
};

const callGemini = async (prompt: string): Promise<ActionPlan> => {
  const aiClient = ensureAI();

  try {
    const response = await aiClient.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: actionPlanSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as ActionPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate plan. Please try again.");
  }
};
