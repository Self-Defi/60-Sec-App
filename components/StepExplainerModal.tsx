
import React, { useEffect, useState } from 'react';
import { X, Loader2, PlayCircle, ExternalLink } from 'lucide-react';
import { generateStepExplanation } from '../services/geminiService';
import { getVideoUrlForStep } from '../utils/videoUtils';

interface StepExplainerModalProps {
  stepText: string;
  context: string;
  onClose: () => void;
}

export const StepExplainerModal: React.FC<StepExplainerModalProps> = ({ stepText, context, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoUrl = getVideoUrlForStep(stepText, context);

  useEffect(() => {
    let isMounted = true;

    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);
      try {
        const text = await generateStepExplanation(stepText, context);
        if (isMounted) {
          setExplanation(text);
        }
      } catch (err) {
        if (isMounted) {
          setError("Sorry, we couldn't generate an explanation at this moment. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [stepText, context]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-card w-full max-w-lg rounded-xl border border-gray-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-brandOrange mb-1">Step Explainer</h3>
            <p className="text-sm text-textSecondary line-clamp-2 font-medium text-white">
              "{stepText}"
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 rounded-full hover:bg-gray-800 transition-colors text-gray-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {videoUrl && (
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-brandBlue/10 border border-brandBlue/30 text-brandBlue hover:bg-brandBlue/20 transition-colors group"
            >
              <PlayCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Watch video explainer</span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100" />
            </a>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 text-brandOrange animate-spin" />
              <p className="text-textSecondary text-sm animate-pulse">Generating simple explanation...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400 text-sm">
              {error}
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
