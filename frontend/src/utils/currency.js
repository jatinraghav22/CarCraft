// ==========================================================================
// CARCRAFT CENTRALIZED CURRENCY UTILITY
// Formats all monetary values into Indian Rupees (INR / ₹)
// using Indian numbering system (Lakhs, Crores, etc.)
// ==========================================================================

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric value into standard Indian Rupee notation.
 * Examples:
 *   formatINR(9500000)  -> "₹95,00,000"
 *   formatINR(125000)   -> "₹1,25,000"
 *   formatINR(999)      -> "₹999"
 *   formatINR(0)        -> "₹0"
 * 
 * @param {number|string} amount - The amount to format.
 * @returns {string} Formatted Indian Rupee string.
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }
  const numericAmount = Math.round(Number(amount));
  return inrFormatter.format(numericAmount);
}

/**
 * Compact Indian Rupee formatter for executive dealer dashboards,
 * charts, and high-level KPI cards.
 * Examples:
 *   formatINRCompact(28500000) -> "₹2.85 Cr"
 *   formatINRCompact(450000)   -> "₹4.50 Lakh"
 *   formatINRCompact(75000)    -> "₹75,000"
 * 
 * @param {number|string} amount 
 * @returns {string} Compact INR notation
 */
export function formatINRCompact(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }
  const num = Number(amount);
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2);
    return `₹${lakh} Lakh`;
  }
  return inrFormatter.format(Math.round(num));
}

export default formatINR;
