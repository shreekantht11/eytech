import Customer from '../models/Customer';
import Session from '../models/Session';
import { getCreditScore } from '../services/creditBureau';
import { calculateEMI, isEMIAffordable, getInterestRate } from '../utils/emi';

export interface UnderwritingResult {
  approved: boolean;
  reason: string;
  requiresSalarySlip: boolean;
  sanctionDetails?: {
    amount: number;
    tenure: number;
    interestRate: number;
    emi: number;
  };
}

export async function runUnderwriting(
  sessionId: string,
  customerId: string,
  requestedAmount: number,
  tenure: number = 12,
  monthlySalary?: number
): Promise<UnderwritingResult> {
  try {
    const session = await Session.findOne({ sessionId });
    const customer = await Customer.findOne({ customerId });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get credit score
    const creditScore = await getCreditScore(customerId);

    // Rule 1: Credit score must be >= 700
    if (creditScore < 700) {
      await Session.findOneAndUpdate(
        { sessionId },
        {
          status: 'rejected',
          creditCheckDone: true,
          $push: {
            auditLog: {
              action: 'UNDERWRITING_REJECTED',
              timestamp: new Date(),
              details: {
                reason: 'Credit score below 700',
                creditScore,
                requestedAmount,
              },
            },
          },
        }
      );

      return {
        approved: false,
        reason: `Your credit score (${creditScore}) is below our minimum requirement of 700. We can help you improve your score or offer alternative products.`,
        requiresSalarySlip: false,
      };
    }

    const preApprovedLimit = customer.preApprovedLimit;
    const interestRate = getInterestRate(creditScore, tenure);

    // Rule 2: Instant approval if requested amount <= pre-approved limit
    if (requestedAmount <= preApprovedLimit) {
      const emi = calculateEMI(requestedAmount, interestRate, tenure);

      await Session.findOneAndUpdate(
        { sessionId },
        {
          status: 'approved',
          creditCheckDone: true,
          requestedAmount,
          tenure,
          $push: {
            auditLog: {
              action: 'UNDERWRITING_APPROVED_INSTANT',
              timestamp: new Date(),
              details: {
                requestedAmount,
                preApprovedLimit,
                creditScore,
                interestRate,
                emi,
              },
            },
          },
        }
      );

      return {
        approved: true,
        reason: 'Instant approval! Your loan is within your pre-approved limit.',
        requiresSalarySlip: false,
        sanctionDetails: {
          amount: requestedAmount,
          tenure,
          interestRate,
          emi,
        },
      };
    }

    // Rule 3: If amount <= 2x pre-approved limit, check salary
    if (requestedAmount <= preApprovedLimit * 2) {
      const emi = calculateEMI(requestedAmount, interestRate, tenure);

      // If salary not provided yet, request it
      if (!monthlySalary && !session?.salarySlipUploaded) {
        await Session.findOneAndUpdate(
          { sessionId },
          {
            currentStep: 'salary_required',
            $push: {
              auditLog: {
                action: 'SALARY_SLIP_REQUESTED',
                timestamp: new Date(),
                details: {
                  requestedAmount,
                  preApprovedLimit,
                  reason: 'Amount exceeds pre-approved limit',
                },
              },
            },
          }
        );

        return {
          approved: false,
          reason: `Your requested amount (₹${requestedAmount.toLocaleString('en-IN')}) exceeds your pre-approved limit of ₹${preApprovedLimit.toLocaleString('en-IN')}. Please upload your salary slip to proceed.`,
          requiresSalarySlip: true,
        };
      }

      // Check EMI affordability
      if (monthlySalary && !isEMIAffordable(emi, monthlySalary)) {
        await Session.findOneAndUpdate(
          { sessionId },
          {
            status: 'rejected',
            creditCheckDone: true,
            $push: {
              auditLog: {
                action: 'UNDERWRITING_REJECTED',
                timestamp: new Date(),
                details: {
                  reason: 'EMI exceeds 50% of salary',
                  emi,
                  monthlySalary,
                  requestedAmount,
                },
              },
            },
          }
        );

        const maxAffordableEMI = monthlySalary * 0.5;
        const suggestedAmount = Math.floor((maxAffordableEMI * (Math.pow(1 + interestRate / 12 / 100, tenure) - 1)) / (interestRate / 12 / 100 * Math.pow(1 + interestRate / 12 / 100, tenure)));

        return {
          approved: false,
          reason: `The EMI (₹${emi.toLocaleString('en-IN')}) exceeds 50% of your monthly salary (₹${monthlySalary.toLocaleString('en-IN')}). You may be eligible for up to ₹${suggestedAmount.toLocaleString('en-IN')}.`,
          requiresSalarySlip: false,
        };
      }

      // Approve with salary slip
      await Session.findOneAndUpdate(
        { sessionId },
        {
          status: 'approved',
          creditCheckDone: true,
          requestedAmount,
          tenure,
          $push: {
            auditLog: {
              action: 'UNDERWRITING_APPROVED_WITH_SALARY',
              timestamp: new Date(),
              details: {
                requestedAmount,
                monthlySalary,
                emi,
                interestRate,
              },
            },
          },
        }
      );

      return {
        approved: true,
        reason: 'Approved! Your salary supports the requested loan amount.',
        requiresSalarySlip: false,
        sanctionDetails: {
          amount: requestedAmount,
          tenure,
          interestRate,
          emi,
        },
      };
    }

    // Rule 4: Reject if amount > 2x pre-approved limit
    await Session.findOneAndUpdate(
      { sessionId },
      {
        status: 'rejected',
        creditCheckDone: true,
        $push: {
          auditLog: {
            action: 'UNDERWRITING_REJECTED',
            timestamp: new Date(),
            details: {
              reason: 'Amount exceeds 2x pre-approved limit',
              requestedAmount,
              preApprovedLimit,
              maxAllowed: preApprovedLimit * 2,
            },
          },
        },
      }
    );

    return {
      approved: false,
      reason: `The requested amount (₹${requestedAmount.toLocaleString('en-IN')}) exceeds our maximum limit of ₹${(preApprovedLimit * 2).toLocaleString('en-IN')} for your profile. Consider a lower amount or let us schedule a call to discuss options.`,
      requiresSalarySlip: false,
    };
  } catch (error) {
    console.error('Underwriting error:', error);
    throw error;
  }
}
