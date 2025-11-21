export function getProTips(
  userText: string,
  context: "SECURE_CRYPTO" | "BACKUP_ACCOUNTS" | "AI_TRUST" | null
): string[] {
  const tips: string[] = [];
  const text = userText.toLowerCase();

  // 1. Seed/Recovery
  if (/seed|recovery|mnemonic|secret phrase/.test(text)) {
    tips.push("Never type your seed phrase online. Store it offline in two safe places.");
  }

  // 2. Exchange/Custodial
  if (/exchange|coinbase|binance|kraken|custodial/.test(text)) {
    tips.push("If you don’t control keys, it's not your crypto. Exchanges are for buying/selling, not storage.");
  }

  // 3. Phishing
  if (/phishing|scam|fake|link|dm|airdrop/.test(text)) {
    tips.push("Never click wallet links from DMs. Always type the URL yourself or use bookmarks.");
  }

  // 4. 2FA
  if (/2fa|authenticator|sms|factor/.test(text)) {
    tips.push("Prefer an authenticator app (like Google Auth or YubiKey) over SMS 2FA.");
  }

  // 5. Hardware Wallet
  if (/hardware|cold|trezor|ledger|coldcard/.test(text)) {
    tips.push("Do a small test send first… confirm on-device.");
  }

  // 6. Password Managers
  if (/password manager|lastpass|1password|bitwarden|keeper/.test(text)) {
    tips.push("One strong master password, backed up offline, never reused.");
  }

  // 7. AI Tools
  if (/ai tool|privacy|data|chatgpt|gemini|claude|copilot/.test(text)) {
    tips.push("Don’t paste IDs, passwords, seed phrases, private keys, or unreleased strategies.");
  }

  // De-dupe
  return Array.from(new Set(tips));
}