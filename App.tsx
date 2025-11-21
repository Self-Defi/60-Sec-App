import React, { useState } from 'react';
import { Home } from './views/Home';
import { SecureCrypto } from './views/SecureCrypto';
import { BackupAccounts } from './views/BackupAccounts';
import { AiTrust } from './views/AiTrust';
import { Layout } from './components/Layout';
import { ViewState } from './types';
import { SelfDefiContext } from './components/ChatBot';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.Home);

  const renderView = () => {
    switch (currentView) {
      case ViewState.Home:
        return <Home onNavigate={setCurrentView} />;
      case ViewState.SecureCrypto:
        return <SecureCrypto onBack={() => setCurrentView(ViewState.Home)} />;
      case ViewState.BackupAccounts:
        return <BackupAccounts onBack={() => setCurrentView(ViewState.Home)} />;
      case ViewState.AiTrust:
        return <AiTrust onBack={() => setCurrentView(ViewState.Home)} />;
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  const getContext = (view: ViewState): SelfDefiContext => {
    switch (view) {
      case ViewState.SecureCrypto: return "SECURE_CRYPTO";
      case ViewState.BackupAccounts: return "BACKUP_ACCOUNTS";
      case ViewState.AiTrust: return "AI_TRUST";
      default: return null;
    }
  };

  return (
    <Layout activeContext={getContext(currentView)}>
      {renderView()}
    </Layout>
  );
};

export default App;