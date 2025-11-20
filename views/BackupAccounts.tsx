
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SelectionButton } from '../components/SelectionButton';
import { PrimaryButton } from '../components/Button';
import { ActionCardDisplay } from '../components/ActionCardDisplay';
import { generateBackupPlan } from '../services/geminiService';
import { BackupStorage, BackupSecurity, ActionPlan } from '../types';

interface BackupAccountsProps {
  onBack: () => void;
}

export const BackupAccounts: React.FC<BackupAccountsProps> = ({ onBack }) => {
  const [storage, setStorage] = useState<BackupStorage | null>(null);
  const [security, setSecurity] = useState<BackupSecurity | null>(null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ActionPlan | null>(null);

  const handleGenerate = async () => {
    if (!storage || !security) return;
    
    setLoading(true);
    try {
      const result = await generateBackupPlan(storage, security);
      setPlan(result);
    } catch (error) {
      console.error(error);
      alert('Could not generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full hover:bg-gray-800 transition-colors text-textSecondary hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <h1 className="text-lg md:text-xl font-bold text-right">Backup My Accounts</h1>
      </div>

      {!plan ? (
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Identity Safety Boost</h2>
            <p className="text-textSecondary max-w-xl mx-auto">
              Improve how you store passwords and sensitive logins. No accounts are connected and nothing is stored.
            </p>
          </div>

          {/* Q1 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-brandOrange uppercase tracking-wider">
              1. How do you currently store most of your passwords?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectionButton 
                title="Browser auto-save"
                selected={storage === 'Browser'}
                onClick={() => setStorage('Browser')}
              />
              <SelectionButton 
                title="Notes app / notebook"
                selected={storage === 'Notes'}
                onClick={() => setStorage('Notes')}
              />
              <SelectionButton 
                title="Password manager"
                selected={storage === 'Manager'}
                onClick={() => setStorage('Manager')}
              />
              <SelectionButton 
                title="I’m not sure"
                selected={storage === 'Unsure'}
                onClick={() => setStorage('Unsure')}
              />
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-brandOrange uppercase tracking-wider mb-1">
              2. What’s your preferred security approach?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SelectionButton 
                title="Keep it simple"
                selected={security === 'Simple'}
                onClick={() => setSecurity('Simple')}
              />
              <SelectionButton 
                title="Balanced"
                selected={security === 'Balanced'}
                onClick={() => setSecurity('Balanced')}
              />
              <SelectionButton 
                title="Maximum security"
                selected={security === 'Max'}
                onClick={() => setSecurity('Max')}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            <PrimaryButton 
              onClick={handleGenerate} 
              disabled={!storage || !security}
              isLoading={loading}
              className="w-full md:w-auto min-w-[240px]"
            >
              Generate My Backup Plan
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div>
          <ActionCardDisplay plan={plan} context="Backup My Accounts" />
           <div className="mt-8 text-center">
             <button onClick={() => setPlan(null)} className="text-sm text-textSecondary hover:text-white underline">
               Start Over
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
