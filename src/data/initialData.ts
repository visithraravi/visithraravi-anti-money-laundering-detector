import { Transaction, AccountInfo, InvestigationCase, AmlSettings } from '../types/aml';

export const DEFAULT_SETTINGS: AmlSettings = {
  highValueThreshold: 1000000, // ₹10,00,000
  rapidMovementWindowMinutes: 10,
  minLayeringHops: 3,
  alertOnCircularFlow: true,
  rapidTransferWindowMinutes: 10,
  amountMatchingPercentage: 90,
  circularTransferDepthHops: 4,
  enableAutoSarGeneration: true,
  strictShellProfiling: true,
};

export const INITIAL_ACCOUNTS: AccountInfo[] = [
  {
    id: 'A101',
    name: 'Apex Global Horizon Ltd',
    type: 'SHELL_COMPANY',
    risk: 'CRITICAL',
    ageMonths: 4,
    totalInflow: 5000000,
    totalOutflow: 5000000,
    transactionCount: 2,
    firstSeen: '2026-09-18 10:00',
    lastSeen: '2026-09-18 10:01',
    connectedAccounts: ['B205'],
    riskIndicators: [
      'Originator of rapid layering chain',
      'Recently incorporated entity with high initial turnover',
      'No established tax or commercial footprint'
    ],
    jurisdiction: 'Panama / Offshore',
    balance: 150000
  },
  {
    id: 'B205',
    name: 'Bluefin Logistics Private Ltd',
    type: 'SHELL_COMPANY',
    risk: 'CRITICAL',
    ageMonths: 6,
    totalInflow: 5000000,
    totalOutflow: 4800000,
    transactionCount: 3,
    firstSeen: '2026-09-18 10:01',
    lastSeen: '2026-09-18 10:04',
    connectedAccounts: ['A101', 'C301'],
    riskIndicators: [
      'Received high-value funds (₹50,00,000)',
      'Rapidly transferred funds out in 3 minutes',
      'Pass-through transit account behavior (fee retained: ₹2,00,000)'
    ],
    jurisdiction: 'Mumbai, India',
    balance: 200000
  },
  {
    id: 'C301',
    name: 'CloudPeak Digital Ventures',
    type: 'SHELL_COMPANY',
    risk: 'CRITICAL',
    ageMonths: 3,
    totalInflow: 4800000,
    totalOutflow: 4700000,
    transactionCount: 3,
    firstSeen: '2026-09-18 10:04',
    lastSeen: '2026-09-18 10:07',
    connectedAccounts: ['B205', 'D410'],
    riskIndicators: [
      'Intermediate layering hub',
      'Turnaround latency under 3 minutes',
      'Virtual office registered address'
    ],
    jurisdiction: 'Singapore',
    balance: 100000
  },
  {
    id: 'D410',
    name: 'Delta Horizon Consulting',
    type: 'SHELL_COMPANY',
    risk: 'CRITICAL',
    ageMonths: 5,
    totalInflow: 4700000,
    totalOutflow: 4500000,
    transactionCount: 3,
    firstSeen: '2026-09-18 10:07',
    lastSeen: '2026-09-18 10:09',
    connectedAccounts: ['C301', 'E512'],
    riskIndicators: [
      'Penultimate layering account',
      'High velocity outflow to private individual',
      'Frequent director changes'
    ],
    jurisdiction: 'Dubai, UAE',
    balance: 200000
  },
  {
    id: 'E512',
    name: 'Evergreen Real Estate Holdings',
    type: 'CORPORATE',
    risk: 'HIGH',
    ageMonths: 18,
    totalInflow: 4500000,
    totalOutflow: 300000,
    transactionCount: 4,
    firstSeen: '2026-09-18 10:09',
    lastSeen: '2026-09-18 10:20',
    connectedAccounts: ['D410'],
    riskIndicators: [
      'Terminal recipient of multi-hop fund flow',
      'Immediate conversion into non-liquid commercial assets',
      'Beneficial ownership linked to sanctioned party'
    ],
    jurisdiction: 'Mauritius',
    balance: 4200000
  },
  {
    id: 'P100',
    name: 'Prism Exports Inc',
    type: 'CORPORATE',
    risk: 'HIGH',
    ageMonths: 24,
    totalInflow: 11700000,
    totalOutflow: 12000000,
    transactionCount: 5,
    firstSeen: '2026-09-18 11:00',
    lastSeen: '2026-09-18 11:45',
    connectedAccounts: ['Q200', 'R300'],
    riskIndicators: [
      'Circular capital circulation detected',
      'Invoice over-reporting pattern',
      'Zero net business value generated'
    ],
    jurisdiction: 'New Delhi, India',
    balance: 850000
  },
  {
    id: 'Q200',
    name: 'Quantum Trading FZE',
    type: 'CORPORATE',
    risk: 'HIGH',
    ageMonths: 14,
    totalInflow: 12000000,
    totalOutflow: 11850000,
    transactionCount: 4,
    firstSeen: '2026-09-18 11:15',
    lastSeen: '2026-09-18 11:25',
    connectedAccounts: ['P100', 'R300'],
    riskIndicators: [
      'Pass-through routing in round-trip flow',
      'Discrepancy with declared industry codes'
    ],
    jurisdiction: 'Sharjah, UAE',
    balance: 620000
  },
  {
    id: 'R300',
    name: 'Radiant Merchant Solutions',
    type: 'CORPORATE',
    risk: 'HIGH',
    ageMonths: 11,
    totalInflow: 11850000,
    totalOutflow: 11700000,
    transactionCount: 4,
    firstSeen: '2026-09-18 11:22',
    lastSeen: '2026-09-18 11:35',
    connectedAccounts: ['Q200', 'P100'],
    riskIndicators: [
      'Returns funds back to primary originator P100',
      'Round-trip laundering signature'
    ],
    jurisdiction: 'Seychelles',
    balance: 410000
  },
  {
    id: 'M101',
    name: 'Monarch Mining Consortia',
    type: 'CORPORATE',
    risk: 'HIGH',
    ageMonths: 19,
    totalInflow: 8200000,
    totalOutflow: 8200000,
    transactionCount: 3,
    firstSeen: '2026-09-18 09:00',
    lastSeen: '2026-09-18 09:10',
    connectedAccounts: ['M202'],
    riskIndicators: ['Rapid high-velocity disbursement', 'Split transfer indicators'],
    jurisdiction: 'Hong Kong',
    balance: 1200000
  },
  {
    id: 'M202',
    name: 'Metro Fast-Pay Terminal',
    type: 'SHELL_COMPANY',
    risk: 'HIGH',
    ageMonths: 5,
    totalInflow: 8200000,
    totalOutflow: 8120000,
    transactionCount: 3,
    firstSeen: '2026-09-18 09:10',
    lastSeen: '2026-09-18 09:14',
    connectedAccounts: ['M101', 'M303'],
    riskIndicators: ['Rapid transit (under 4 minutes)', 'Low residual liquidity'],
    jurisdiction: 'Bangalore, India',
    balance: 80000
  },
  {
    id: 'M303',
    name: 'Matrix Cloud Infrastructure',
    type: 'SHELL_COMPANY',
    risk: 'HIGH',
    ageMonths: 7,
    totalInflow: 8120000,
    totalOutflow: 8050000,
    transactionCount: 3,
    firstSeen: '2026-09-18 09:14',
    lastSeen: '2026-09-18 09:18',
    connectedAccounts: ['M202', 'M404'],
    riskIndicators: ['Sub-second automated routing', 'Synthetic corporate identities'],
    jurisdiction: 'London, UK',
    balance: 70000
  },
  {
    id: 'M404',
    name: 'Mirage Private Trust',
    type: 'INDIVIDUAL',
    risk: 'HIGH',
    ageMonths: 28,
    totalInflow: 8050000,
    totalOutflow: 0,
    transactionCount: 2,
    firstSeen: '2026-09-18 09:18',
    lastSeen: '2026-09-18 09:25',
    connectedAccounts: ['M303'],
    riskIndicators: ['Final beneficiary of accelerated chain', 'Private wealth offshore shelter'],
    jurisdiction: 'Cayman Islands',
    balance: 8050000
  },
  // Normal / Benchmark Accounts
  {
    id: 'CORP-77',
    name: 'Tata Consultancy Services Payroll',
    type: 'CORPORATE',
    risk: 'LOW',
    ageMonths: 120,
    totalInflow: 45000000,
    totalOutflow: 43200000,
    transactionCount: 42,
    firstSeen: '2020-01-10 08:00',
    lastSeen: '2026-09-18 09:45',
    connectedAccounts: ['EMP-01', 'EMP-02', 'VENDOR-99'],
    riskIndicators: [],
    jurisdiction: 'Mumbai, India',
    balance: 14500000
  },
  {
    id: 'RETAIL-88',
    name: 'Reliance Digital Superstore',
    type: 'CORPORATE',
    risk: 'LOW',
    ageMonths: 84,
    totalInflow: 18500000,
    totalOutflow: 12000000,
    transactionCount: 65,
    firstSeen: '2022-04-15 10:00',
    lastSeen: '2026-09-18 10:30',
    connectedAccounts: ['CUST-10', 'CUST-11', 'CORP-77'],
    riskIndicators: [],
    jurisdiction: 'Ahmedabad, India',
    balance: 6500000
  },
  {
    id: 'VENDOR-99',
    name: 'Infosys Cloud Operations',
    type: 'CORPORATE',
    risk: 'LOW',
    ageMonths: 96,
    totalInflow: 8900000,
    totalOutflow: 7400000,
    transactionCount: 31,
    firstSeen: '2021-03-12 09:15',
    lastSeen: '2026-09-18 08:45',
    connectedAccounts: ['CORP-77'],
    riskIndicators: [],
    jurisdiction: 'Bangalore, India',
    balance: 3200000
  },
  {
    id: 'EMP-01',
    name: 'Rajesh Sharma (Senior Eng.)',
    type: 'INDIVIDUAL',
    risk: 'LOW',
    ageMonths: 48,
    totalInflow: 250000,
    totalOutflow: 65000,
    transactionCount: 14,
    firstSeen: '2023-01-01 10:00',
    lastSeen: '2026-09-18 09:30',
    connectedAccounts: ['CORP-77', 'RETAIL-88'],
    riskIndicators: [],
    jurisdiction: 'Pune, India',
    balance: 410000
  },
  {
    id: 'EMP-02',
    name: 'Ananya Deshmukh (Analyst)',
    type: 'INDIVIDUAL',
    risk: 'LOW',
    ageMonths: 36,
    totalInflow: 180000,
    totalOutflow: 45000,
    transactionCount: 12,
    firstSeen: '2023-06-15 10:00',
    lastSeen: '2026-09-18 09:35',
    connectedAccounts: ['CORP-77'],
    riskIndicators: [],
    jurisdiction: 'Hyderabad, India',
    balance: 295000
  },
  {
    id: 'CUST-10',
    name: 'Pooja Varma',
    type: 'INDIVIDUAL',
    risk: 'LOW',
    ageMonths: 24,
    totalInflow: 75000,
    totalOutflow: 24000,
    transactionCount: 8,
    firstSeen: '2024-02-10 11:00',
    lastSeen: '2026-09-18 10:15',
    connectedAccounts: ['RETAIL-88'],
    riskIndicators: [],
    jurisdiction: 'Delhi, India',
    balance: 92000
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // 1. The Primary Demo Layering Chain (Critical)
  {
    id: 'T001',
    fromAccount: 'A101',
    toAccount: 'B205',
    amount: 5000000, // ₹50,00,000
    timestamp: '10:01',
    date: '2026-09-18',
    risk: 'CRITICAL',
    pattern: 'POSSIBLE_LAYERING',
    status: 'FLAGGED',
    category: 'Layering Hop 1',
    notes: 'Initial large liquidity infusion into bluefin logistics shell account.'
  },
  {
    id: 'T002',
    fromAccount: 'B205',
    toAccount: 'C301',
    amount: 4800000, // ₹48,00,000
    timestamp: '10:04',
    date: '2026-09-18',
    risk: 'CRITICAL',
    pattern: 'RAPID_MOVEMENT',
    status: 'FLAGGED',
    category: 'Layering Hop 2',
    notes: 'Pass-through transfer dispatched within 3 minutes; ₹2,00,000 retained fee.'
  },
  {
    id: 'T003',
    fromAccount: 'C301',
    toAccount: 'D410',
    amount: 4700000, // ₹47,00,000
    timestamp: '10:07',
    date: '2026-09-18',
    risk: 'CRITICAL',
    pattern: 'POSSIBLE_LAYERING',
    status: 'FLAGGED',
    category: 'Layering Hop 3',
    notes: 'Cross-border routing via virtual digital services corporate shell.'
  },
  {
    id: 'T004',
    fromAccount: 'D410',
    toAccount: 'E512',
    amount: 4500000, // ₹45,00,000
    timestamp: '10:09',
    date: '2026-09-18',
    risk: 'CRITICAL',
    pattern: 'RAPID_MOVEMENT',
    status: 'FLAGGED',
    category: 'Layering Hop 4 (Terminal)',
    notes: 'Terminal transfer into commercial real estate fund within 8 minutes of initiation.'
  },

  // 2. Circular Flow Attack (High Risk)
  {
    id: 'T010',
    fromAccount: 'P100',
    toAccount: 'Q200',
    amount: 12000000, // ₹1.2 Cr
    timestamp: '11:15',
    date: '2026-09-18',
    risk: 'HIGH',
    pattern: 'CIRCULAR_TRANSFER',
    status: 'FLAGGED',
    category: 'Round-trip Flow',
    notes: 'Dispatched for bogus consulting services.'
  },
  {
    id: 'T011',
    fromAccount: 'Q200',
    toAccount: 'R300',
    amount: 11850000, // ₹1.185 Cr
    timestamp: '11:22',
    date: '2026-09-18',
    risk: 'HIGH',
    pattern: 'CIRCULAR_TRANSFER',
    status: 'FLAGGED',
    category: 'Round-trip Flow',
    notes: 'Forwarded to offshore radiant merchant account.'
  },
  {
    id: 'T012',
    fromAccount: 'R300',
    toAccount: 'P100',
    amount: 11700000, // ₹1.17 Cr
    timestamp: '11:35',
    date: '2026-09-18',
    risk: 'HIGH',
    pattern: 'CIRCULAR_TRANSFER',
    status: 'FLAGGED',
    category: 'Round-trip Flow (Completed Cycle)',
    notes: 'Full cycle loop completed back to P100. Retained leakage 2.5%.'
  },

  // 3. Rapid Movement Smurfing Chain
  {
    id: 'T020',
    fromAccount: 'M101',
    toAccount: 'M202',
    amount: 8200000, // ₹82 Lakh
    timestamp: '09:10',
    date: '2026-09-18',
    risk: 'HIGH',
    pattern: 'RAPID_MOVEMENT',
    status: 'UNDER_INVESTIGATION',
    category: 'Velocity Surge',
    notes: 'Immediate disbursement upon clearing.'
  },
  {
    id: 'T021',
    fromAccount: 'M202',
    toAccount: 'M303',
    amount: 8120000, // ₹81.2 Lakh
    timestamp: '09:14',
    date: '2026-09-18',
    risk: 'HIGH',
    pattern: 'RAPID_MOVEMENT',
    status: 'UNDER_INVESTIGATION',
    category: 'Velocity Surge',
    notes: 'Transferred out in under 4 minutes.'
  },
  {
    id: 'T022',
    fromAccount: 'M303',
    toAccount: 'M404',
    amount: 8050000, // ₹80.5 Lakh
    timestamp: '09:18',
    date: '2026-09-18',
    risk: 'HIGH',
    pattern: 'RAPID_MOVEMENT',
    status: 'UNDER_INVESTIGATION',
    category: 'Velocity Surge',
    notes: 'Parked in private trust account M404.'
  },

  // 4. Standalone High Value / Unusual Relationships
  {
    id: 'T030',
    fromAccount: 'A101',
    toAccount: 'VENDOR-99',
    amount: 1500000, // ₹15 Lakh
    timestamp: '08:40',
    date: '2026-09-18',
    risk: 'HIGH',
    pattern: 'HIGH_VALUE',
    status: 'FLAGGED',
    category: 'High Value Threshold',
    notes: 'Transfer exceeds threshold of ₹10,00,000 without contract documentation.'
  },
  {
    id: 'T031',
    fromAccount: 'EMP-01',
    toAccount: 'B205',
    amount: 980000,
    timestamp: '09:55',
    date: '2026-09-18',
    risk: 'MEDIUM',
    pattern: 'UNUSUAL_RELATIONSHIP',
    status: 'UNDER_INVESTIGATION',
    category: 'Unusual Relationship',
    notes: 'Employee salary account transmitting nearly 100% of balance to shell B205.'
  },

  // 5. Normal Business Transactions (Ensures realistic ratio ~80% normal)
  {
    id: 'T040',
    fromAccount: 'CORP-77',
    toAccount: 'EMP-01',
    amount: 250000,
    timestamp: '09:00',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Monthly Payroll',
    notes: 'Automated executive salary disbursement.'
  },
  {
    id: 'T041',
    fromAccount: 'CORP-77',
    toAccount: 'EMP-02',
    amount: 180000,
    timestamp: '09:00',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Monthly Payroll',
    notes: 'Automated analyst payroll disbursement.'
  },
  {
    id: 'T042',
    fromAccount: 'CORP-77',
    toAccount: 'VENDOR-99',
    amount: 1250000,
    timestamp: '08:15',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'IT Vendor Invoice',
    notes: 'Verified quarterly SLA enterprise payment.'
  },
  {
    id: 'T043',
    fromAccount: 'RETAIL-88',
    toAccount: 'VENDOR-99',
    amount: 450000,
    timestamp: '08:30',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Hardware Procurement',
    notes: 'Standard B2B equipment settlement.'
  },
  {
    id: 'T044',
    fromAccount: 'CUST-10',
    toAccount: 'RETAIL-88',
    amount: 24000,
    timestamp: '10:15',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Consumer Purchase',
    notes: 'POS checkout transaction.'
  },
  {
    id: 'T045',
    fromAccount: 'EMP-01',
    toAccount: 'RETAIL-88',
    amount: 32000,
    timestamp: '11:05',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Retail Store',
    notes: 'Consumer electronic purchase.'
  },
  {
    id: 'T046',
    fromAccount: 'CORP-77',
    toAccount: 'RETAIL-88',
    amount: 540000,
    timestamp: '11:20',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Corporate Gift Cards',
    notes: 'Annual employee appreciation cards.'
  },
  {
    id: 'T047',
    fromAccount: 'VENDOR-99',
    toAccount: 'CORP-77',
    amount: 85000,
    timestamp: '11:40',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Credit Adjustment',
    notes: 'Overpayment refund credit note.'
  },
  {
    id: 'T048',
    fromAccount: 'CUST-10',
    toAccount: 'EMP-02',
    amount: 15000,
    timestamp: '12:00',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'P2P UPI Transfer',
    notes: 'Shared travel reimbursement.'
  },
  {
    id: 'T049',
    fromAccount: 'EMP-02',
    toAccount: 'RETAIL-88',
    amount: 12500,
    timestamp: '12:15',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Groceries Settlement',
    notes: 'Regular retail household transaction.'
  },
  {
    id: 'T050',
    fromAccount: 'CORP-77',
    toAccount: 'EMP-01',
    amount: 45000,
    timestamp: '12:30',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Travel Allowance',
    notes: 'Domestic flight and stay reimbursement.'
  },
  {
    id: 'T051',
    fromAccount: 'VENDOR-99',
    toAccount: 'RETAIL-88',
    amount: 110000,
    timestamp: '12:45',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Stationery Supplies',
    notes: 'Office inventory supply restock.'
  },
  {
    id: 'T052',
    fromAccount: 'RETAIL-88',
    toAccount: 'CORP-77',
    amount: 220000,
    timestamp: '13:00',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Sponsorship Payment',
    notes: 'Annual tech symposium branding fee.'
  },
  {
    id: 'T053',
    fromAccount: 'EMP-01',
    toAccount: 'CUST-10',
    amount: 8000,
    timestamp: '13:20',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Utility Payment',
    notes: 'Monthly residential maintenance split.'
  },
  {
    id: 'T054',
    fromAccount: 'CORP-77',
    toAccount: 'VENDOR-99',
    amount: 720000,
    timestamp: '13:45',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Consulting Retainer',
    notes: 'Cloud infrastructure security audit retainer.'
  },
  {
    id: 'T055',
    fromAccount: 'EMP-02',
    toAccount: 'EMP-01',
    amount: 5500,
    timestamp: '14:05',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Lunch Split',
    notes: 'Team cafeteria lunch bill settlement.'
  },
  {
    id: 'T056',
    fromAccount: 'CUST-10',
    toAccount: 'RETAIL-88',
    amount: 18400,
    timestamp: '14:30',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Electronics Store',
    notes: 'Headphones purchase with digital receipt.'
  },
  {
    id: 'T057',
    fromAccount: 'VENDOR-99',
    toAccount: 'EMP-02',
    amount: 35000,
    timestamp: '15:00',
    date: '2026-09-18',
    risk: 'LOW',
    pattern: 'NORMAL',
    status: 'SETTLED',
    category: 'Honorarium',
    notes: 'Speaker honorarium for university webinar.'
  }
];

export const INITIAL_CASES: InvestigationCase[] = [
  {
    id: 'CASE-001',
    title: 'Possible Layering & Rapid Movement',
    risk: 'CRITICAL',
    pattern: 'POSSIBLE_LAYERING',
    amount: 45000000, // ₹4.5 Cr total chain value / flow
    accounts: ['A101', 'B205', 'C301', 'D410', 'E512'],
    status: 'OPEN',
    createdAt: '2026-09-18 10:15',
    primaryAccount: 'A101',
    description: 'Suspicious 4-hop fund sequence originating from A101 through multiple intermediary shell entities with total elapsed time under 8 minutes, terminal deposit at Evergreen Real Estate.',
    assignedInvestigator: 'Senior Analyst V. Ravi',
    relatedTransactionIds: ['T001', 'T002', 'T003', 'T004'],
    evidence: [
      {
        id: 'EV-01',
        title: 'RAPID MOVEMENT',
        pattern: 'RAPID_MOVEMENT',
        severity: 'CRITICAL',
        description: 'Funds moved through 5 accounts across 4 hops within 8 minutes (10:01 to 10:09).',
        supportingTransactionIds: ['T001', 'T002', 'T003', 'T004'],
        metrics: {
          'Elapsed Duration': '8 minutes',
          'Hop Count': 4,
          'Speed': '2.0 min / hop'
        }
      },
      {
        id: 'EV-02',
        title: 'POSSIBLE LAYERING',
        pattern: 'POSSIBLE_LAYERING',
        severity: 'CRITICAL',
        description: 'The money passed through 3 intermediary shell accounts (B205, C301, D410) with incremental retention before reaching terminal corporate account E512.',
        supportingTransactionIds: ['T001', 'T002', 'T003', 'T004'],
        metrics: {
          'Intermediary Accounts': 3,
          'Initial Capital': '₹50,00,000',
          'Final Capital': '₹45,00,000',
          'Amount Reduction (Fees)': '₹5,00,000'
        }
      },
      {
        id: 'EV-03',
        title: 'HIGH VALUE THRESHOLD BREACH',
        pattern: 'HIGH_VALUE',
        severity: 'HIGH',
        description: 'All 4 legs of the chain surpass the statutory ₹10,00,000 high-value threshold.',
        supportingTransactionIds: ['T001', 'T002', 'T003', 'T004'],
        metrics: {
          'Average Leg Value': '₹47,50,000',
          'Configured Threshold': '₹10,00,000'
        }
      },
      {
        id: 'EV-04',
        title: 'UNUSUAL SHELL ENTITY RELATIONSHIPS',
        pattern: 'UNUSUAL_RELATIONSHIP',
        severity: 'HIGH',
        description: 'Intermediary accounts registered recently with zero tax returns or physical business operations.',
        supportingTransactionIds: ['T001', 'T002'],
        metrics: {
          'Account Age Range': '3 - 6 months',
          'Jurisdiction Risk': 'High-risk offshore mix'
        }
      }
    ],
    timeline: [
      {
        time: '10:01',
        from: 'A101',
        to: 'B205',
        amount: 5000000,
        txId: 'T001',
        description: 'A101 sent ₹50,00,000 to B205 (Apex Global Horizon Ltd → Bluefin Logistics)'
      },
      {
        time: '10:04',
        from: 'B205',
        to: 'C301',
        amount: 4800000,
        txId: 'T002',
        description: 'B205 sent ₹48,00,000 to C301 (Bluefin Logistics → CloudPeak Digital)'
      },
      {
        time: '10:07',
        from: 'C301',
        to: 'D410',
        amount: 4700000,
        txId: 'T003',
        description: 'C301 sent ₹47,00,000 to D410 (CloudPeak Digital → Delta Horizon Consulting)'
      },
      {
        time: '10:09',
        from: 'D410',
        to: 'E512',
        amount: 4500000,
        txId: 'T004',
        description: 'D410 sent ₹45,00,000 to E512 (Delta Horizon Consulting → Evergreen Real Estate Holdings)'
      }
    ],
    aiSummary: 'AMLens identified a potentially suspicious money movement involving five connected accounts. The transaction originated from A101 with ₹50,00,000 and moved through B205, C301 and D410 before reaching E512. The transfers occurred within approximately 8 minutes, indicating rapid movement of funds. The amount decreased at each stage, while the money continued moving through multiple intermediary accounts. These characteristics resulted in the detection of possible layering and rapid movement patterns. Further review should focus on the source of funds for A101, the purpose of the intermediary accounts and the final destination E512.',
    recommendedActions: [
      'Freeze intermediary settlement accounts B205, C301, and D410 pending KYC re-verification',
      'Issue immediate Suspicious Activity Report (SAR) to Financial Intelligence Unit (FIU-IND)',
      'Subpoena ultimate beneficial ownership (UBO) records for Evergreen Real Estate Holdings E512',
      'Trace international wire originator details for Apex Global Horizon Ltd A101'
    ]
  },
  {
    id: 'CASE-002',
    title: 'Rapid Movement Velocity Spike',
    risk: 'HIGH',
    pattern: 'RAPID_MOVEMENT',
    amount: 8200000, // ₹82 Lakh
    accounts: ['M101', 'M202', 'M303', 'M404'],
    status: 'UNDER_REVIEW',
    createdAt: '2026-09-18 09:30',
    primaryAccount: 'M101',
    description: 'High-frequency automated transfers spanning 4 nodes across 8 minutes with final parking into offshore trust.',
    assignedInvestigator: 'K. Srinivasan',
    relatedTransactionIds: ['T020', 'T021', 'T022'],
    evidence: [
      {
        id: 'EV-21',
        title: 'RAPID VELOCITY SPIKE',
        pattern: 'RAPID_MOVEMENT',
        severity: 'HIGH',
        description: '₹82,00,000 transitioned across 3 hops in 8 minutes total latency.',
        supportingTransactionIds: ['T020', 'T021', 'T022'],
        metrics: {
          'Total Duration': '8 minutes',
          'Origin Amount': '₹82,00,000',
          'Final Amount': '₹80,50,000'
        }
      }
    ],
    timeline: [
      {
        time: '09:10',
        from: 'M101',
        to: 'M202',
        amount: 8200000,
        txId: 'T020',
        description: 'M101 sent ₹82,00,000 to M202'
      },
      {
        time: '09:14',
        from: 'M202',
        to: 'M303',
        amount: 8120000,
        txId: 'T021',
        description: 'M202 sent ₹81,20,000 to M303'
      },
      {
        time: '09:18',
        from: 'M303',
        to: 'M404',
        amount: 8050000,
        txId: 'T022',
        description: 'M303 sent ₹80,50,000 to M404'
      }
    ],
    aiSummary: 'Rapid movement pattern detected involving 4 corporate accounts originating from M101 and culminating in offshore trust M404. Transfers happened in quick succession under 4 minutes per leg.',
    recommendedActions: [
      'Request proof of services rendered between M101 and M202',
      'Verify trust deed documents for M404'
    ]
  },
  {
    id: 'CASE-003',
    title: 'Circular Transfer & Round-Tripping',
    risk: 'HIGH',
    pattern: 'CIRCULAR_TRANSFER',
    amount: 12000000, // ₹1.2 Cr
    accounts: ['P100', 'Q200', 'R300'],
    status: 'OPEN',
    createdAt: '2026-09-18 11:45',
    primaryAccount: 'P100',
    description: 'Round-trip fund cycle detected returning 97.5% of funds back to originator P100 via two international corporate nodes.',
    assignedInvestigator: 'M. Mehta',
    relatedTransactionIds: ['T010', 'T011', 'T012'],
    evidence: [
      {
        id: 'EV-31',
        title: 'CLOSED LOOP RECOVERY',
        pattern: 'CIRCULAR_TRANSFER',
        severity: 'HIGH',
        description: 'Funds originated from P100 and returned to P100 within 20 minutes.',
        supportingTransactionIds: ['T010', 'T011', 'T012'],
        metrics: {
          'Dispatched': '₹1,20,00,000',
          'Returned': '₹1,17,00,000',
          'Leakage (Fee)': '₹3,00,000 (2.5%)'
        }
      }
    ],
    timeline: [
      {
        time: '11:15',
        from: 'P100',
        to: 'Q200',
        amount: 12000000,
        txId: 'T010',
        description: 'P100 sent ₹1,20,00,000 to Q200'
      },
      {
        time: '11:22',
        from: 'Q200',
        to: 'R300',
        amount: 11850000,
        txId: 'T011',
        description: 'Q200 sent ₹1,18,50,000 to R300'
      },
      {
        time: '11:35',
        from: 'R300',
        to: 'P100',
        amount: 11700000,
        txId: 'T012',
        description: 'R300 returned ₹1,17,00,000 back to P100'
      }
    ],
    aiSummary: 'Circular money trail identified where P100 routed ₹1.2 Cr through Q200 and R300, returning ₹1.17 Cr back to P100 within 20 minutes. This is a classic round-tripping topology used for artificial turnover inflating or trade-based money laundering.',
    recommendedActions: [
      'Flag P100 for trade-based money laundering (TBML) compliance review',
      'Audit invoices exchanged between P100, Q200, and R300'
    ]
  }
];
