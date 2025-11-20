
import { GoogleGenAI, Type } from "@google/genai";
import { ActionPlan, CryptoExperience, CryptoUrgency, BackupStorage, BackupSecurity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// Schema definition reused for structure
const actionPlanSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    timeframe: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    notes: { type: Type.STRING }
  },
  required: ["title", "timeframe", "steps", "notes"]
};

export const generateCryptoPlan = async (experience: CryptoExperience, urgency: CryptoUrgency): Promise<ActionPlan> => {
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

export const generateBackupPlan = async (storage: BackupStorage, security: BackupSecurity): Promise<ActionPlan> => {
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

export const generateAiTrustSnapshot = async (toolNameOrUrl: string): Promise<ActionPlan> => {
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

export const generateStepExplanation = async (stepText: string, context: string): Promise<string> => {
  const prompt = `
    Context: ${context}
    Step: "${stepText}"

    Explain this crypto / security / AI safety step in simple, non-technical language for a beginner. 
    Keep it under 200 words and include 2–3 very concrete sub-actions they can perform.
    Do not use markdown formatting like bold or headers, just plain text paragraphs.
  `;

  try {
    const response = await ai.models.generateContent({
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
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: actionPlanSchema
      }
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
