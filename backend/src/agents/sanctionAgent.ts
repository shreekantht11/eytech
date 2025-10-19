import Sanction from '../models/Sanction';
import Session from '../models/Session';
import Customer from '../models/Customer';
import { generateSanctionLetter } from '../utils/pdf';

export async function generateSanction(
  sessionId: string,
  customerId: string,
  amount: number,
  tenure: number,
  interestRate: number,
  emi: number
) {
  try {
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      throw new Error('Customer not found');
    }

    const sanctionId = `SAN${Date.now()}`;

    // Generate PDF
    const pdfPath = await generateSanctionLetter({
      sanctionId,
      customerName: customer.name,
      customerId,
      sanctionedAmount: amount,
      tenure,
      interestRate,
      emi,
      sanctionDate: new Date(),
    });

    // Save sanction record
    const sanction = new Sanction({
      sanctionId,
      sessionId,
      customerId,
      customerName: customer.name,
      sanctionedAmount: amount,
      tenure,
      interestRate,
      emi,
      pdfPath,
      status: 'generated',
    });

    await sanction.save();

    // Update session
    await Session.findOneAndUpdate(
      { sessionId },
      {
        sanctionGenerated: true,
        sanctionId,
        $push: {
          auditLog: {
            action: 'SANCTION_GENERATED',
            timestamp: new Date(),
            details: {
              sanctionId,
              amount,
              tenure,
              interestRate,
              emi,
            },
          },
        },
      }
    );

    return {
      success: true,
      sanctionId,
      downloadUrl: `/api/sanction/${sanctionId}/download`,
      message: 'Sanction letter generated successfully!',
    };
  } catch (error) {
    console.error('Sanction generation error:', error);
    throw error;
  }
}
