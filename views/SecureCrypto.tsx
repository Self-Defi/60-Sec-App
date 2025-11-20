
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SelectionButton } from '../components/SelectionButton';
import { PrimaryButton } from '../components/Button';
import { ActionCardDisplay } from '../components/ActionCardDisplay';
import { generateCryptoPlan } from '../services/geminiService';
import { CryptoExperience, CryptoUrgency, ActionPlan } from '../types';

interface SecureCryptoProps {
  onBack: () => void;
}

export const SecureCrypto: React.FC<SecureCryptoProps> = ({ onBack }) => {
  const [experience, setExperience] = useState<CryptoExperience | null>(null);
  const [urgency, setUrgency] = useState<CryptoUrgency | null>(null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ActionPlan | null>(null);

  const handleGenerate = async () => {
    if (!experience || !urgency) return;
    
    setLoading(true);
    try {
      const result = await generateCryptoPlan(experience, urgency);
      setPlan(result);
    } catch (error) {
      console.error(error);
      alert('Could not generate plan. Please check your internet connection and try again.');
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
        <h1 className="text-lg md:text-xl font-bold text-right">Secure My Crypto</h1>
      </div>

      {!plan ? (
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">60-Second Plan</h2>
            <p className="text-textSecondary max-w-xl mx-auto">
              Answer two quick questions. We’ll generate a simple, non-technical action plan you can execute today.
              This app never connects to your wallet and never asks for keys or passwords.
            </p>
          </div>

          {/* Q1 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-brandOrange uppercase tracking-wider">
              1. What best describes your self-custody experience?
            </label>
            <div className="grid grid-cols-1 gap-3">
              <SelectionButton 
                title="I’ve never self-custodied before"
                selected={experience === 'Never'}
                onClick={() => setExperience('Never')}
              />
              <SelectionButton 
                title="I’ve used a wallet before"
                selected={experience === 'WalletUser'}
                onClick={() => setExperience('WalletUser')}
              />
              <SelectionButton 
                title="I already use cold storage"
                selected={experience === 'ColdStorage'}
                onClick={() => setExperience('ColdStorage')}
              />
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brandOrange uppercase tracking-wider mb-1">
                2. How urgent is it for you to move some crypto off risky setups?
              </label>
              <p className="text-xs text-textSecondary mb-3">
                Pick the option that feels closest to your situation — this just helps us tune how aggressive the plan should be.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SelectionButton 
                title="Exploring (Low)"
                description="I’m just learning. I’m not moving large amounts yet."
                selected={urgency === 'Low'}
                onClick={() => setUrgency('Low')}
              />
              <SelectionButton 
                title="Ready to Improve (Med)"
                description="I’m holding real value and want a safer setup this month."
                selected={urgency === 'Medium'}
                onClick={() => setUrgency('Medium')}
              />
              <SelectionButton 
                title="High Priority (High)"
                description="If my exchange or device died tomorrow, I’d be stressed."
                selected={urgency === 'High'}
                onClick={() => setUrgency('High')}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            <PrimaryButton 
              onClick={handleGenerate} 
              disabled={!experience || !urgency}
              isLoading={loading}
              className="w-full md:w-auto min-w-[240px]"
            >
              Generate My Action Card
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div>
          <ActionCardDisplay plan={plan} context="Secure My Crypto" />
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
