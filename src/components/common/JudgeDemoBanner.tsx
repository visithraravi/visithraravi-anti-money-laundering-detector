import React from 'react';
import { useAml } from '../../context/AmlContext';
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle } from 'lucide-react';

export const JudgeDemoBanner: React.FC = () => {
  const { 
    judgeDemoActive, 
    judgeDemoStep, 
    nextJudgeStep, 
    prevJudgeStep, 
    stopJudgeDemo 
  } = useAml();

  if (!judgeDemoActive) return null;

  const stepsInfo = [
    {
      title: 'Step 1 of 11: Demo Scenario Initialized',
      desc: 'Layering Attack scenario loaded (A101 → B205 → C301 → D410 → E512). Real synthetic ledger active.'
    },
    {
      title: 'Step 2 of 11: Command Dashboard',
      desc: 'Reviewing real-time AML KPI metrics, transaction volume, and risk distribution charts.'
    },
    {
      title: 'Step 3 of 11: Priority Investigations',
      desc: 'Reviewing flagged high-risk layering cases and suspicious transaction velocity.'
    },
    {
      title: 'Step 4 of 11: Interactive Money Network',
      desc: 'Directed graph displaying connected account nodes, transaction amounts on edges, and highlighted critical path.'
    },
    {
      title: 'Step 5 of 11: Account Intelligence (A101)',
      desc: 'Inspecting originator A101 (Apex Global Horizon Ltd), shell entity characteristics, inflows, and counterparty graph.'
    },
    {
      title: 'Step 6 of 11: Investigation Workspace',
      desc: 'Opening CASE-001 in the 4-quadrant command cockpit (Summary, Graph, Timeline, AI Investigator).'
    },
    {
      title: 'Step 7 of 11: Chronological Money Flow Timeline',
      desc: 'Tracking 4-hop chain: ₹50 Lakh moved down to ₹45 Lakh across 5 accounts in just 8 minutes.'
    },
    {
      title: 'Step 8 of 11: Automated Statutory Evidence',
      desc: 'Reviewing 4 generated regulatory evidence items (Rapid Movement, Layering, High-Value breach, Shell ties).'
    },
    {
      title: 'Step 9 of 11: AI-Assisted Explainable Intelligence',
      desc: 'Generating natural language intelligence explanation answering "Why is this suspicious?" without external API dependencies.'
    },
    {
      title: 'Step 10 of 11: Case Management',
      desc: 'Reviewing all tracked cases, investigator assignments, and status transitions.'
    },
    {
      title: 'Step 11 of 11: SAR & Investigation Report',
      desc: 'Examining official printable & exportable AML investigation report with executive summary and audit trail.'
    }
  ];

  const currentInfo = stepsInfo[judgeDemoStep - 1] || stepsInfo[0];

  return (
    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-3 shadow-md sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-900 px-2 py-0.5 rounded">
                JUDGE DEMO MODE
              </span>
              <h4 className="text-sm font-semibold text-white">{currentInfo.title}</h4>
            </div>
            <p className="text-xs text-blue-100 mt-0.5 max-w-2xl">{currentInfo.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {judgeDemoStep > 1 && (
            <button
              onClick={prevJudgeStep}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Prev
            </button>
          )}

          <button
            onClick={nextJudgeStep}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white text-blue-900 hover:bg-blue-50 shadow-sm transition-all transform active:scale-95"
          >
            {judgeDemoStep === 11 ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Complete Demo
              </>
            ) : (
              <>
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <button
            onClick={stopJudgeDemo}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-1"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
