import React from 'react';
import { ActionPlan } from '../types';
import { Copy, Download, ArrowRight, MousePointerClick, MessageCircle, HelpCircle } from 'lucide-react';
import { SecondaryButton } from './Button';

interface ActionCardDisplayProps {
  plan: ActionPlan;
  context: string;
  onStepClick?: (stepText: string, context: string) => void;
}

export const ActionCardDisplay: React.FC<ActionCardDisplayProps> = ({ plan, context, onStepClick }) => {
  
  const handleCopy = () => {
    const text = `${plan.title}\n\n${plan.timeframe}\n\nSteps:\n${plan.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nNotes:\n${plan.notes}`;
    navigator.clipboard.writeText(text);
    alert('Plan copied to clipboard!');
  };

  const handleDownload = () => {
    const text = `${plan.title}\n\n${plan.timeframe}\n\nSteps:\n${plan.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nNotes:\n${plan.notes}`;
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "my-security-plan.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const openAssistant = (prefill: string) => {
    window.dispatchEvent(new CustomEvent("open-selfdefi-chat", {
      detail: { prefill, context }
    }));
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto mt-8">
      <div className="bg-card rounded-xl p-6 md:p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
        {/* Decorative header accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange to-brandBlue opacity-50" />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{plan.title}</h2>
          <span className="inline-block px-3 py-1 rounded-full bg-gray-800 text-xs font-medium text-brandBlue border border-gray-700">
            {plan.timeframe}
          </span>
        </div>

        <div className="mb-2 text-xs text-textSecondary uppercase tracking-wider font-semibold">
          Tap a step to learn how
        </div>

        <div className="space-y-3 mb-8">
          {plan.steps.map((step, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onStepClick?.(step, context)}
              className="w-full text-left flex gap-4 p-3 rounded-lg bg-background/50 hover:bg-background/80 hover:border-brandOrange/30 border border-transparent transition-all group relative"
              aria-label={`Get explanation for step ${index + 1}`}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 text-brandOrange font-bold flex items-center justify-center border border-gray-700 group-hover:border-brandOrange/50 transition-colors">
                {index + 1}
              </span>
              <div className="flex-grow">
                <p className="text-gray-200 mt-1 group-hover:text-white transition-colors font-medium">{step}</p>
              </div>
              <div className="hidden md:flex items-center opacity-0 group-hover:opacity-50 transition-opacity">
                <MousePointerClick className="w-4 h-4 text-textSecondary" />
              </div>
            </button>
          ))}
        </div>

        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="text-sm text-textSecondary italic">
            <span className="font-semibold text-brandOrange/80 not-italic mr-2">Note:</span>
            {plan.notes}
          </p>
        </div>

        {/* AI Assistant CTA Block */}
        <div className="mb-8 p-1">
          <div className="flex flex-col sm:flex-row gap-3">
             <button
               onClick={() => openAssistant(`I have a question about my plan "${plan.title}". Can you clarify the steps?`)}
               className="flex-grow flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brandBlue/10 hover:bg-brandBlue/20 text-brandBlue border border-brandBlue/30 hover:border-brandBlue/50 transition-all text-sm font-semibold"
             >
               <MessageCircle className="w-4 h-4" />
               Ask the Self-Defi Assistant about this plan →
             </button>
             <button
               onClick={() => openAssistant(`Explain Step 1 in my plan: ${plan.steps[0]}`)}
               className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-textSecondary hover:text-white border border-gray-700 transition-all text-sm font-medium"
             >
               <HelpCircle className="w-4 h-4" />
               Quick help on Step 1
             </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 border-t border-gray-800/50 pt-6">
          <SecondaryButton onClick={handleCopy} className="flex items-center justify-center gap-2">
            <Copy className="w-4 h-4" /> Copy to Clipboard
          </SecondaryButton>
          <SecondaryButton onClick={handleDownload} className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Text
          </SecondaryButton>
        </div>

        <div className="pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-textSecondary mb-3">Want your full custody stack designed for you?</p>
          <a 
            href="https://cal.com/selfdeficonsultant/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-brandOrange hover:text-white font-medium transition-colors group"
          >
            Book a 1:1 SD Advisory session 
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};