import React from 'react';

interface SelectionButtonProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
}

export const SelectionButton: React.FC<SelectionButtonProps> = ({ selected, onClick, title, description }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
        selected 
          ? 'bg-gray-800 border-brandOrange shadow-[0_0_15px_rgba(255,152,0,0.15)]' 
          : 'bg-card border-gray-800 hover:border-gray-600 hover:bg-gray-800/50'
      }`}
    >
      <h3 className={`font-semibold text-lg mb-1 transition-colors ${selected ? 'text-brandOrange' : 'text-white group-hover:text-white'}`}>
        {title}
      </h3>
      {description && (
        <p className="text-sm text-textSecondary leading-relaxed">
          {description}
        </p>
      )}
    </button>
  );
};