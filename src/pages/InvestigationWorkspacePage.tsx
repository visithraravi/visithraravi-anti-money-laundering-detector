import React, { useState } from 'react';
import { useAml } from '../context/AmlContext';
import { formatINR, formatPatternLabel, getRiskBadgeClasses } from '../logic/formatters';
import { CaseStatus } from '../types/aml';
import { 
  Crosshair, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Network, 
  AlertTriangle,
  Send,
  UserCheck,
  Building,
  CheckSquare,
  Square,
  MessageSquare
} from 'lucide-react';

export const InvestigationWorkspacePage: React.FC = () => {
  const { 
    activeCase, 
    cases, 
    investigateCaseById, 
    updateCaseStatus, 
    addEvidenceToCase, 
    addNoteToCase, 
    traceTransactionFlow, 
    transactions,
    setActivePage,
    showToast
  } = useAml();

  // New Note state
  const [newNote, setNewNote] = useState('');
  // New Evidence state
  const [newEvidenceText, setNewEvidenceText] = useState('');
  const [showAddEvidence, setShowAddEvidence] = useState(false);

  if (!activeCase) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">No Case Currently Selected</h2>
        <p className="text-xs text-slate-500">
          Select an active AML investigation dossier from the cases directory or priority dashboard.
        </p>
        <button
          onClick={() => investigateCaseById('CASE-001')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700"
        >
          Load Flagged Case-001 (Layering)
        </button>
      </div>
    );
  }

  const riskBadge = getRiskBadgeClasses(activeCase.risk);

  // Filter transactions related to this case
  const caseTransactions = transactions.filter(t => 
    activeCase.relatedTransactionIds.includes(t.id) ||
    (activeCase.accounts.includes(t.fromAccount) && activeCase.accounts.includes(t.toAccount))
  );

  const handleStatusChange = (newStatus: CaseStatus) => {
    updateCaseStatus(activeCase.id, newStatus);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNoteToCase(activeCase.id, newNote.trim());
    setNewNote('');
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceText.trim()) return;
    addEvidenceToCase(activeCase.id, {
      title: newEvidenceText.trim(),
      description: 'Logged by Senior AML Investigator during active review.',
      confidence: 0.95,
      severity: 'HIGH'
    });
    setNewEvidenceText('');
    setShowAddEvidence(false);
  };

  const handleTraceAllInNetwork = () => {
    if (caseTransactions.length > 0) {
      traceTransactionFlow(caseTransactions[0]);
    } else {
      setActivePage('network');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & Case Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Active Case Dossier:</span>
          <select
            value={activeCase.id}
            onChange={(e) => investigateCaseById(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-blue-600 focus:outline-none"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title} ({c.risk})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('ai-investigator')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Investigator Explanation</span>
          </button>
          
          <button
            onClick={() => setActivePage('reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate SAR Report</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {activeCase.id}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${riskBadge.bg} ${riskBadge.border} ${riskBadge.text}`}>
                {activeCase.risk}
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                {formatPatternLabel(activeCase.pattern)}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeCase.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {activeCase.description}
            </p>
          </div>

          {/* Status Switcher */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase">
              Case Status Lifecycle
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['OPEN', 'UNDER_REVIEW', 'ESCALATED', 'RESOLVED'] as CaseStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeCase.status === st
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Assigned: <strong>{activeCase.assignedInvestigator}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Flagged Amount</span>
            <div className="text-base font-black text-slate-900 font-mono mt-0.5">
              {formatINR(activeCase.amount)}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Originator</span>
            <div className="text-base font-black text-blue-600 font-mono mt-0.5">
              {activeCase.primaryAccount}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Entity Cluster</span>
            <div className="text-base font-black text-slate-900 font-mono mt-0.5">
              {activeCase.accounts.length} Accounts
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Verified Evidence</span>
            <div className="text-base font-black text-emerald-600 font-mono mt-0.5">
              {activeCase.evidence.length} Indicators
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Transaction Trail & Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Transaction Trail */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Connected Money Flow Trail</h3>
                <p className="text-xs text-slate-400">Sequential fund transfers matching detected layering chain</p>
              </div>

              <button
                onClick={handleTraceAllInNetwork}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Trace In Graph</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Hop</th>
                    <th className="py-2.5 px-3">Tx ID</th>
                    <th className="py-2.5 px-3">Route (From ➔ To)</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {caseTransactions.map((tx, idx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-400 font-mono">
                        #{idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                        {tx.id}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className="font-bold text-slate-900">{tx.fromAccount}</span>
                        <span className="text-slate-400 mx-1">➔</span>
                        <span className="font-bold text-slate-900">{tx.toAccount}</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold font-mono text-slate-900">
                        {formatINR(tx.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">
                        {tx.timestamp}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {tx.category || 'Wire Transfer'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Verified chronological flow sequence: <strong>A101 ➔ B205 ➔ C301 ➔ D410 ➔ E512</strong></span>
            <span className="font-mono text-slate-700 font-bold">Velocity: 8 Minutes Total</span>
          </div>
        </div>

        {/* Right 1 Col: Supporting Evidence Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Supporting Evidence</h3>
              <p className="text-xs text-slate-400">Audited indicators supporting risk level</p>
            </div>

            <button
              onClick={() => setShowAddEvidence(!showAddEvidence)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Add Evidence"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Evidence Input */}
          {showAddEvidence && (
            <form onSubmit={handleAddEvidence} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <input
                type="text"
                placeholder="Enter new evidence observation..."
                value={newEvidenceText}
                onChange={e => setNewEvidenceText(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddEvidence(false)}
                  className="px-2 py-1 text-[11px] font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg"
                >
                  Save Evidence
                </button>
              </div>
            </form>
          )}

          {/* Evidence List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {activeCase.evidence.map((ev: any) => (
              <div 
                key={ev.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{ev.title}</span>
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    ev.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    ev.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {ev.severity}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] pl-5">
                  {ev.description}
                </p>
                <div className="pl-5 text-[10px] font-mono text-slate-400">
                  Confidence Score: {((ev.confidence || 0.9) * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Grid: Timeline & Investigator Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Case Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chronological Case Timeline</h3>
              <p className="text-xs text-slate-400">Audit trail of transactions, alerts, and investigator interventions</p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activeCase.timeline.map((event: any, idx: number) => (
              <div key={event.id || idx} className="relative group">
                {/* Node Bullet */}
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{event.event || event.description}</span>
                    <span className="font-mono text-[11px] text-slate-400">{event.timestamp || event.time}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{event.description}</p>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                    Actor: {event.actor || 'System Engine'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Investigator Notes & Audit Log */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Investigator Audit Notes</h3>
                <p className="text-xs text-slate-400">Official log recorded by case handlers and review officers</p>
              </div>
              <MessageSquare className="w-4 h-4 text-slate-400" />
            </div>

            {/* Existing Notes List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 mb-4">
              {(!activeCase.notes || activeCase.notes.length === 0) ? (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-400 text-center italic">
                  No investigator notes logged yet. Use the form below to record case observations.
                </div>
              ) : (
                activeCase.notes.map((note: any) => (
                  <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-700 text-[11px] mb-1">
                      <span>{note.author}</span>
                      <span className="font-mono text-slate-400">{note.timestamp}</span>
                    </div>
                    <p className="text-slate-800">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New Note Form */}
          <form onSubmit={handleSaveNote} className="space-y-2 pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Add New Case Note
            </label>
            <textarea
              rows={2}
              placeholder="Record forensic observation, subpoena status, or entity intelligence..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400">
                Timestamped and signed as {activeCase.assignedInvestigator}
              </span>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

        </div>

      </div>

      {/* Case Action Footer */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange('ESCALATED')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Escalate to Compliance Lead</span>
          </button>

          <button
            onClick={() => handleStatusChange('RESOLVED')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Case Resolved</span>
          </button>
        </div>

        <button
          onClick={() => setActivePage('reports')}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export Formal Case Report (PDF/Print)</span>
        </button>
      </div>

    </div>
  );
};
