import React from 'react';
import { useAml } from '../../context/AmlContext';
import { getTransactionSurroundings } from '../../logic/amlEngine';
import { formatINR, formatPatternLabel, getRiskBadgeClasses } from '../../logic/formatters';
import { 
  X, 
  ArrowRight, 
  Sparkles, 
  Network, 
  FolderPlus, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  Building,
  User,
  AlertTriangle
} from 'lucide-react';

export const TransactionDetailModal: React.FC = () => {
  const { 
    selectedTransaction, 
    setSelectedTransaction, 
    transactions,
    traceTransactionFlow,
    inspectAccountById,
    investigateCaseById,
    setActivePage,
    createCase
  } = useAml();

  if (!selectedTransaction) return null;

  const surroundings = getTransactionSurroundings(selectedTransaction.id, transactions);
  const riskBadge = getRiskBadgeClasses(selectedTransaction.risk);

  const handleTraceFlow = () => {
    traceTransactionFlow(selectedTransaction);
    setSelectedTransaction(null);
  };

  const handleAiExplain = () => {
    setActivePage('ai-investigator');
    setSelectedTransaction(null);
  };

  const handleOpenInvestigation = () => {
    investigateCaseById('CASE-001');
    setSelectedTransaction(null);
  };

  const handleQuickCreateCase = () => {
    createCase({
      title: `Investigation on ${selectedTransaction.id} (${selectedTransaction.fromAccount} → ${selectedTransaction.toAccount})`,
      risk: selectedTransaction.risk,
      pattern: selectedTransaction.pattern,
      amount: selectedTransaction.amount,
      accounts: [selectedTransaction.fromAccount, selectedTransaction.toAccount],
      primaryAccount: selectedTransaction.fromAccount,
      status: 'OPEN',
      assignedInvestigator: 'V. Ravi',
      description: `Investigating transaction ${selectedTransaction.id} for ${formatPatternLabel(selectedTransaction.pattern)} involving ${formatINR(selectedTransaction.amount)}.`,
      evidence: [],
      timeline: [],
      relatedTransactionIds: [selectedTransaction.id]
    });
    setActivePage('cases');
    setSelectedTransaction(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {selectedTransaction.id}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${riskBadge.bg} ${riskBadge.border} ${riskBadge.text}`}>
                {selectedTransaction.risk} RISK
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                {formatPatternLabel(selectedTransaction.pattern)}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {formatINR(selectedTransaction.amount)}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Timestamp: {selectedTransaction.timestamp} ({selectedTransaction.date})</span>
              <span>•</span>
              <span className="font-medium text-slate-700">{selectedTransaction.category || 'Electronic Fund Transfer'}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedTransaction(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Transfer Route Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Transfer Route & Counterparties
            </div>
            <div className="flex items-center justify-between gap-4">
              
              {/* Originator */}
              <div 
                onClick={() => {
                  inspectAccountById(selectedTransaction.fromAccount);
                  setSelectedTransaction(null);
                }}
                className="flex-1 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">Originator</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 mt-1">
                  {selectedTransaction.fromAccount}
                </div>
                <div className="text-[11px] text-blue-600 font-medium hover:underline mt-0.5">
                  View Account Intelligence →
                </div>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0">
                <ArrowRight className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5">DIRECT WIRE</span>
              </div>

              {/* Beneficiary */}
              <div 
                onClick={() => {
                  inspectAccountById(selectedTransaction.toAccount);
                  setSelectedTransaction(null);
                }}
                className="flex-1 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">Beneficiary</span>
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 mt-1">
                  {selectedTransaction.toAccount}
                </div>
                <div className="text-[11px] text-blue-600 font-medium hover:underline mt-0.5">
                  View Account Intelligence →
                </div>
              </div>

            </div>
          </div>

          {/* Connected Context: Previous & Next Transactions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Chain Flow Context (Previous & Next Hops)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Previous */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400">Previous Inbound Transfer</span>
                {surroundings?.previous ? (
                  <div className="mt-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800">{surroundings.previous.id}</span>
                      <span className="text-xs font-semibold text-slate-700">{formatINR(surroundings.previous.amount)}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {surroundings.previous.fromAccount} → {surroundings.previous.toAccount} ({surroundings.previous.timestamp})
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic mt-1">
                    No immediate prior transaction in current window (Origin Node)
                  </div>
                )}
              </div>

              {/* Next */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400">Next Outbound Transfer</span>
                {surroundings?.next ? (
                  <div className="mt-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800">{surroundings.next.id}</span>
                      <span className="text-xs font-semibold text-slate-700">{formatINR(surroundings.next.amount)}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {surroundings.next.fromAccount} → {surroundings.next.toAccount} ({surroundings.next.timestamp})
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic mt-1">
                    No immediate successor transaction (Terminal or Sinks Node)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes and Risk Indicators */}
          {selectedTransaction.notes && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Investigator Audit Note: </span>
                <span>{selectedTransaction.notes}</span>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTraceFlow}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Trace Money Flow</span>
            </button>

            <button
              onClick={handleAiExplain}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Explain</span>
            </button>

            <button
              onClick={handleQuickCreateCase}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Add to Case</span>
            </button>
          </div>

          <button
            onClick={handleOpenInvestigation}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Open Investigation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
