import React, { useState, useRef, useEffect } from 'react';
import { useAml } from '../../context/AmlContext';
import { 
  Search, 
  Bell, 
  Upload, 
  Sparkles, 
  LogOut, 
  User, 
  ShieldCheck, 
  CheckCheck,
  AlertTriangle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { formatINR } from '../../logic/formatters';

interface HeaderProps {
  onOpenCsvModal: () => void;
  onOpenCreateCaseModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCsvModal, onOpenCreateCaseModal }) => {
  const { 
    transactions, 
    cases, 
    accounts, 
    notifications, 
    markAllNotificationsRead, 
    logout,
    startJudgeDemo,
    inspectAccountById,
    investigateCaseById,
    traceTransactionFlow,
    setActivePage
  } = useAml();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Search filtering
  const query = searchQuery.trim().toLowerCase();
  
  const matchedAccounts = query ? accounts.filter(a => 
    a.id.toLowerCase().includes(query) || a.name.toLowerCase().includes(query)
  ).slice(0, 4) : [];

  const matchedTransactions = query ? transactions.filter(t => 
    t.id.toLowerCase().includes(query) || 
    t.fromAccount.toLowerCase().includes(query) || 
    t.toAccount.toLowerCase().includes(query)
  ).slice(0, 4) : [];

  const matchedCases = query ? cases.filter(c => 
    c.id.toLowerCase().includes(query) || 
    c.title.toLowerCase().includes(query) ||
    c.primaryAccount.toLowerCase().includes(query)
  ).slice(0, 3) : [];

  const hasSearchResults = query && (matchedAccounts.length > 0 || matchedTransactions.length > 0 || matchedCases.length > 0);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5 no-print">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Global Search */}
        <div className="flex-1 max-w-lg relative" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Account ID (A101), Tx ID (T001), or Case ID (CASE-001)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 w-4 h-4 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && query && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 text-sm">
              {!hasSearchResults ? (
                <div className="p-4 text-center text-slate-500 text-xs">
                  No matching accounts, transactions, or cases found for &quot;{searchQuery}&quot;.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                  {/* Cases */}
                  {matchedCases.length > 0 && (
                    <div className="p-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Investigation Cases
                      </div>
                      {matchedCases.map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            investigateCaseById(c.id);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-blue-600 font-mono text-xs mr-2">{c.id}</span>
                            <span className="text-slate-800 text-xs font-medium">{c.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">{formatINR(c.amount, true)}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Accounts */}
                  {matchedAccounts.length > 0 && (
                    <div className="p-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Accounts Intelligence
                      </div>
                      {matchedAccounts.map(acc => (
                        <button
                          key={acc.id}
                          onClick={() => {
                            inspectAccountById(acc.id);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 font-mono text-xs mr-2">{acc.id}</span>
                            <span className="text-slate-700 text-xs">{acc.name}</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            acc.risk === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                            acc.risk === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {acc.risk}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Transactions */}
                  {matchedTransactions.length > 0 && (
                    <div className="p-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Transactions
                      </div>
                      {matchedTransactions.map(tx => (
                        <button
                          key={tx.id}
                          onClick={() => {
                            traceTransactionFlow(tx);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-900">{tx.id}</span>
                            <span className="text-xs text-slate-600 font-mono">{tx.fromAccount} → {tx.toAccount}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-900">{formatINR(tx.amount)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* JUDGE DEMO BUTTON */}
          <button
            onClick={startJudgeDemo}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm transition-all transform active:scale-95"
            title="Launch end-to-end guided walkthrough for hackathon judges"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>START JUDGE DEMO</span>
          </button>

          {/* IMPORT CSV */}
          <button
            onClick={onOpenCsvModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Import transaction CSV to recalculate network and rules"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          {/* NOTIFICATION BELL */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 relative transition-colors"
              title="System Alerts & Detection Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in-50">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">AML Intelligence Alerts</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                      {notifications.length}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.linkPage) setActivePage(n.linkPage as any);
                        setIsNotifOpen(false);
                      }}
                      className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          {n.severity === 'critical' ? (
                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          )}
                          <span>{n.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
              VR
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-none">V. Ravi</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Lead AML Investigator</div>
            </div>
            <button
              onClick={logout}
              title="Switch demo user or return to login"
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
