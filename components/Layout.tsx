
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-textPrimary font-sans selection:bg-brandOrange selection:text-white bg-glow flex flex-col">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-6 md:py-10 flex flex-col">
        {children}
      </main>

      <footer className="w-full py-8 mt-auto border-t border-gray-800/50 text-center">
        <div className="flex flex-col gap-3 px-4">
          <p className="text-xs md:text-sm text-textSecondary">
            Self-Defi | SD Advisory Group —{' '}
            <a 
              href="https://cal.com/selfdeficonsultant/15min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brandOrange hover:text-brandBlue transition-colors underline decoration-transparent hover:decoration-brandBlue"
            >
              Book a Consultation
            </a>
          </p>
          <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide uppercase">
            (CBP) Certified Bitcoin Professional | (CEP) Certified Ethereum Professional
          </p>
        </div>
      </footer>
    </div>
  );
};
