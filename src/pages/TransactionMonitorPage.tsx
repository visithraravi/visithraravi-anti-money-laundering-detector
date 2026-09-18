import React, { useState, useMemo } from 'react';
import { useAml } from '../context/AmlContext';
import { formatINR, formatPatternLabel, getRiskBadgeClasses } from '../logic/formatters';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Network, 
  SlidersHorizontal, 
  Upload, 
  Download, 
  CheckCircle2, 
  ShieldAlert,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { Transaction } from '../types/aml';

interface TransactionMonitorPageProps {
  onOpenCsvModal: () => void;
}

export const TransactionMonitorPage: React.FC<TransactionMonitorPageProps> = ({ onOpenCsvModal }) => {
  const { 
    transactions, 
    setSelectedTransaction, 
    traceTransactionFlow, 
    inspectAccountById 
  } = useAml();

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [patternFilter, setPatternFilter] = useState<string>('ALL');
  const [amountFilter, setAmountFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches = (
          tx.id.toLowerCase().includes(q) ||
          tx.fromAccount.toLowerCase().includes(q) ||
          tx.toAccount.toLowerCase().includes(q) ||
          (tx.category && tx.category.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }

      // Risk
      if (riskFilter !== 'ALL' && tx.risk !== riskFilter) return false;

      // Pattern
      if (patternFilter !== 'ALL' && tx.pattern !== patternFilter) return false;

      // Status
      if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;

      // Amount
      if (amountFilter === 'HIGH_50L' && tx.amount < 5000000) return false;
      if (amountFilter === 'HIGH_10L' && tx.amount < 1000000) return false;
      if (amountFilter === 'LOW_1L' && tx.amount >= 100000) return false;

      return true;
    });
  }, [transactions, searchTerm, riskFilter, patternFilter, amountFilter, statusFilter]);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Transaction Monitor
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Real-time transaction surveillance ledger with automated heuristic AML pattern detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCsvModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Main Chain Highlighting Banner */}
      <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-red-900">
              High-Priority Demo Layering Chain (4 Hops, 8 Min Velocity)
            </div>
            <div className="text-xs font-mono text-red-700 mt-0.5 font-semibold">
              T001 (A101→B205) ➔ T002 (B205→C301) ➔ T003 (C301→D410) ➔ T004 (D410→E512)
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const first = transactions.find(t => t.id === 'T001');
            if (first) traceTransactionFlow(first);
          }}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Trace In Graph</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Transaction ID (T001), Sender (A101), or Receiver (B205)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all font-mono"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          
          {/* Risk */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Risk Severity
            </label>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Pattern */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Pattern Typology
            </label>
            <select
              value={patternFilter}
              onChange={e => setPatternFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Patterns</option>
              <option value="POSSIBLE_LAYERING">Possible Layering</option>
              <option value="RAPID_MOVEMENT">Rapid Movement</option>
              <option value="CIRCULAR_TRANSFER">Circular Transfer</option>
              <option value="HIGH_VALUE">High Value Alert</option>
              <option value="UNUSUAL_RELATIONSHIP">Unusual Relationship</option>
              <option value="NORMAL">Normal Transfers</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Ticket Amount
            </label>
            <select
              value={amountFilter}
              onChange={e => setAmountFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Amounts</option>
              <option value="HIGH_50L">High Ticket (&gt; ₹50 Lakh)</option>
              <option value="HIGH_10L">Statutory (&gt; ₹10 Lakh)</option>
              <option value="LOW_1L">Retail (&lt; ₹1 Lakh)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Surveillance Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="FLAGGED">Flagged</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="SETTLED">Settled</option>
            </select>
          </div>

        </div>

      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">
            Showing <span className="font-bold text-slate-900">{filteredTransactions.length}</span> of {transactions.length} transactions
          </span>

          {(searchTerm || riskFilter !== 'ALL' || patternFilter !== 'ALL' || amountFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRiskFilter('ALL');
                setPatternFilter('ALL');
                setAmountFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">From Account</th>
                <th className="py-3 px-4">To Account</th>
                <th className="py-3 px-4">Amount (INR)</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Pattern</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No matching transactions found for the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const riskBadge = getRiskBadgeClasses(tx.risk);
                  const isMainChain = ['T001', 'T002', 'T003', 'T004'].includes(tx.id);

                  return (
                    <tr 
                      key={tx.id} 
                      className={`hover:bg-slate-50 transition-colors ${
                        isMainChain ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {tx.id}
                        {isMainChain && (
                          <span className="ml-1.5 text-[9px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-mono font-bold">
                            LAYER
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {tx.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => inspectAccountById(tx.fromAccount)}
                          className="font-mono font-bold text-slate-900 hover:text-blue-600 hover:underline"
                        >
                          {tx.fromAccount}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => inspectAccountById(tx.toAccount)}
                          className="font-mono font-bold text-slate-900 hover:text-blue-600 hover:underline"
                        >
                          {tx.toAccount}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                        {formatINR(tx.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${riskBadge.bg} ${riskBadge.border} ${riskBadge.text}`}>
                          {tx.risk}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {formatPatternLabel(tx.pattern)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'FLAGGED' ? 'bg-red-100 text-red-800' :
                          tx.status === 'UNDER_INVESTIGATION' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => traceTransactionFlow(tx)}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                          title="Trace in Money Flow Network"
                        >
                          <Network className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
