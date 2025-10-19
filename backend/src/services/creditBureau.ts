import Customer from '../models/Customer';

/**
 * Mock Credit Bureau API
 * In production, this would call an actual credit bureau API
 */
export async function getCreditScore(customerId: string): Promise<number> {
  try {
    const customer = await Customer.findOne({ customerId });
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Return stored credit score (in production, call external API)
    return customer.creditScore;
  } catch (error) {
    console.error('Credit bureau error:', error);
    throw error;
  }
}

export async function getPreApprovedOffers(customerId: string) {
  try {
    const customer = await Customer.findOne({ customerId });
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Generate offers based on pre-approved limit and credit score
    const baseRate = customer.creditScore >= 750 ? 10.99 : customer.creditScore >= 700 ? 12.99 : 14.99;

    return {
      customerId,
      preApprovedLimit: customer.preApprovedLimit,
      offers: [
        {
          tenure: 12,
          interestRate: baseRate,
          maxAmount: customer.preApprovedLimit,
        },
        {
          tenure: 24,
          interestRate: baseRate + 0.5,
          maxAmount: customer.preApprovedLimit,
        },
        {
          tenure: 36,
          interestRate: baseRate + 1.0,
          maxAmount: customer.preApprovedLimit,
        },
      ],
    };
  } catch (error) {
    console.error('Offers fetch error:', error);
    throw error;
  }
}
