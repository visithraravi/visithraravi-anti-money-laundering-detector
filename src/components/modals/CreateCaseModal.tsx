import React, { useState } from 'react';
import { useAml } from '../../context/AmlContext';
import { RiskLevel, PatternType } from '../../types/aml';
import { X, FolderPlus, ShieldAlert, Check } from 'lucide-react';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ isOpen, onClose }) => {
  const { createCase, accounts, setActivePage } = useAml();

  const [title, setTitle] = useState('');
  const [risk, setRisk] = useState<RiskLevel>('HIGH');
  const [pattern, setPattern] = useState<PatternType>('POSSIBLE_LAYERING');
  const [primaryAccount, setPrimaryAccount] = useState('A101');
  const [amount, setAmount] = useState('4500000');
  const [description, setDescription] = useState('');
  const [assignedInvestigator, setAssignedInvestigator] = useState('Senior Analyst V. Ravi');
  const [accountsInvolved, setAccountsInvolved] = useState('A101, B205, C301');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedAccounts = accountsInvolved
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const parsedAmount = parseFloat(amount) || 1000000;

    createCase({
      title,
      risk,
      pattern,
      primaryAccount: primaryAccount.trim().toUpperCase(),
      amount: parsedAmount,
      accounts: parsedAccounts.length > 0 ? parsedAccounts : [primaryAccount],
      status: 'OPEN',
      assignedInvestigator,
      description: description || `Formal AML investigation into ${pattern} pattern.`,
      evidence: [],
      timeline: [],
      relatedTransactionIds: []
    });

    onClose();
    setActivePage('cases');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Create Investigation Case</h3>
              <p className="text-xs text-slate-500">Initiate formal AML dossier with supporting evidence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Case Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Cross-border Structuring & Offshore Layering"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Risk Classification
              </label>
              <select
                value={risk}
                onChange={e => setRisk(e.target.value as RiskLevel)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="CRITICAL">CRITICAL (Tier 1 Escalation)</option>
                <option value="HIGH">HIGH (Immediate Review)</option>
                <option value="MEDIUM">MEDIUM (Standard Monitor)</option>
                <option value="LOW">LOW (Informational)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Detected Pattern Typology
              </label>
              <select
                value={pattern}
                onChange={e => setPattern(e.target.value as PatternType)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="POSSIBLE_LAYERING">Possible Layering</option>
                <option value="RAPID_MOVEMENT">Rapid Movement</option>
                <option value="CIRCULAR_TRANSFER">Circular Transfer</option>
                <option value="HIGH_VALUE">High Value Alert</option>
                <option value="UNUSUAL_RELATIONSHIP">Unusual Relationship</option>
                <option value="SPLIT_TRANSACTIONS">Structuring / Smurfing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Primary Account ID
              </label>
              <input
                type="text"
                required
                value={primaryAccount}
                onChange={e => setPrimaryAccount(e.target.value)}
                placeholder="A101"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Total Amount Under Review (₹)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Connected Accounts Involved (Comma separated)
            </label>
            <input
              type="text"
              value={accountsInvolved}
              onChange={e => setAccountsInvolved(e.target.value)}
              placeholder="A101, B205, C301, D410"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Case Narrative & Hypotheses
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detail observations, initial source of suspicion, and entity relationships..."
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Assigned Investigator
            </label>
            <input
              type="text"
              value={assignedInvestigator}
              onChange={e => setAssignedInvestigator(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Register Case</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
