import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface SanctionLetterData {
  sanctionId: string;
  customerName: string;
  customerId: string;
  sanctionedAmount: number;
  tenure: number;
  interestRate: number;
  emi: number;
  sanctionDate: Date;
}

export async function generateSanctionLetter(data: SanctionLetterData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, '../../uploads/sanctions');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `sanction_${data.sanctionId}.pdf`;
      const filepath = path.join(uploadsDir, filename);

      // Create PDF document
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc
        .fontSize(20)
        .fillColor('#003399')
        .text('TATA CAPITAL', 50, 50)
        .fontSize(10)
        .fillColor('#666666')
        .text('Financial Services Limited', 50, 75);

      // Title
      doc
        .moveDown(2)
        .fontSize(16)
        .fillColor('#000000')
        .text('LOAN SANCTION LETTER', { align: 'center' })
        .moveDown(0.5)
        .fontSize(10)
        .fillColor('#666666')
        .text(`Sanction ID: ${data.sanctionId}`, { align: 'center' })
        .text(`Date: ${data.sanctionDate.toLocaleDateString('en-IN')}`, { align: 'center' })
        .moveDown(2);

      // Customer Details
      doc
        .fontSize(12)
        .fillColor('#000000')
        .text('Dear ' + data.customerName + ',', 50, 200)
        .moveDown()
        .fontSize(10)
        .text(
          'We are pleased to inform you that your loan application has been approved. ' +
          'Please find below the details of your sanctioned loan:'
        )
        .moveDown(1.5);

      // Loan Details Box
      const boxY = 270;
      doc
        .rect(50, boxY, 495, 180)
        .fillAndStroke('#f8f9fa', '#003399');

      doc
        .fillColor('#000000')
        .fontSize(11)
        .text('Loan Details:', 70, boxY + 20)
        .moveDown(0.5)
        .fontSize(10)
        .text(`Customer ID: ${data.customerId}`, 70, boxY + 50)
        .text(`Sanctioned Amount: ₹${data.sanctionedAmount.toLocaleString('en-IN')}`, 70, boxY + 70)
        .text(`Interest Rate: ${data.interestRate}% per annum`, 70, boxY + 90)
        .text(`Tenure: ${data.tenure} months`, 70, boxY + 110)
        .text(`Monthly EMI: ₹${data.emi.toLocaleString('en-IN')}`, 70, boxY + 130)
        .text(`Total Amount Payable: ₹${(data.emi * data.tenure).toLocaleString('en-IN')}`, 70, boxY + 150);

      // Terms & Conditions
      doc
        .moveDown(3)
        .fontSize(10)
        .fillColor('#000000')
        .text('Terms & Conditions:', 50, 480)
        .moveDown(0.3)
        .fontSize(9)
        .fillColor('#666666')
        .list([
          'This sanction is valid for 30 days from the date of issue',
          'Processing fee: 2% of loan amount + applicable taxes',
          'Pre-payment allowed after 6 EMI payments with 3% prepayment charges',
          'Late payment charges: 2% per month on overdue amount',
          'This is a system-generated document and does not require signature',
        ])
        .moveDown(2);

      // Footer
      doc
        .fontSize(8)
        .fillColor('#003399')
        .text(
          'For queries, contact us at: 1800-123-4567 | support@tatacapital.com',
          50,
          720,
          { align: 'center' }
        )
        .fontSize(7)
        .fillColor('#999999')
        .text('© 2025 Tata Capital Financial Services Ltd. All rights reserved.', 50, 740, {
          align: 'center',
        });

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}
