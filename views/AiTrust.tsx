
import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { PrimaryButton } from '../components/Button';
import { ActionCardDisplay } from '../components/ActionCardDisplay';
import { generateAiTrustSnapshot } from '../services/geminiService';
import { ActionPlan } from '../types';

interface AiTrustProps {
  onBack: () => void;
}

export const AiTrust: React.FC<AiTrustProps> = ({ onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ActionPlan | null>(null);

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

  const presets = ["ChatGPT", "Gemini", "Claude", "Midjourney", "Other AI Tool"];

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
            <h2 className="text-3xl md:text-4xl font-bold text-white">Know Before You Paste</h2>
            <p className="text-textSecondary max-w-xl mx-auto">
              Before you paste sensitive data into an AI tool, get a quick snapshot of how it might handle your information.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-card p-6 rounded-xl border border-gray-800 shadow-lg">
            <label className="block text-sm font-medium text-brandBlue uppercase tracking-wider mb-4">
              Paste the link to an AI tool or website
            </label>
            
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg leading-5 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-brandBlue focus:ring-1 focus:ring-brandBlue sm:text-sm transition-colors"
                placeholder="https://example-ai-app.com"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs text-textSecondary font-medium">Or pick a common tool:</p>
              <div className="flex flex-wrap gap-2">
                {presets.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => setInputValue(tool)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      inputValue === tool
                        ? 'bg-brandBlue text-black'
                        : 'bg-gray-800 text-textSecondary hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <PrimaryButton 
              onClick={handleGenerate} 
              disabled={!inputValue.trim()}
              isLoading={loading}
              className="w-full md:w-auto min-w-[240px] !bg-gradient-to-r !from-brandBlue !to-cyan-600 !shadow-cyan-900/20"
            >
              Generate Trust Snapshot
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div>
          <ActionCardDisplay plan={plan} context="AI Trust Snapshot" />
           <div className="mt-8 text-center">
             <button onClick={() => setPlan(null)} className="text-sm text-textSecondary hover:text-white underline">
               Check Another Tool
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
