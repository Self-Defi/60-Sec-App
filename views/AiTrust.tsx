
import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { PrimaryButton } from '../components/Button';
import { ActionCardDisplay } from '../components/ActionCardDisplay';
import { generateAiTrustSnapshot } from '../services/geminiService';
import { ActionPlan } from '../types';
import { StepExplainerModal } from '../components/StepExplainerModal';

interface AiTrustProps {
  onBack: () => void;
}

export const AiTrust: React.FC<AiTrustProps> = ({ onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ActionPlan | null>(null);

  // Explainer Modal State
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [explainerStep, setExplainerStep] = useState<string | null>(null);
  const explainerContext = "AI_TRUST";

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateAiTrustSnapshot(inputValue);
      setPlan(result);
    } catch (error) {
      console.error(error);
      alert('Could not generate snapshot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (step: string) => {
    setExplainerStep(step);
    setExplainerOpen(true);
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
        <h1 className="text-lg md:text-xl font-bold text-right">AI Trust Snapshot</h1>
      </div>

      {!plan ? (
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Check Your Tools</h2>
            <p className="text-textSecondary max-w-xl mx-auto">
              Enter the name of an AI tool (e.g. "ChatGPT", "Midjourney", "Otter.ai"). We'll generate a privacy & security snapshot.
            </p>
          </div>

          <div className="max-w-xl mx-auto w-full">
            <label className="block text-sm font-medium text-brandOrange uppercase tracking-wider mb-2">
              Tool Name or URL
            </label>
            <div className="relative">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. ChatGPT"
                className="w-full bg-card border border-gray-700 rounded-xl px-5 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-brandOrange focus:ring-1 focus:ring-brandOrange transition-all pl-12"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <PrimaryButton 
              onClick={handleGenerate} 
              disabled={!inputValue.trim()}
              isLoading={loading}
              className="w-full md:w-auto min-w-[240px]"
            >
              Generate Snapshot
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div>
          <ActionCardDisplay 
            plan={plan} 
            context={explainerContext} 
            onStepClick={handleStepClick} 
          />
          <div className="mt-8 text-center">
            <button onClick={() => setPlan(null)} className="text-sm text-textSecondary hover:text-white underline">
              Search Another Tool
            </button>
          </div>
        </div>
      )}

      <StepExplainerModal
        isOpen={explainerOpen}
        stepText={explainerStep}
        context={explainerContext}
        onClose={() => setExplainerOpen(false)}
      />
    </div>
  );
};
