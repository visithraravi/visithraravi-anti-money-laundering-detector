import React from 'react';
import { useAml } from '../../context/AmlContext';
import { formatINR, getRiskBadgeClasses } from '../../logic/formatters';
import { 
  X, 
  Building2, 
  UserCheck, 
  ShieldAlert, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Globe, 
  Network,
  AlertTriangle,
  FolderPlus,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export const AccountIntelligenceModal: React.FC = () => {
  const { 
    selectedAccount, 
    setSelectedAccount, 
    transactions,
    setSelectedTransaction,
    setActivePage,
    createCase
  } = useAml();

  if (!selectedAccount) return null;

  const incomingTxs = transactions.filter(t => t.toAccount === selectedAccount.id);
  const outgoingTxs = transactions.filter(t => t.fromAccount === selectedAccount.id);

  const riskBadge = getRiskBadgeClasses(selectedAccount.risk);

  const handleTraceInNetwork = () => {
    setActivePage('network');
    setSelectedAccount(null);
  };

  const handleCreateCaseForAccount = () => {
    createCase({
      title: `Full AML Audit: ${selectedAccount.id} (${selectedAccount.name})`,
      risk: selectedAccount.risk,
      pattern: 'POSSIBLE_LAYERING',
      amount: Math.max(selectedAccount.totalInflow, selectedAccount.totalOutflow),
      accounts: [selectedAccount.id, ...selectedAccount.connectedAccounts],
      primaryAccount: selectedAccount.id,
      status: 'OPEN',
      assignedInvestigator: 'V. Ravi',
      description: `In-depth investigation opened into ${selectedAccount.name} (${selectedAccount.id}). Flagged risk factors: ${selectedAccount.riskIndicators.join('; ')}.`,
      evidence: [],
      timeline: [],
      relatedTransactionIds: [...incomingTxs, ...outgoingTxs].map(t => t.id)
    });
    setActivePage('cases');
    setSelectedAccount(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              selectedAccount.risk === 'CRITICAL' ? 'bg-red-50 border-red-200 text-red-600' :
              selectedAccount.risk === 'HIGH' ? 'bg-orange-50 border-orange-200 text-orange-600' :
              'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                  {selectedAccount.id}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${riskBadge.bg} ${riskBadge.border} ${riskBadge.text}`}>
                  {selectedAccount.risk} RISK
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {selectedAccount.type.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedAccount.name}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{selectedAccount.jurisdiction}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Account Age: {selectedAccount.ageMonths} Months</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedAccount(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Inflow</div>
              <div className="text-sm sm:text-base font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{formatINR(selectedAccount.totalInflow)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Outflow</div>
              <div className="text-sm sm:text-base font-bold text-red-600 mt-1 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                <span>{formatINR(selectedAccount.totalOutflow)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Current Balance</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {formatINR(selectedAccount.balance)}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Transactions</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {selectedAccount.transactionCount} transfers
              </div>
            </div>
          </div>

          {/* Risk Indicators / Red Flags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Observed Risk Indicators & Typologies</span>
            </h4>
            
            {selectedAccount.riskIndicators.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
                No active suspicious indicators or sanctions flags on record for this account.
              </div>
            ) : (
              <div className="space-y-1.5">
                {selectedAccount.riskIndicators.map((ind, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 bg-red-50/60 border border-red-200/80 rounded-lg text-xs text-red-800 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connected Accounts Network List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
              <span>Directly Connected Accounts ({selectedAccount.connectedAccounts.length})</span>
              <span className="text-[11px] text-blue-600 font-medium">Click to inspect</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedAccount.connectedAccounts.map((connId) => (
                <button
                  key={connId}
                  onClick={() => {
                    const acc = transactions.some(t => t.fromAccount === connId || t.toAccount === connId);
                    if (acc) {
                      // switch
                      setSelectedAccount(null);
                      setTimeout(() => {
                        const target = transactions.find(t => t.fromAccount === connId || t.toAccount === connId);
                        if (target) {
                          // select that account
                        }
                      }, 100);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-mono text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                >
                  {connId}
                </button>
              ))}
            </div>
          </div>

          {/* Inbound & Outbound Transactions Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inbound */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 p-2.5 border-b border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>Inflow Transfers ({incomingTxs.length})</span>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                {incomingTxs.length === 0 ? (
                  <div className="p-3 text-slate-400 text-center italic text-[11px]">No inbound transfers recorded</div>
                ) : (
                  incomingTxs.map(tx => (
                    <div 
                      key={tx.id}
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setSelectedAccount(null);
                      }}
                      className="p-2.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-800 mr-1">{tx.fromAccount}</span>
                        <span className="text-[10px] text-slate-400">({tx.timestamp})</span>
                      </div>
                      <span className="font-bold text-emerald-600">{formatINR(tx.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Outbound */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 p-2.5 border-b border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <ArrowUpRight className="w-3.5 h-3.5 text-red-600" />
                <span>Outflow Transfers ({outgoingTxs.length})</span>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                {outgoingTxs.length === 0 ? (
                  <div className="p-3 text-slate-400 text-center italic text-[11px]">No outbound transfers recorded</div>
                ) : (
                  outgoingTxs.map(tx => (
                    <div 
                      key={tx.id}
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setSelectedAccount(null);
                      }}
                      className="p-2.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 mr-1">to</span>
                        <span className="font-mono font-bold text-slate-800">{tx.toAccount}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({tx.timestamp})</span>
                      </div>
                      <span className="font-bold text-red-600">{formatINR(tx.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleTraceInNetwork}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Trace in Network Graph</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateCaseForAccount}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>Create Investigation Case</span>
            </button>
            <button
              onClick={() => setSelectedAccount(null)}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
