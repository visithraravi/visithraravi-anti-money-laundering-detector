import React, { useState } from 'react';
import { useAml } from '../context/AmlContext';
import { formatINR } from '../logic/formatters';
import { AmlSettings } from '../types/aml';
import { 
  Settings, 
  Sliders, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Server, 
  Cpu, 
  Database 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData, showToast } = useAml();

  const [formSettings, setFormSettings] = useState<AmlSettings>({ ...settings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
  };

  const handleResetDefaults = () => {
    const defaultSettings: AmlSettings = {
      highValueThreshold: 1000000,
      rapidMovementWindowMinutes: 10,
      minLayeringHops: 3,
      alertOnCircularFlow: true,
      rapidTransferWindowMinutes: 10,
      amountMatchingPercentage: 90,
      circularTransferDepthHops: 4,
      enableAutoSarGeneration: true,
      strictShellProfiling: true,
    };
    setFormSettings(defaultSettings);
    updateSettings(defaultSettings);
    showToast('Detection thresholds reset to default baseline.', 'info');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Surveillance Engine Settings
            </h1>
            <span className="text-xs bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded uppercase">
              Rule Config
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Tune real-time detection thresholds, graph traversal depths, and automated audit triggers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Detection Engine Tuning Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Algorithmic Detection Thresholds</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifying these thresholds immediately re-evaluates the transaction ledger and recalculates risk scores.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Rapid Transfer Window */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Rapid Movement Window (Minutes)
                </label>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {formSettings.rapidTransferWindowMinutes} min
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={60}
                step={1}
                value={formSettings.rapidTransferWindowMinutes}
                onChange={(e) => setFormSettings(s => ({ ...s, rapidTransferWindowMinutes: parseInt(e.target.value) }))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Window within which sequential transfers trigger velocity alerts.
              </p>
            </div>

            {/* Amount Matching Percentage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Pass-Through Matching Ratio
                </label>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {formSettings.amountMatchingPercentage}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={99}
                step={1}
                value={formSettings.amountMatchingPercentage}
                onChange={(e) => setFormSettings(s => ({ ...s, amountMatchingPercentage: parseInt(e.target.value) }))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Minimum percentage of inbound funds pushed out to flag layering.
              </p>
            </div>

            {/* Circular Depth */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Circular Cycle Max Hop Depth
                </label>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {formSettings.circularTransferDepthHops} Hops
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={8}
                step={1}
                value={formSettings.circularTransferDepthHops}
                onChange={(e) => setFormSettings(s => ({ ...s, circularTransferDepthHops: parseInt(e.target.value) }))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Maximum search depth for loopback cycles in money movement paths.
              </p>
            </div>

            {/* High Value Alert Threshold */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Statutory High-Value Threshold
                </label>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {formatINR(formSettings.highValueThreshold)}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={10000000}
                step={100000}
                value={formSettings.highValueThreshold}
                onChange={(e) => setFormSettings(s => ({ ...s, highValueThreshold: parseInt(e.target.value) }))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Mandatory alert threshold for single-transaction compliance review.
              </p>
            </div>

          </div>

          {/* Feature Toggles */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Auto-Generate SAR on Critical Severity</div>
                <div className="text-[11px] text-slate-400">Pre-compile regulatory draft when risk score exceeds 90%</div>
              </div>
              <input
                type="checkbox"
                checked={formSettings.enableAutoSarGeneration}
                onChange={(e) => setFormSettings(s => ({ ...s, enableAutoSarGeneration: e.target.checked }))}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Strict Shell Company Profiling</div>
                <div className="text-[11px] text-slate-400">Enforce FATF 6-point red flag criteria on accounts under 180 days</div>
              </div>
              <input
                type="checkbox"
                checked={formSettings.strictShellProfiling}
                onChange={(e) => setFormSettings(s => ({ ...s, strictShellProfiling: e.target.checked }))}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply & Re-evaluate Engine</span>
            </button>
          </div>

        </div>

      </form>

      {/* System Engine Health & Diagnostics */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Server className="w-4 h-4 text-slate-500" />
          <span>Engine Architecture & Active Diagnostics</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Detection Engine</span>
            <div className="font-bold text-slate-800 mt-0.5">AMLens RuleEngine v2.4</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Active & Reactive</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Graph Pipeline</span>
            <div className="font-bold text-slate-800 mt-0.5">Directed Multi-Hop Index</div>
            <span className="text-[10px] text-blue-600 font-semibold">Sub-second Latency</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Data Storage</span>
            <div className="font-bold text-slate-800 mt-0.5">Client-Side Synced LocalStorage</div>
            <span className="text-[10px] text-slate-500 font-semibold">Persistent State</span>
          </div>
        </div>

        {/* Danger Zone: Reset All Data */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800">Restore Clean Hackathon Data</span>
            <p className="text-[11px] text-slate-400">Purge local state and restore clean initial demo cases and transactions.</p>
          </div>

          <button
            type="button"
            onClick={resetAllData}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-colors"
          >
            Reset Demo Environment
          </button>
        </div>
      </div>

    </div>
  );
};
