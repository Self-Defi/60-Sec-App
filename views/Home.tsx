import React from 'react';
import { ViewState } from '../types';
import { Shield, Key, Eye, ChevronRight } from 'lucide-react';
import ExplainerVideo from '../components/ExplainerVideo';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const tiles = [
    {
      id: ViewState.SecureCrypto,
      title: "Secure My Crypto",
      subtitle: "60-second protection plan for your Bitcoin and crypto.",
      icon: Shield,
      accent: "text-brandOrange"
    },
    {
      id: ViewState.BackupAccounts,
      title: "Backup My Accounts",
      subtitle: "Simple upgrade for passwords and identity safety.",
      icon: Key,
      accent: "text-white"
    },
    {
      id: ViewState.AiTrust,
      title: "AI Trust Snapshot",
      subtitle: "Understand an AI tool before you trust it with your data.",
      icon: Eye,
      accent: "text-brandBlue"
    }
  ];

  return (
    <div className="flex flex-col items-center pt-8 md:pt-16 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">
        Self Defi - 60 Second Starter
      </h1>
      
      <p className="text-textSecondary text-center mb-8 max-w-xl text-lg">
        “Three quick paths. One clear action you can take right now.”
      </p>

      {/* IPFS explainer video */}
      <ExplainerVideo />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => onNavigate(tile.id)}
            className="bg-card border border-gray-800 hover:border-gray-600 p-6 rounded-2xl text-left group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brandOrange to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-4">
              <tile.icon className={`w-8 h-8 ${tile.accent}`} />
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-brandOrange transition-colors">
              {tile.title}
            </h2>
            <p className="text-textSecondary text-sm leading-relaxed">
              {tile.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};