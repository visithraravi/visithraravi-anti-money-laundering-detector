import React, { useState } from 'react';
import { useAml } from '../context/AmlContext';
import { formatINR } from '../logic/formatters';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Bot, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase,
  FileText
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiInvestigatorPage: React.FC = () => {
  const { activeCase, addNoteToCase, showToast, setActivePage } = useAml();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      timestamp: '10:15 AM',
      text: `Hello Investigator. I am the AMLens Cognitive Intelligence Agent. I have ingested the current transaction graph, account intelligence dossiers, and rule-engine detections. 

Currently analyzing: **${activeCase?.id || 'CASE-001'} - ${activeCase?.title || 'Suspected Multi-Layer Money Routing'}**

Select a preset question below or type your custom query to receive an explainable forensic breakdown.`
    },
    {
      id: 'msg-2',
      sender: 'user',
      timestamp: '10:16 AM',
      text: 'Explain why this case is suspicious.'
    },
    {
      id: 'msg-3',
      sender: 'ai',
      timestamp: '10:16 AM',
      text: `### AML Risk Assessment & Evidence Synthesis:

1. **Detected Typology: Multi-Hop Shell Layering**
   - **Primary Money Trail:** \`A101 ➔ B205 ➔ C301 ➔ D410 ➔ E512\`
   - **Total Transferred Amount:** ₹50,00,000 initiated by A101, dispersing down to ₹45,00,000 at E512.

2. **Unusual Velocity (Time Compression)**
   - All 4 sequential hops occurred within **8 minutes** (10:01 AM to 10:09 AM).
   - In standard corporate commercial settlements, inter-firm reconciliations take hours or days; immediate pass-through indicates automated laundering scripts.

3. **Value Attrition Pattern (Transit Fee Deductions)**
   - \`A101 ➔ B205\`: ₹50,00,000
   - \`B205 ➔ C301\`: ₹48,00,000 (₹2L retained / 4%)
   - \`C301 ➔ D410\`: ₹47,00,000 (₹1L retained / 2%)
   - \`D410 ➔ E512\`: ₹45,00,000 (₹2L retained / 4%)
   - This progressive decrement is the classic fingerprint of **layering commissions** paid to intermediary mule accounts.

4. **Entity Profile Discrepancy**
   - Accounts **B205, C301, and D410** were incorporated less than 4 months ago, maintain near-zero resting balances (< ₹20,000), and exhibit zero legitimate payroll, tax, or operational overhead transactions.

**Statutory Conclusion:** High-confidence structuring & integration effort. Tier-1 escalation warranted.`
    }
  ]);

  const presetQueries = [
    'Explain why this case is suspicious',
    'Show the money trail',
    'Which accounts should be frozen?',
    'Generate suspicious activity summary',
    'What are the shell company indicators?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent AI response based on query keywords
    setTimeout(() => {
      let aiReply = '';
      const q = text.toLowerCase();

      if (q.includes('freeze') || q.includes('frozen') || q.includes('action')) {
        aiReply = `### Urgent Account Freezing Recommendations:

Based on graph centrality, rapid dispersal vectors, and entity risk scoring, the following immediate statutory freeze orders are recommended:

1. **CRITICAL - Account B205 (Apex Global Trading FZE):**
   - *Reason:* Primary pass-through conduit. High flight risk of residual ₹2,00,000 transit commission.
   - *Action:* Full debit freeze under Section 12 PMLA / FinCEN Urgent Directive.

2. **CRITICAL - Account C301 (Horizon Matrix Logistics):**
   - *Reason:* Intermediary shell company with zero commercial footprint.
   - *Action:* Full debit freeze & subpoena of KYC/beneficial ownership records.

3. **HIGH - Account D410 (Zephyr FinTech Services):**
   - *Reason:* Secondary hop before terminal integration.
   - *Action:* Debit freeze on outgoing transfers pending enhanced due diligence (EDD).

4. **Beneficiary Account E512 (Silverline Holdings Ltd - Dubai):**
   - *Action:* Issue cross-border FIU notification to foreign jurisdiction compliance counterparty.`;
      } else if (q.includes('trail') || q.includes('flow')) {
        aiReply = `### Complete Money Trail Breakdown:

\`\`\`
[HOP 1] 10:01 AM | TX: T001
Originator: A101 (Nexus Enterprises)
Beneficiary: B205 (Apex Global Trading)
Amount: ₹50,00,000 | Fee: 0%

[HOP 2] 10:04 AM | TX: T002 (+3 min)
Originator: B205 (Apex Global Trading)
Beneficiary: C301 (Horizon Matrix)
Amount: ₹48,00,000 | Fee: ₹2,00,000

[HOP 3] 10:07 AM | TX: T003 (+3 min)
Originator: C301 (Horizon Matrix)
Beneficiary: D410 (Zephyr FinTech)
Amount: ₹47,00,000 | Fee: ₹1,00,000

[HOP 4] 10:09 AM | TX: T004 (+2 min)
Originator: D410 (Zephyr FinTech)
Beneficiary: E512 (Silverline Holdings)
Amount: ₹45,00,000 | Fee: ₹2,00,000
\`\`\`

**Total Trail Duration:** 8 minutes.
**Total Funds Layered:** ₹50 Lakh.`;
      } else if (q.includes('shell') || q.includes('indicators')) {
        aiReply = `### Forensic Shell Company Indicators:

The entities involved in this cluster match **6 out of 6 FATF Red Flags** for corporate shell layering:
1. **Recent Incorporation:** Registered within 90-120 days prior to multi-crore transfer bursts.
2. **Minimal Operating Balance:** Average monthly ledger balance before fund arrival was under ₹15,000.
3. **Turnover-to-Payroll Ratio:** Zero regular salary, vendor, rent, or GST compliance outflows.
4. **Pass-Through Velocity:** Funds arrive via RTGS and are re-routed within 180 seconds.
5. **Common Directorship/IPs:** Shared registration agent and registered office addresses across accounts B205 and C301.`;
      } else if (q.includes('summary') || q.includes('sar')) {
        aiReply = `### Executive Suspicious Activity Summary (STR / SAR Ready):

- **Subject Entity:** Nexus Enterprises (A101) in conspiracy with Apex Global Trading (B205), Horizon Matrix (C301), and Zephyr FinTech (D410).
- **Incident Period:** 18 September 2026 (10:01 - 10:09 AM IST).
- **Aggregate Value:** ₹50,00,000 (Fifty Lakhs Indian Rupees).
- **Modus Operandi:** Structuring and high-velocity layering through series of unverified commercial accounts to obscure source of funds before offshore remittance to Silverline Holdings (E512).
- **Regulatory Assessment:** High probability of money laundering under Section 3 & 4 of Prevention of Money Laundering Act (PMLA). Immediate referral to Enforcement Directorate (ED) recommended.`;
      } else {
        aiReply = `### Forensic Assessment for "${text}":

- **Risk Severity:** CRITICAL (Score: 94/100).
- **Direct Linkages:** 5 interconnected accounts in transaction sequence.
- **AI Observation:** Transaction behavior deviates by 4.8 standard deviations from the peer baseline for registered SME accounts.
- **Evidence Integrity:** Rule detection engine confirms rapid pass-through heuristics with 98% confidence score.`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiReply
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const handleCopyAiSummaryToNotes = (text: string) => {
    if (activeCase) {
      addNoteToCase(activeCase.id, `[AI INVESTIGATOR SUMMARY]:\n${text}`);
      showToast('AI assessment successfully copied to Case Audit Notes!', 'success');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span>AI AML Investigator</span>
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
              Explainable AI
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Generate explainable AI risk assessments, pattern summaries and natural language analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('investigation')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Case: {activeCase?.id || 'CASE-001'}</span>
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Suggested Forensic Queries:
        </div>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(query)}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-98"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[540px]">
        
        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`font-bold text-[11px] ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-900'}`}>
                    {msg.sender === 'user' ? 'Senior Investigator' : 'AMLens AI Intelligence Engine'}
                  </span>
                  <span className={`text-[10px] font-mono ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Copy to notes button on AI responses */}
                {msg.sender === 'ai' && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end">
                    <button
                      onClick={() => handleCopyAiSummaryToNotes(msg.text)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy AI Summary to Case Notes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AMLens AI (e.g., 'What is the commercial rationale of transfer T003?', 'Draft regulatory STR narrative')..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
            />

            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
