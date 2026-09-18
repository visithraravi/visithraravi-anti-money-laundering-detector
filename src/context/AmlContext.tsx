import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Transaction, 
  AccountInfo, 
  InvestigationCase, 
  AmlSettings, 
  AppNotification, 
  PageId, 
  RiskLevel 
} from '../types/aml';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_ACCOUNTS, 
  INITIAL_CASES, 
  DEFAULT_SETTINGS 
} from '../data/initialData';
import { 
  analyzeTransactions, 
  EngineAnalysisResult, 
  generateAiExplanation,
  buildTimelineFromTransactions 
} from '../logic/amlEngine';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AmlContextType {
  isAuthenticated: boolean;
  loginDemo: () => void;
  logout: () => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  
  // Data
  transactions: Transaction[];
  accounts: AccountInfo[];
  cases: InvestigationCase[];
  settings: AmlSettings;
  engineResult: EngineAnalysisResult;
  
  // Selections
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  selectedCase: InvestigationCase | null;
  setSelectedCase: (c: InvestigationCase | null) => void;
  activeCase: InvestigationCase | null;
  selectedAccount: AccountInfo | null;
  setSelectedAccount: (acc: AccountInfo | null) => void;
  
  // Actions
  createCase: (newCase: Omit<InvestigationCase, 'id' | 'createdAt'>) => string;
  updateCaseStatus: (caseId: string, status: InvestigationCase['status']) => void;
  addNoteToCase: (caseId: string, content: string) => void;
  addEvidenceToCase: (caseId: string, evidence: { title: string; description: string; confidence?: number; severity: RiskLevel }) => void;
  updateSettings: (newSettings: AmlSettings) => void;
  resetDemoData: () => void;
  resetAllData: () => void;
  loadScenario: (scenarioType: string) => void;
  importCsvTransactions: (newTxs: Transaction[]) => void;
  
  // Deep link helpers
  inspectAccountById: (accountId: string) => void;
  investigateCaseById: (caseId: string) => void;
  traceTransactionFlow: (tx: Transaction) => void;
  
  // Notifications & Toasts
  notifications: AppNotification[];
  markAllNotificationsRead: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Guided Judge Demo
  judgeDemoActive: boolean;
  judgeDemoStep: number;
  startJudgeDemo: () => void;
  nextJudgeStep: () => void;
  prevJudgeStep: () => void;
  stopJudgeDemo: () => void;
}

const AmlContext = createContext<AmlContextType | undefined>(undefined);

const STORAGE_KEY_TX = 'amlens_transactions_v2';
const STORAGE_KEY_CASES = 'amlens_cases_v2';
const STORAGE_KEY_SETTINGS = 'amlens_settings_v2';
const STORAGE_KEY_AUTH = 'amlens_auth_v2';

