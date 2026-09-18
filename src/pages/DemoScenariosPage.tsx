import React from 'react';
import { useAml } from '../context/AmlContext';
import { formatINR } from '../logic/formatters';
import { 
  PlayCircle, 
  Sparkles, 
  Network, 
  Crosshair, 
  RotateCw, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Layers,
  Repeat,
  AlertTriangle
} from 'lucide-react';

export const DemoScenariosPage: React.FC = () => {
  const { 
    loadScenario, 
    startJudgeDemo, 
    investigateCaseById, 
    traceTransactionFlow, 
    transactions,
    setActivePage 
  } = useAml();

  const scenarios = [
    {
      id: 'SCENARIO_1',
      badge: 'RECOMMENDED FOR JUDGES',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      title: 'Scenario 1: Layering through Shell Companies',
      pattern: 'POSSIBLE_LAYERING',
      amount: '₹50,00,000',
      entities: 'A101 ➔ B205 ➔ C301 ➔ D410 ➔ E512',
      duration: '8 Minutes Total',
      description: 'High-value funds routed through 4 newly incorporated shell entities in rapid sequence with incremental fee cuts before offshore remittance.',
      keyEvidence: [
        'Rapid movement across 4 hops within 8 minutes',
        'Accounts B205, C301, D410 are under 4 months old',
        'Small 2-4% transit commissions deducted at each hop',
        'Zero legitimate commercial payroll or operational overhead'
      ],
      caseId: 'CASE-001',
      icon: <Layers className="w-5 h-5 text-red-600" />,
      txId: 'T001'
    },
    {
      id: 'SCENARIO_2',
      badge: 'HIGH VELOCITY',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'Scenario 2: Rapid Fund Movement (Smurfing)',
      pattern: 'RAPID_MOVEMENT',
      amount: '₹82,00,000',
      entities: 'M101 ➔ M202, M303, M404',
      duration: '5 Minutes Total',
      description: 'A massive corporate inbound remittance is immediately split and pushed out across three subsidiary accounts to evade threshold reporting limits.',
      keyEvidence: [
        'Single large inflow split into sub-threshold tranches',
        'Immediate outgoing wires executed within 180 seconds',
        'Accounts have no prior transaction history together'
      ],
      caseId: 'CASE-002',
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      txId: 'T020'
    },
    {
      id: 'SCENARIO_3',
      badge: 'ROUND-TRIPPING',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      title: 'Scenario 3: Circular Transfer Ring',
      pattern: 'CIRCULAR_TRANSFER',
      amount: '₹1,20,00,000',
      entities: 'P100 ➔ Q200 ➔ R300 ➔ P100',
      duration: '45 Minutes Total',
      description: 'Funds loop through three distinct companies before returning to the original sender to artificially inflate corporate transaction turnover.',
      keyEvidence: [
        'Closed-loop cycle with net zero economic purpose',
        'Round-trip completed within the same banking business day',
        'Entities share common corporate secretarial directors'
      ],
      caseId: 'CASE-003',
      icon: <Repeat className="w-5 h-5 text-orange-600" />,
      txId: 'T015'
    },
    {
      id: 'SCENARIO_4',
      badge: 'ANOMALY SURGE',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Scenario 4: High-Value Anomaly Surge',
      pattern: 'HIGH_VALUE',
      amount: '₹1,50,00,000',
      entities: 'X900 ➔ Y901',
      duration: 'Instantaneous Wire',
      description: 'Dormant account with negligible historical turnover suddenly receives and forwards an unprecedented ₹1.5 Crore international wire.',
      keyEvidence: [
        'Exceeds account 12-month average balance by 2,400%',
        'Counterparty in known tax-haven jurisdiction',
        'Triggered statutory mandatory FIU STR threshold'
      ],
      caseId: 'CASE-001',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      txId: 'T008'
    }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Interactive Demo Scenarios
            </h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded uppercase">
              Judge Playground
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Preloaded real-world financial crime typologies configured for instant live judging demonstration.
          </p>
        </div>

        <button
          onClick={startJudgeDemo}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>START GUIDED JUDGE WALKTHROUGH</span>
        </button>
      </div>

      {/* Presentation Guide Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Hackathon Evaluation Focus</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Legacy AML systems generate 95% false positives because they evaluate single transactions in isolation. 
          <strong> AMLens evaluates entire financial graphs</strong>—connecting counterparties, detecting high-velocity transit chains, and explaining why an alert is dangerous with forensic evidence.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map(sc => (
          <div 
            key={sc.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3">
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${sc.badgeColor}`}>
                  {sc.badge}
                </span>
                <span className="font-mono text-sm font-black text-slate-900">
                  {sc.amount}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                  {sc.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sc.title}
                  </h3>
                  <div className="font-mono text-xs font-bold text-slate-700 mt-1">
                    {sc.entities}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {sc.description}
              </p>

              {/* Key Evidence Points */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[10px] font-bold uppercase text-slate-400">
                  Forensic Highlights & Heuristics:
                </div>
                {sc.keyEvidence.map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  loadScenario(sc.id as any);
                  const targetTx = transactions.find(t => t.id === sc.txId);
                  if (targetTx) traceTransactionFlow(targetTx);
                  else setActivePage('network');
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Load & Trace Graph</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    loadScenario(sc.id as any);
                    investigateCaseById(sc.caseId);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Investigate</span>
                </button>

                <button
                  onClick={() => {
                    loadScenario(sc.id as any);
                    setActivePage('ai-investigator');
                  }}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Explain</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
