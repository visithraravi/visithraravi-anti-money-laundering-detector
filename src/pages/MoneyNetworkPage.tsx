import React from 'react';
import { useAml } from '../context/AmlContext';
import { MoneyNetworkCanvas } from '../components/network/MoneyNetworkCanvas';
import { formatINR, formatPatternLabel, getRiskBadgeClasses } from '../logic/formatters';
import { 
  Network, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Briefcase, 
  FileText, 
  Layers, 
  RotateCw,
  Info
} from 'lucide-react';

export const MoneyNetworkPage: React.FC = () => {
  const { 
    engineResult, 
    investigateCaseById, 
    inspectAccountById, 
    setActivePage,
    traceTransactionFlow,
    transactions
  } = useAml();

  const handleInspectMainChain = () => {
    const t001 = transactions.find(t => t.id === 'T001');
    if (t001) traceTransactionFlow(t001);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Money Network Graph
            </h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded uppercase">
              Directed Topology
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Interactive multi-hop network tracing illicit fund movement, shell entities, and circular transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => investigateCaseById('CASE-001')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-black text-white shadow-xs transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Open in Investigation</span>
          </button>
          
          <button
            onClick={() => setActivePage('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Graph Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <MoneyNetworkCanvas />

      {/* Detected Graph Anomalies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Layering Chain */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
              Primary Layering Trail
            </span>
            <span className="text-xs font-mono font-bold text-slate-900">₹50,00,000</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">4-Hop Rapid Dispersion</h3>
            <p className="text-xs text-slate-500 mt-1">
              Funds moved rapidly through shell company accounts with small fee deductions across 8 minutes.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 font-bold border border-slate-200 flex items-center justify-between">
            <span>A101 → B205 → C301 → D410 → E512</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => inspectAccountById('B205')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Inspect Shell B205 →
            </button>
            <button
              onClick={() => investigateCaseById('CASE-001')}
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs"
            >
              Investigate Case-001
            </button>
          </div>
        </div>

        {/* Circular Transfer Ring */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full uppercase">
              Circular Ring
            </span>
            <span className="text-xs font-mono font-bold text-slate-900">₹1,20,00,000</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">Closed Loop Round-Tripping</h3>
            <p className="text-xs text-slate-500 mt-1">
              Funds originate at P100, pass through Q200 and R300, and return to P100 with zero commercial rationale.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 font-bold border border-slate-200 flex items-center justify-between">
            <span>P100 → Q200 → R300 → P100</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => inspectAccountById('P100')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Inspect Origin P100 →
            </button>
            <button
              onClick={() => investigateCaseById('CASE-003')}
              className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs"
            >
              Investigate Case-003
            </button>
          </div>
        </div>

        {/* High-Velocity Smurfing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
              Rapid Movement
            </span>
            <span className="text-xs font-mono font-bold text-slate-900">₹82,00,000</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">M101 High Velocity Forwarding</h3>
            <p className="text-xs text-slate-500 mt-1">
              Single high-value inbound transfer immediately split and pushed out across three subsidiary accounts.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 font-bold border border-slate-200 flex items-center justify-between">
            <span>M101 → M202 → M303 → M404</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => inspectAccountById('M101')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Inspect Hub M101 →
            </button>
            <button
              onClick={() => investigateCaseById('CASE-002')}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs"
            >
              Investigate Case-002
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
