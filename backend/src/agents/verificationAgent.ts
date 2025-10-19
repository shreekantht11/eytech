import Customer from '../models/Customer';
import Session from '../models/Session';

export async function verifyKYC(sessionId: string, phone: string) {
  try {
    // Find customer by phone
    const customer = await Customer.findOne({ phone });

    if (!customer) {
      return {
        success: false,
        message: 'Customer not found in our records. Please provide your details to proceed.',
        requiresInput: true,
      };
    }

    // Update session with customer info
    await Session.findOneAndUpdate(
      { sessionId },
      {
        customerId: customer.customerId,
        kycVerified: true,
        $push: {
          auditLog: {
            action: 'KYC_VERIFIED',
            timestamp: new Date(),
            details: {
              customerId: customer.customerId,
              phone,
            },
          },
        },
      }
    );

    return {
      success: true,
      message: `Welcome back, ${customer.name}! Your KYC is verified.`,
      customer: {
        customerId: customer.customerId,
        name: customer.name,
        preApprovedLimit: customer.preApprovedLimit,
        creditScore: customer.creditScore,
      },
    };
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
}
