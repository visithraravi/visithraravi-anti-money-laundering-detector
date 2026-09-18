import React, { useState, useMemo } from 'react';
import { useAml } from '../context/AmlContext';
import { formatINR, formatPatternLabel, getRiskBadgeClasses } from '../logic/formatters';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Crosshair, 
  UserCheck 
} from 'lucide-react';

interface SuspiciousCasesPageProps {
  onOpenCreateCaseModal: () => void;
}

export const SuspiciousCasesPage: React.FC<SuspiciousCasesPageProps> = ({ onOpenCreateCaseModal }) => {
  const { cases, investigateCaseById, setActivePage } = useAml();

  const [filterTab, setFilterTab] = useState<'ALL' | 'CRITICAL' | 'OPEN' | 'LAYERING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = (
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.primaryAccount.toLowerCase().includes(q) ||
          c.accounts.some(acc => acc.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }

      if (filterTab === 'CRITICAL' && c.risk !== 'CRITICAL') return false;
      if (filterTab === 'OPEN' && c.status !== 'OPEN') return false;
      if (filterTab === 'LAYERING' && c.pattern !== 'POSSIBLE_LAYERING') return false;

      return true;
    });
  }, [cases, filterTab, searchQuery]);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Suspicious Cases Dossier
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded uppercase">
              FIU Regulated
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Structured money-laundering case binders with evidence items, timelines, and audit records.
          </p>
        </div>

        <button
          onClick={onOpenCreateCaseModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Case</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          {[
            { id: 'ALL', label: `All Cases (${cases.length})` },
            { id: 'CRITICAL', label: `Critical (${cases.filter(c => c.risk === 'CRITICAL').length})` },
            { id: 'OPEN', label: `Open (${cases.filter(c => c.status === 'OPEN').length})` },
            { id: 'LAYERING', label: 'Layering' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Case ID, Title or Account..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map(c => {
          const riskBadge = getRiskBadgeClasses(c.risk);
          return (
            <div 
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Top Meta */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {c.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskBadge.bg} ${riskBadge.border} ${riskBadge.text}`}>
                    {c.risk}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {c.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">{formatPatternLabel(c.pattern)}</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(c.amount, true)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {/* Accounts Chips */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Target Entities ({c.accounts.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.accounts.slice(0, 5).map(acc => (
                      <span 
                        key={acc}
                        className="font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {acc}
                      </span>
                    ))}
                    {c.accounts.length > 5 && (
                      <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                        +{c.accounts.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Investigator and Evidence stats */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.assignedInvestigator}</span>
                  </span>
                  <span className="font-semibold text-slate-700">
                    {c.evidence.length} Evidence Items
                  </span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  c.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                  c.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                  c.status === 'ESCALATED' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {c.status.replace('_', ' ')}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      investigateCaseById(c.id);
                      setActivePage('reports');
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                    title="View SAR Report"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => investigateCaseById(c.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Investigate</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
