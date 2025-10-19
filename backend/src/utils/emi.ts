/**
 * Calculate EMI using the formula:
 * EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
 * where:
 * P = Principal loan amount
 * R = Monthly interest rate (annual rate / 12 / 100)
 * N = Number of monthly installments
 */
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  return Math.round(emi);
}

/**
 * Check if EMI is within 50% of monthly salary
 */
export function isEMIAffordable(emi: number, monthlySalary: number): boolean {
  const maxAllowedEMI = monthlySalary * 0.5;
  return emi <= maxAllowedEMI;
}

/**
 * Get interest rate based on credit score and tenure
 */
export function getInterestRate(creditScore: number, tenureMonths: number): number {
  let baseRate = 14.99;
  
  if (creditScore >= 800) {
    baseRate = 10.99;
  } else if (creditScore >= 750) {
    baseRate = 11.99;
  } else if (creditScore >= 700) {
    baseRate = 12.99;
  }

  // Add tenure premium
  if (tenureMonths > 36) {
    baseRate += 1.0;
  } else if (tenureMonths > 24) {
    baseRate += 0.5;
  }

  return baseRate;
}
