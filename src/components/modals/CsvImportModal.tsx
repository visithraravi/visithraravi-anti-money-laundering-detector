import React, { useState, useRef } from 'react';
import { useAml } from '../../context/AmlContext';
import { Transaction, RiskLevel, PatternType } from '../../types/aml';
import { X, Upload, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const { importCsvTransactions, showToast } = useAml();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadSampleCsv = () => {
    const sampleCsv = `transaction_id,from_account,to_account,amount,timestamp
TX_SAMPLE_01,ACC_100,ACC_200,5500000,10:02
TX_SAMPLE_02,ACC_200,ACC_300,5300000,10:05
TX_SAMPLE_03,ACC_300,ACC_400,5100000,10:08
TX_SAMPLE_04,ACC_400,ACC_500,4900000,10:11
TX_SAMPLE_05,SAFE_CORP,SAFE_EMP,32000,10:15
TX_SAMPLE_06,SAFE_EMP,RETAIL_STORE,4500,10:25`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'amlens_sample_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sample CSV downloaded successfully.', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setCsvText(text);
      validateAndCount(text);
    };
    reader.readAsText(file);
  };

  const validateAndCount = (rawText: string): Transaction[] | null => {
    setErrorMsg(null);
    const lines = rawText.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      setErrorMsg('CSV must contain a header line and at least one transaction row.');
      setParsedCount(null);
      return null;
    }

    const header = lines[0].toLowerCase().split(',').map(h => h.trim());
    const requiredCols = ['transaction_id', 'from_account', 'to_account', 'amount', 'timestamp'];
    const missing = requiredCols.filter(col => !header.includes(col));

    if (missing.length > 0) {
      setErrorMsg(`Invalid CSV format. Missing required columns: ${missing.join(', ')}`);
      setParsedCount(null);
      return null;
    }

    const idIdx = header.indexOf('transaction_id');
    const fromIdx = header.indexOf('from_account');
    const toIdx = header.indexOf('to_account');
    const amountIdx = header.indexOf('amount');
    const timeIdx = header.indexOf('timestamp');

    const result: Transaction[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(c => c.trim());
      if (row.length < requiredCols.length) continue;

      const txId = row[idIdx];
      const fromAcc = row[fromIdx];
      const toAcc = row[toIdx];
      const amount = parseFloat(row[amountIdx]);
      const time = row[timeIdx];

      if (!txId || !fromAcc || !toAcc || isNaN(amount)) {
        continue;
      }

      // Compute initial heuristic
      let risk: RiskLevel = 'LOW';
      let pattern: PatternType = 'NORMAL';

      if (amount >= 1000000) {
        risk = 'HIGH';
        pattern = 'HIGH_VALUE';
      }

      result.push({
        id: txId,
        fromAccount: fromAcc,
        toAccount: toAcc,
        amount,
        timestamp: time,
        date: '2026-09-18',
        risk,
        pattern,
        status: risk === 'HIGH' ? 'FLAGGED' : 'SETTLED',
        category: 'Imported CSV Stream'
      });
    }

    if (result.length === 0) {
      setErrorMsg('No valid transaction records could be parsed from the file.');
      setParsedCount(null);
      return null;
    }

    setParsedCount(result.length);
    return result;
  };

  const handleProcessImport = () => {
    const validTxs = validateAndCount(csvText);
    if (validTxs && validTxs.length > 0) {
      importCsvTransactions(validTxs);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Import Transaction CSV</h3>
              <p className="text-xs text-slate-500">Recalculate AML graph & engine detections</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Instructions Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Required CSV Header Columns:</span>
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" /> Download Sample CSV
              </button>
            </div>
            <code className="block bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
              transaction_id,from_account,to_account,amount,timestamp
            </code>
          </div>

          {/* Upload Drop Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all group"
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".csv,text/csv" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-800">
              {fileName ? fileName : 'Click or Drag CSV file here'}
            </div>
            <p className="text-xs text-slate-400 mt-1">Supports standard CSV file formats with headers</p>
          </div>

          {/* Or Paste Raw CSV text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Or Paste Raw CSV Data
            </label>
            <textarea
              rows={4}
              placeholder="transaction_id,from_account,to_account,amount,timestamp&#10;TX999,A101,B205,5000000,10:01"
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                validateAndCount(e.target.value);
              }}
              className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Validation */}
          {parsedCount !== null && parsedCount > 0 && !errorMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Validated {parsedCount} transaction records ready for network ingestion!</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!parsedCount || parsedCount === 0}
            onClick={handleProcessImport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Ingest & Run AML Engine</span>
          </button>
        </div>

      </div>
    </div>
  );
};
