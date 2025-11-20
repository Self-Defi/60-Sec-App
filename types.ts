export enum ViewState {
  Home = 'HOME',
  SecureCrypto = 'SECURE_CRYPTO',
  BackupAccounts = 'BACKUP_ACCOUNTS',
  AiTrust = 'AI_TRUST'
}

export interface ActionPlan {
  title: string;
  timeframe: string;
  steps: string[];
  notes: string;
}

// Crypto Page Types
export type CryptoExperience = 'Never' | 'WalletUser' | 'ColdStorage';
export type CryptoUrgency = 'Low' | 'Medium' | 'High';

// Backup Page Types
export type BackupStorage = 'Browser' | 'Notes' | 'Manager' | 'Unsure';
export type BackupSecurity = 'Simple' | 'Balanced' | 'Max';
