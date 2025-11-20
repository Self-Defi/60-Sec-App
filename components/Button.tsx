import React from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ isLoading, children, className = '', disabled, ...props }) => {
  return (
    <button
      className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-brandOrange to-brandOrange hover:to-orange-400 text-white shadow-lg shadow-orange-900/20 transform transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`w-full md:w-auto px-6 py-2 rounded-lg font-medium border border-gray-700 bg-card hover:bg-gray-800 text-textSecondary hover:text-white transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