export const AmlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  // Current page
  const [activePage, setActivePage] = useState<PageId>('dashboard');

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TX);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Accounts state
  const [accounts, setAccounts] = useState<AccountInfo[]>(INITIAL_ACCOUNTS);

  // Cases state
  const [cases, setCases] = useState<InvestigationCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CASES);
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  // Settings state
  const [settings, setSettings] = useState<AmlSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Selected entities
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedCase, setSelectedCase] = useState<InvestigationCase | null>(cases[0] || null);
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Critical Chain Detected',
      message: 'A101 → B205 → C301 → D410 → E512 flagged for rapid fund layering (8 min)',
      severity: 'critical',
      timestamp: '10:10 AM',
      read: false,
      linkPage: 'investigation'
    },
    {
      id: 'notif-2',
      title: 'Circular Flow Alert',
      message: 'Closed loop transaction detected between P100, Q200, and R300',
      severity: 'warning',
      timestamp: '11:36 AM',
      read: false,
      linkPage: 'network'
    },
    {
      id: 'notif-3',
      title: 'High Velocity Spike',
      message: '₹82,00,000 transferred through 4 nodes in under 8 minutes (M101-M404)',
      severity: 'warning',
      timestamp: '09:20 AM',
      read: false,
      linkPage: 'cases'
    }
  ]);

  // Guided Judge Demo state
  const [judgeDemoActive, setJudgeDemoActive] = useState<boolean>(false);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(1);

  // Run AML Detection Engine on current transactions + settings
  const engineResult = React.useMemo(() => {
    return analyzeTransactions(transactions, settings);
  }, [transactions, settings]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
    } catch (e) {
      console.error('Failed to save cases to localStorage', e);
    }
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loginDemo = () => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    setActivePage('dashboard');
    showToast('Entered Demo Mode as Lead AML Investigator');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const createCase = (newCaseData: Omit<InvestigationCase, 'id' | 'createdAt'>): string => {
    const nextNum = cases.length + 1;
    const newId = `CASE-00${nextNum}`;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newCase: InvestigationCase = {
      ...newCaseData,
      id: newId,
      createdAt
    };

    setCases(prev => [newCase, ...prev]);
    setSelectedCase(newCase);
    showToast(`Case ${newId} created successfully.`);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Case Created',
        message: `${newId}: ${newCase.title} registered by investigator`,
        severity: 'info',
        timestamp: 'Just now',
        read: false,
        linkPage: 'cases'
      },
      ...prev
    ]);

    return newId;
  };

  const updateCaseStatus = (caseId: string, status: InvestigationCase['status']) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status } : c));
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(prev => prev ? { ...prev, status } : null);
    }
    showToast(`Case ${caseId} status updated to ${status}`);
  };

  const addNoteToCase = (caseId: string, content: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Senior Analyst V. Ravi',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content
    };
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          notes: [...(c.notes || []), newNote]
        };
      }
      return c;
    }));
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(prev => prev ? {
        ...prev,
        notes: [...(prev.notes || []), newNote]
      } : null);
    }
    showToast('Note saved to case dossier.');
  };

  const addEvidenceToCase = (caseId: string, evData: { title: string; description: string; confidence?: number; severity: RiskLevel }) => {
    const newEv: any = {
      id: `ev-${Date.now()}`,
      title: evData.title,
      description: evData.description,
      severity: evData.severity,
      confidence: evData.confidence || 0.95
    };
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          evidence: [...c.evidence, newEv]
        };
      }
      return c;
    }));
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(prev => prev ? {
        ...prev,
        evidence: [...prev.evidence, newEv]
      } : null);
    }
    showToast('Evidence item added to case.');
  };

  const updateSettings = (newSettings: AmlSettings) => {
    setSettings(newSettings);
    showToast('Settings saved successfully.');
  };

  const resetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setAccounts(INITIAL_ACCOUNTS);
    setCases(INITIAL_CASES);
    setSettings(DEFAULT_SETTINGS);
    setSelectedCase(INITIAL_CASES[0]);
    setSelectedTransaction(null);
    setSelectedAccount(null);
    showToast('Demo dataset reset to pristine defaults.');
  };

  const resetAllData = resetDemoData;

  const loadScenario = (scenarioType: string) => {
    if (scenarioType === 'layering' || scenarioType === 'SCENARIO_1') {
      const layeringTxs = INITIAL_TRANSACTIONS.filter(t => 
        ['T001', 'T002', 'T003', 'T004'].includes(t.id) || t.risk === 'LOW'
      );
      setTransactions(layeringTxs);
      const c = cases.find(cs => cs.id === 'CASE-001') || INITIAL_CASES[0];
      setSelectedCase(c);
      showToast('Scenario loaded: Layering Attack (A101 → E512)');
    } else if (scenarioType === 'circular' || scenarioType === 'SCENARIO_3') {
      const circularTxs = INITIAL_TRANSACTIONS.filter(t => 
        ['T010', 'T011', 'T012'].includes(t.id) || t.risk === 'LOW'
      );
      setTransactions(circularTxs);
      const c = cases.find(cs => cs.id === 'CASE-003') || INITIAL_CASES[2];
      setSelectedCase(c);
      showToast('Scenario loaded: Circular Flow (P100 → Q200 → R300 → P100)');
    } else if (scenarioType === 'rapid' || scenarioType === 'SCENARIO_2') {
      const rapidTxs = INITIAL_TRANSACTIONS.filter(t => 
        ['T020', 'T021', 'T022'].includes(t.id) || t.risk === 'LOW'
      );
      setTransactions(rapidTxs);
      const c = cases.find(cs => cs.id === 'CASE-002') || INITIAL_CASES[1];
      setSelectedCase(c);
      showToast('Scenario loaded: Rapid Smurfing Movement (M101 → M404)');
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
      const c = cases.find(cs => cs.id === 'CASE-001') || INITIAL_CASES[0];
      setSelectedCase(c);
      showToast('Scenario loaded: Anomaly Surge');
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Scenario Loaded',
        message: `Switched AML environment dataset to ${scenarioType.toUpperCase()} profile.`,
        severity: 'info',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const importCsvTransactions = (newTxs: Transaction[]) => {
    setTransactions(prev => [...newTxs, ...prev]);
    showToast(`Successfully imported ${newTxs.length} transactions from CSV.`);
    
    // Auto inspect the first imported transaction
    if (newTxs.length > 0) {
      setSelectedTransaction(newTxs[0]);
    }
  };

  const inspectAccountById = (accountId: string) => {
    const acc = accounts.find(a => a.id.toLowerCase() === accountId.toLowerCase());
    if (acc) {
      setSelectedAccount(acc);
    } else {
      // Create ad-hoc synthetic profile if from custom CSV
      const adHoc: AccountInfo = {
        id: accountId,
        name: `Account ${accountId}`,
        type: 'UNKNOWN',
        risk: 'MEDIUM',
        ageMonths: 12,
        totalInflow: 1000000,
        totalOutflow: 850000,
        transactionCount: 4,
        firstSeen: '2026-09-18 09:00',
        lastSeen: '2026-09-18 11:00',
        connectedAccounts: [],
        riskIndicators: ['Account discovered in imported transaction dataset'],
        jurisdiction: 'Domestic',
        balance: 150000
      };
      setSelectedAccount(adHoc);
    }
  };

  const investigateCaseById = (caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (targetCase) {
      setSelectedCase(targetCase);
      setActivePage('investigation');
    }
  };

  const traceTransactionFlow = (tx: Transaction) => {
    setSelectedTransaction(tx);
    // Find if there is an existing case or create ad-hoc focus
    const matchedCase = cases.find(c => c.relatedTransactionIds?.includes(tx.id));
    if (matchedCase) {
      setSelectedCase(matchedCase);
    }
    setActivePage('network');
    showToast(`Tracing flow for ${tx.id} (${tx.fromAccount} → ${tx.toAccount})`, 'info');
  };

  // Guided Demo Orchestration
  const startJudgeDemo = () => {
    setJudgeDemoActive(true);
    setJudgeDemoStep(1);
    // Step 1: Load Layering Scenario
    loadScenario('layering');
    setActivePage('dashboard');
    showToast('Starting Guided Judge Walkthrough (Step 1 of 11)', 'info');
  };

  const nextJudgeStep = () => {
    const next = judgeDemoStep + 1;
    setJudgeDemoStep(next);

    switch (next) {
      case 2:
        setActivePage('dashboard');
        break;
      case 3:
        setActivePage('dashboard');
        break;
      case 4:
        setActivePage('network');
        break;
      case 5:
        setActivePage('network');
        inspectAccountById('A101');
        break;
      case 6:
        investigateCaseById('CASE-001');
        break;
      case 7:
        setActivePage('investigation');
        break;
      case 8:
        setActivePage('investigation');
        break;
      case 9:
        setActivePage('ai-investigator');
        break;
      case 10:
        setActivePage('cases');
        break;
      case 11:
        setActivePage('reports');
        break;
      default:
        stopJudgeDemo();
        showToast('Judge Demo Completed! All modules verified.', 'success');
        break;
    }
  };

  const prevJudgeStep = () => {
    if (judgeDemoStep > 1) {
      const prev = judgeDemoStep - 1;
      setJudgeDemoStep(prev);
    }
  };

  const stopJudgeDemo = () => {
    setJudgeDemoActive(false);
    setJudgeDemoStep(1);
  };

  return (
    <AmlContext.Provider
      value={{
        isAuthenticated,
        loginDemo,
        logout,
        activePage,
        setActivePage,
        transactions,
        accounts,
        cases,
        settings,
        engineResult,
        selectedTransaction,
        setSelectedTransaction,
        selectedCase,
        setSelectedCase,
        activeCase: selectedCase,
        selectedAccount,
        setSelectedAccount,
        createCase,
        updateCaseStatus,
        addNoteToCase,
        addEvidenceToCase,
        updateSettings,
        resetDemoData,
        resetAllData,
        loadScenario,
        importCsvTransactions,
        inspectAccountById,
        investigateCaseById,
        traceTransactionFlow,
        notifications,
        markAllNotificationsRead,
        toasts,
        showToast,
        removeToast,
        judgeDemoActive,
        judgeDemoStep,
        startJudgeDemo,
        nextJudgeStep,
        prevJudgeStep,
        stopJudgeDemo
      }}
    >
      {children}
    </AmlContext.Provider>
  );
};

export const useAml = (): AmlContextType => {
  const context = useContext(AmlContext);
  if (!context) {
    throw new Error('useAml must be used within an AmlProvider');
  }
  return context;
};
