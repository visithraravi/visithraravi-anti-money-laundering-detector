/**
 * Currency and date formatting utilities for AMLens
 */

export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '₹0';

  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      // Crores
      const cr = amount / 10000000;
      return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      // Lakhs
      const lakh = amount / 100000;
      return `₹${lakh.toFixed(lakh % 1 === 0 ? 0 : 2)} Lakh`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian comma system: ##,##,###
  const numStr = Math.round(amount).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  const formatted = otherNumbers !== '' 
    ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree 
    : lastThree;

  return `₹${formatted}`;
}

export function formatPatternLabel(pattern: string): string {
  switch (pattern) {
    case 'POSSIBLE_LAYERING':
      return 'Possible Layering';
    case 'RAPID_MOVEMENT':
      return 'Rapid Movement';
    case 'CIRCULAR_TRANSFER':
      return 'Circular Transfer';
    case 'HIGH_VALUE':
      return 'High Value Alert';
    case 'UNUSUAL_RELATIONSHIP':
      return 'Unusual Relationship';
    case 'SPLIT_TRANSACTIONS':
      return 'Structuring / Smurfing';
    case 'NORMAL':
      return 'Normal Transfer';
    default:
      return pattern.replace(/_/g, ' ');
  }
}

export function getRiskBadgeClasses(risk: string): { bg: string; text: string; border: string; dot: string } {
  switch (risk) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-50 text-red-700',
        text: 'text-red-700 font-semibold',
        border: 'border-red-200',
        dot: 'bg-red-500'
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50 text-orange-700',
        text: 'text-orange-700 font-semibold',
        border: 'border-orange-200',
        dot: 'bg-orange-500'
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-50 text-amber-700',
        text: 'text-amber-700 font-semibold',
        border: 'border-amber-200',
        dot: 'bg-amber-500'
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-50 text-emerald-700',
        text: 'text-emerald-700 font-medium',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500'
      };
  }
}
