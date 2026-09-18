import React, { useState } from 'react';
import { useAml } from '../context/AmlContext';
import { formatINR, formatPatternLabel, getRiskBadgeClasses } from '../logic/formatters';
import { 
  Printer, 
  Download, 
  Share2, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  Clock, 
  Check, 
  FileCheck 
} from 'lucide-react';

export const CaseReportsPage: React.FC = () => {
  const { activeCase, cases, investigateCaseById, transactions, showToast } = useAml();

  const selectedCase = activeCase || cases[0];
  const riskBadge = getRiskBadgeClasses(selectedCase.risk);

  const caseTxs = transactions.filter(t => 
    selectedCase.relatedTransactionIds.includes(t.id) ||
    (selectedCase.accounts.includes(t.fromAccount) && selectedCase.accounts.includes(t.toAccount))
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      reportId: `SAR-2026-${selectedCase.id}`,
      generatedDate: new Date().toISOString(),
      caseDetails: selectedCase,
      relatedTransactions: caseTxs,
      regulatoryNotice: 'CONFIDENTIAL // LAW ENFORCEMENT & COMPLIANCE USE ONLY'
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AMLens_SAR_Report_${selectedCase.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('SAR Report JSON exported successfully.', 'success');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Top Controls Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Regulatory Case Reports
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
              SAR / STR Generator
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Format compliant with Financial Intelligence Unit (FIU) standards and statutory filing requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Case Picker */}
          <select
            value={selectedCase.id}
            onChange={(e) => investigateCaseById(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id}: {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official SAR</span>
          </button>
        </div>
      </div>

      {/* The Printable Official Report Document Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-md print:shadow-none print:border-none print:p-0 print:rounded-none space-y-8 font-sans">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                AMLens FIU COMPLIANCE DOSSIER
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200">
                CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-lg">
              Statutory Suspicious Activity Report (SAR / STR) under Section 12, Prevention of Money Laundering Act (PMLA).
            </p>
          </div>

          <div className="text-right text-xs space-y-1 font-mono">
            <div>
              <span className="text-slate-400">Report Reference: </span>
              <strong className="text-slate-900">SAR-2026-{selectedCase.id}</strong>
            </div>
            <div>
              <span className="text-slate-400">Filing Date: </span>
              <strong className="text-slate-900">18-Sep-2026 (10:30 IST)</strong>
            </div>
            <div>
              <span className="text-slate-400">Jurisdiction: </span>
              <strong className="text-slate-900">IN / Cross-Border</strong>
            </div>
          </div>
        </div>

        {/* Case Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Dossier ID</span>
            <div className="font-mono font-bold text-blue-600 text-sm mt-0.5">{selectedCase.id}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Officer</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedCase.assignedInvestigator}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Flagged Flow</span>
            <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{formatINR(selectedCase.amount)}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Risk Classification</span>
            <div className={`font-bold text-sm mt-0.5 ${riskBadge.text}`}>{selectedCase.risk} (Tier-1)</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
            Section 1: Executive Incident Summary
          </h3>
          <h2 className="text-lg font-bold text-slate-900">{selectedCase.title}</h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            The AMLens Automated Rule & Topological Surveillance Engine has flagged a high-velocity fund routing network initiated by primary entity <strong>{selectedCase.primaryAccount}</strong>. The activity exhibits structured characteristics of multi-hop layering through corporate shell structures with zero verifiable operational overhead or commercial justification. Over the monitoring window, funds aggregating to <strong>{formatINR(selectedCase.amount)}</strong> were sequentially transferred through 4 intermediate accounts in under 10 minutes.
          </p>
        </div>

        {/* Section 2: Chronological Money Trail Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
            Section 2: Forensic Transaction Flow Evidence
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Seq</th>
                  <th className="py-2.5 px-3">Tx Identifier</th>
                  <th className="py-2.5 px-3">Remitter Account</th>
                  <th className="py-2.5 px-3">Beneficiary Account</th>
                  <th className="py-2.5 px-3">Amount (INR)</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {caseTxs.map((tx, idx) => (
                  <tr key={tx.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{tx.id}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{tx.fromAccount}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{tx.toAccount}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{formatINR(tx.amount)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{tx.timestamp}</td>
                    <td className="py-2.5 px-3 text-slate-600">{formatPatternLabel(tx.pattern)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Verified Supporting Indicators */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
            Section 3: Verified Typology Indicators & Red Flags
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedCase.evidence.map((ev: any) => (
              <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{ev.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-5">{ev.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Recommended Statutory Directives */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
            Section 4: Actionable Compliance Directives
          </h3>
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl text-xs space-y-2 text-red-900">
            <div className="font-bold flex items-center gap-1.5 text-red-800">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Mandatory Statutory Recommendations:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              <li>Issue emergency debit freeze order against accounts B205, C301, and D410 under PMLA provisions.</li>
              <li>Issue notice under Section 50 of PMLA to corporate directors of registered shell entities.</li>
              <li>Dispatch cross-border mutual legal assistance treaty (MLAT) inquiry regarding beneficiary E512 (Dubai jurisdiction).</li>
              <li>Forward unredacted digital audit trail to the Enforcement Directorate (ED) cyber forensics wing.</li>
            </ul>
          </div>
        </div>

        {/* Section 5: Signature & Verification Block */}
        <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          <div className="space-y-1 text-slate-500">
            <div><strong>Digitally Signed By:</strong> AMLens Cryptographic Verification Authority</div>
            <div><strong>Hash Digest:</strong> SHA-256: 7f8a9e2d1c4b5a6f0e3d2c1b9a8f7e6d</div>
            <div><strong>Verification URI:</strong> https://amlens.internal/verify/SAR-2026-{selectedCase.id}</div>
          </div>

          <div className="text-right space-y-2">
            <div className="font-serif italic text-base text-slate-800 underline">
              V. Ravi, CAMS
            </div>
            <div className="font-bold text-slate-900">V. Ravi, CAMS</div>
            <div className="text-slate-500">Senior Financial Intelligence Investigator</div>
          </div>
        </div>

      </div>

    </div>
  );
};
