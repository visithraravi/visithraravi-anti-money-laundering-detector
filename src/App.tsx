import React, { useState } from 'react';
import { AmlProvider, useAml } from './context/AmlContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { JudgeDemoBanner } from './components/common/JudgeDemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { AccountIntelligenceModal } from './components/modals/AccountIntelligenceModal';
import { CreateCaseModal } from './components/modals/CreateCaseModal';
import { CsvImportModal } from './components/modals/CsvImportModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionMonitorPage } from './pages/TransactionMonitorPage';
import { MoneyNetworkPage } from './pages/MoneyNetworkPage';
import { SuspiciousCasesPage } from './pages/SuspiciousCasesPage';
import { InvestigationWorkspacePage } from './pages/InvestigationWorkspacePage';
import { AiInvestigatorPage } from './pages/AiInvestigatorPage';
import { CaseReportsPage } from './pages/CaseReportsPage';
import { DemoScenariosPage } from './pages/DemoScenariosPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, activePage } = useAml();

  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionMonitorPage onOpenCsvModal={() => setIsCsvModalOpen(true)} />;
      case 'network':
        return <MoneyNetworkPage />;
      case 'cases':
        return <SuspiciousCasesPage onOpenCreateCaseModal={() => setIsCreateCaseModalOpen(true)} />;
      case 'investigation':
        return <InvestigationWorkspacePage />;
      case 'ai-investigator':
        return <AiInvestigatorPage />;
      case 'reports':
        return <CaseReportsPage />;
      case 'scenarios':
        return <DemoScenariosPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <Header 
          onOpenCsvModal={() => setIsCsvModalOpen(true)}
          onOpenCreateCaseModal={() => setIsCreateCaseModalOpen(true)}
        />

        {/* Guided Judge Walkthrough Controller Banner */}
        <JudgeDemoBanner />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Modals */}
      <TransactionDetailModal />
      <AccountIntelligenceModal />
      <CreateCaseModal 
        isOpen={isCreateCaseModalOpen} 
        onClose={() => setIsCreateCaseModalOpen(false)} 
      />
      <CsvImportModal 
        isOpen={isCsvModalOpen} 
        onClose={() => setIsCsvModalOpen(false)} 
      />

      {/* Toast Notification Container */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <AmlProvider>
      <AppContent />
    </AmlProvider>
  );
}
