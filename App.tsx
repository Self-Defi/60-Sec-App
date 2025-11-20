import React, { useState } from 'react';
import { Home } from './views/Home';
import { SecureCrypto } from './views/SecureCrypto';
import { BackupAccounts } from './views/BackupAccounts';
import { AiTrust } from './views/AiTrust';
import { Layout } from './components/Layout';
import { ViewState } from './types';

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

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
};

export default App;