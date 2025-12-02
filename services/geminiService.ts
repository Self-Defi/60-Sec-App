// services/aiService.ts (or whatever this file is named)

// 🔒 Offline stub: no real Gemini calls in this build.
// This completely removes the API key requirement so the app can run on GitHub Pages.

import {
  ActionPlan,
  CryptoExperience,
  CryptoUrgency,
  BackupStorage,
  BackupSecurity,
} from "../types";

// Fake Chat type so the rest of the app can compile.
export type Chat = {
  send: (message: string) => Promise<{ text: string }>;
};

export const GEMINI_ENABLED = false;

// Simple stub that just echoes back a generic helper response.
export const createChatSession = (
  context: "SECURE_CRYPTO" | "BACKUP_ACCOUNTS" | "AI_TRUST" | null
): Chat => {
  return {
    async send(message: string) {
      const scope =
        context === "SECURE_CRYPTO"
          ? "crypto safety"
          : context === "BACKUP_ACCOUNTS"
          ? "password backups"
          : context === "AI_TRUST"
          ? "AI tool privacy"
          : "security basics";

      return {
        text:
          `This demo build runs without a live AI backend.\n\n` +
          `You asked about: "${message}". Here’s a safe next step in the area of ${scope}:\n` +
          `• Pick one small action from the page (like enabling 2FA or writing down a recovery phrase) and complete it today.\n` +
          `• Avoid sharing private keys, seed phrases, or passwords with *any* website or app.`,
      };
    },
  };
};

// --- Static plan generators (no network calls) -----------------------------

export const generateCryptoPlan = async (
  experience: CryptoExperience,
  urgency: CryptoUrgency
): Promise<ActionPlan> => {
  return {
    title: `Starter crypto safety plan (${experience.toLowerCase()}, ${urgency.toLowerCase()})`,
    timeframe:
      urgency === "IMMEDIATELY"
        ? "Do this in the next 24 hours"
        : urgency === "SOON"
        ? "Do this this week"
        : "Work through this over the next month",
    steps: [
      "Write down your main wallet’s recovery phrase on paper and store it somewhere only you can access (never in photos or cloud notes).",
      "Turn on 2FA for the exchanges or apps you still use and remove any you no longer need.",
      "List where your crypto is held today (exchanges, wallets) and mark which funds you eventually want in cold storage.",
    ],
    notes:
      "Never share your recovery phrase or private keys with anyone. Any site or person asking for them is a scam.",
  };
};

export const generateBackupPlan = async (
  storage: BackupStorage,
  security: BackupSecurity
): Promise<ActionPlan> => {
  return {
    title: `Password & identity backup tune-up (${security.toLowerCase()})`,
    timeframe: "Set aside 30–60 minutes this week",
    steps: [
      "Pick one password manager and move your most important logins (email, bank, crypto, work) into it first.",
      "Create at least one offline backup method (printed codes in a sealed envelope or a secure notebook in a safe place).",
      "Review accounts with weak or reused passwords and upgrade 3 of them to strong, unique passwords.",
    ],
    notes:
      "Avoid keeping everything in a single place (like only browser auto-save). A password manager plus one offline backup is much safer.",
  };
};

export const generateAiTrustSnapshot = async (
  toolNameOrUrl: string
): Promise<ActionPlan> => {
  const label = toolNameOrUrl || "this AI tool";

  return {
    title: `${label} – Trust Snapshot`,
    timeframe: "Use these rules anytime you use this tool",
    steps: [
      `Only paste information that you’d be comfortable sharing in a work email. Keep IDs, full addresses, and financial details out of prompts.`,
      `Never paste recovery phrases, private keys, passwords, or full payment card numbers into ${label}.`,
      `Check where this tool stores data (privacy policy) and avoid connecting it directly to any accounts that hold money or sensitive records unless you fully understand the risk.`,
    ],
    notes:
      "This is a generic safety snapshot. Always review the tool’s own privacy policy and terms for specifics.",
  };
};

export const generateStepExplainer = async (
  stepText: string,
  context: string
): Promise<string> => {
  const humanContext =
    context === "SECURE_CRYPTO"
      ? "Secure My Crypto"
      : context === "BACKUP_ACCOUNTS"
      ? "Backup My Accounts"
      : context === "AI_TRUST"
      ? "AI Trust Snapshot"
      : "security basics";

  return (
    `Context: ${humanContext}.\n\n` +
    `Step: "${stepText}".\n\n` +
    `In plain terms, this means: take one small, concrete action that makes it harder to lose access or get hacked. ` +
    `For example, you might write down a recovery phrase on paper instead of leaving it in photos, add 2FA to a key account, ` +
    `or move a risky password out of a notes app into a password manager. Avoid sharing any recovery phrases, private keys, or passwords with anyone.`
  );
};

