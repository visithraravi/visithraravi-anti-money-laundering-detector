import React from 'react';
import { useAml } from '../../context/AmlContext';
import { PageId } from '../../types/aml';
import { 
  LayoutDashboard, 
  Activity, 
  Network, 
  Briefcase, 
  Crosshair, 
  Sparkles, 
  FileText, 
  PlayCircle, 
  Settings,
  Shield,
  Eye,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, cases } = useAml();

  const openCasesCount = cases.filter(c => c.status === 'OPEN').length;

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transaction Monitor', icon: <Activity className="w-4 h-4" /> },
    { id: 'network', label: 'Money Network', icon: <Network className="w-4 h-4" />, badge: 'Graph' },
    { id: 'cases', label: 'Suspicious Cases', icon: <Briefcase className="w-4 h-4" />, badge: openCasesCount },
    { id: 'investigation', label: 'Investigation', icon: <Crosshair className="w-4 h-4" />, badge: 'Cockpit' },
    { id: 'ai-investigator', label: 'AI Investigator', icon: <Sparkles className="w-4 h-4 text-blue-600" /> },
    { id: 'reports', label: 'Case Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'scenarios', label: 'Demo Scenarios', icon: <PlayCircle className="w-4 h-4 text-indigo-600" />, badge: 'Live' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none min-h-screen no-print">
      <div>
        {/* Logo Section */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <div className="relative">
                <Shield className="w-6 h-6 text-white" />
                <Eye className="w-3 h-3 text-amber-300 absolute top-1.5 left-1.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">AMLens</h1>
                <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  FC-02
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1 leading-tight">
                Follow the Money. Explain the Risk.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Environment Status */}
      <div className="p-4 border-t border-slate-100 m-3 bg-slate-50 rounded-2xl border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Demo Environment
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>System Online</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 leading-snug">
          Rule-Based Detection Engine Active. Realistic synthetic banking ledger.
        </div>
      </div>
    </aside>
  );
};
