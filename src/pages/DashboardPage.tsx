import React, { useState, useMemo } from 'react';
import { useAml } from '../context/AmlContext';
import { formatINR, formatPatternLabel, getRiskBadgeClasses } from '../logic/formatters';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  Activity, 
  ShieldAlert, 
  Briefcase, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  Crosshair,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    cases, 
    transactions, 
    engineResult, 
    investigateCaseById, 
    setActivePage 
  } = useAml();

  const [timeFilter, setTimeFilter] = useState<'Today' | '7 Days' | '30 Days' | '90 Days'>('Today');

  // Dynamic multipliers based on filter
  const timeMultiplier = useMemo(() => {
    switch (timeFilter) {
      case '7 Days': return 7;
      case '30 Days': return 28;
      case '90 Days': return 85;
      case 'Today': default: return 1;
    }
  }, [timeFilter]);

  // Chart 1: Transaction Volume Data
  const volumeData = useMemo(() => {
    if (timeFilter === 'Today') {
      return [
        { time: '08:00', volume: 1420, flagged: 2 },
        { time: '09:00', volume: 2850, flagged: 6 },
        { time: '10:00', volume: 5410, flagged: 18 },
        { time: '11:00', volume: 4900, flagged: 12 },
        { time: '12:00', volume: 3800, flagged: 3 },
        { time: '13:00', volume: 2950, flagged: 1 },
        { time: '14:00', volume: 3200, flagged: 4 },
        { time: '15:00', volume: 2100, flagged: 2 }
      ];
    }
    return [
      { time: 'Mon', volume: 22000 * timeMultiplier / 7, flagged: 38 },
      { time: 'Tue', volume: 24500 * timeMultiplier / 7, flagged: 42 },
      { time: 'Wed', volume: 27800 * timeMultiplier / 7, flagged: 55 },
      { time: 'Thu', volume: 23400 * timeMultiplier / 7, flagged: 40 },
      { time: 'Fri', volume: 31000 * timeMultiplier / 7, flagged: 68 },
      { time: 'Sat', volume: 15200 * timeMultiplier / 7, flagged: 21 },
      { time: 'Sun', volume: 12800 * timeMultiplier / 7, flagged: 15 }
    ];
  }, [timeFilter, timeMultiplier]);

  // Chart 2: Suspicious Activity Trend
  const suspiciousTrendData = useMemo(() => {
    return [
      { point: '09:00', alerts: 4, severity: 2 },
      { point: '10:00', alerts: 18, severity: 5 },
      { point: '11:00', alerts: 12, severity: 4 },
      { point: '12:00', alerts: 5, severity: 1 },
      { point: '13:00', alerts: 3, severity: 1 },
      { point: '14:00', alerts: 7, severity: 2 }
    ];
  }, []);

  // Chart 3: Risk Distribution
  const riskDistributionData = useMemo(() => {
    const criticalCount = transactions.filter(t => t.risk === 'CRITICAL').length;
    const highCount = transactions.filter(t => t.risk === 'HIGH').length;
    const medCount = transactions.filter(t => t.risk === 'MEDIUM').length;
    const lowCount = transactions.filter(t => t.risk === 'LOW').length;

    return [
      { name: 'Low Risk', value: lowCount > 0 ? lowCount * timeMultiplier : 18500, color: '#10b981' },
      { name: 'Medium Risk', value: medCount > 0 ? medCount * timeMultiplier : 420, color: '#f59e0b' },
      { name: 'High Risk', value: highCount > 0 ? highCount * timeMultiplier : 110, color: '#f97316' },
      { name: 'Critical Risk', value: criticalCount > 0 ? criticalCount * timeMultiplier : 42, color: '#ef4444' }
    ];
  }, [transactions, timeMultiplier]);

  // Chart 4: Transaction Amount Distribution
  const amountDistributionData = useMemo(() => {
    return [
      { bracket: '< ₹1 Lakh', count: 18450 * (timeMultiplier > 1 ? timeMultiplier / 5 : 1) },
      { bracket: '₹1L - ₹10L', count: 5200 * (timeMultiplier > 1 ? timeMultiplier / 5 : 1) },
      { bracket: '₹10L - ₹50L', count: 1420 * (timeMultiplier > 1 ? timeMultiplier / 5 : 1) },
      { bracket: '> ₹50 Lakh', count: 360 * (timeMultiplier > 1 ? timeMultiplier / 5 : 1) }
    ];
  }, [timeMultiplier]);

  // Dynamic KPIs
  const totalTxDisplay = (25430 * (timeMultiplier > 1 ? timeMultiplier / 2 : 1)).toLocaleString('en-IN');
  const totalFlaggedCount = Math.max(42, engineResult.totalFlaggedTransactions);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              AML Investigation Dashboard
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
              Live Monitor
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium max-w-3xl">
            Monitor transaction activity, identify suspicious patterns and investigate connected financial networks.
          </p>
        </div>

        {/* Time Filter Controls */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-start md:self-auto">
          {(['Today', '7 Days', '30 Days', '90 Days'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === filter
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Transactions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Transactions</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            {totalTxDisplay}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% volume</span>
          </div>
        </div>

        {/* Suspicious Transactions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Suspicious Activity</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600 tracking-tight font-mono">
            {totalFlaggedCount}
          </div>
          <div className="text-[11px] font-semibold text-red-600 mt-1">
            <span>Rule Engine Flagged</span>
          </div>
        </div>

        {/* High Risk Cases */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">High Risk Cases</span>
            <Crosshair className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            11
          </div>
          <div className="text-[11px] font-semibold text-orange-600 mt-1">
            <span>3 Tier-1 Escalations</span>
          </div>
        </div>

        {/* Accounts Monitored */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Accounts Monitored</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            8,920
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            <span>Graph Indexed</span>
          </div>
        </div>

        {/* Amount Under Investigation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Under Investigation</span>
            <IndianRupee className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            ₹18.7 Cr
          </div>
          <div className="text-[11px] font-semibold text-amber-600 mt-1">
            <span>Active Hold Value</span>
          </div>
        </div>

        {/* Active Cases */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Cases</span>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            {Math.max(8, cases.length)}
          </div>
          <div className="text-[11px] font-semibold text-purple-600 mt-1">
            <span>Assigned Dossiers</span>
          </div>
        </div>

      </div>

      {/* IMPORTANT HERO CARD - The AMLens Philosophy */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Financial Intelligence Paradigm</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            &ldquo;Don&apos;t just flag suspicious transactions. Follow the money.&rdquo;
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            AMLens connects transaction data, traces suspicious money movement, explains supporting evidence and converts findings into investigation cases.
          </p>

          {/* Visual Workflow Steps */}
          <div className="mt-6 pt-6 border-t border-slate-700/60">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              End-to-End Investigation Pipeline:
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10">
                DETECT
              </span>
              <span className="text-slate-500">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10">
                CONNECT
              </span>
              <span className="text-slate-500">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10">
                TRACE
              </span>
              <span className="text-slate-500">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-500/30 text-blue-200 border border-blue-400/30">
                EXPLAIN
              </span>
              <span className="text-slate-500">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10">
                INVESTIGATE
              </span>
              <span className="text-slate-500">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                REPORT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD CHARTS (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Transaction Volume Over Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Transaction Volume vs. Flagged Ratio</h3>
              <p className="text-xs text-slate-400">Total processed wires and flagged anomalies ({timeFilter})</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Recharts Area
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#volGrad)" name="Total Volume" />
                <Area type="monotone" dataKey="flagged" stroke="#ef4444" strokeWidth={2} fillOpacity={0} name="Flagged Trans." />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Suspicious Activity Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Suspicious Activity & Velocity Trend</h3>
              <p className="text-xs text-slate-400">Chronological detection frequency spike analysis</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded">
              High Velocity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={suspiciousTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="point" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} name="Alert Frequency" />
                <Line type="monotone" dataKey="severity" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" name="Escalation Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Risk Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Risk Severity Distribution</h3>
              <p className="text-xs text-slate-400">Total transaction breakdown across four severity tiers</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Transaction Amount Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Transaction Amount Distribution</h3>
              <p className="text-xs text-slate-400">Volume by financial ticket bracket (₹ INR)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={amountDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="bracket" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* PRIORITY INVESTIGATIONS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Priority Investigations</h3>
            <p className="text-xs text-slate-500">Cases requiring urgent investigator action and statutory filing</p>
          </div>

          <button
            onClick={() => setActivePage('cases')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
          >
            <span>View All Investigation Cases ({cases.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Pattern Typology</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Accounts</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {cases.slice(0, 5).map((c) => {
                const riskBadge = getRiskBadgeClasses(c.risk);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {c.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${riskBadge.bg} ${riskBadge.border} ${riskBadge.text}`}>
                        {c.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {formatPatternLabel(c.pattern)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      {formatINR(c.amount, true)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {c.accounts.length} Accounts ({c.accounts.slice(0, 3).join(', ')}{c.accounts.length > 3 ? '…' : ''})
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                        c.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                        c.status === 'ESCALATED' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => investigateCaseById(c.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors"
                      >
                        <Crosshair className="w-3 h-3" />
                        <span>Investigate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
