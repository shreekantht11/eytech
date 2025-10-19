import mongoose, { Schema, Document } from 'mongoose';

export interface ISanction extends Document {
  sanctionId: string;
  sessionId: string;
  customerId: string;
  customerName: string;
  sanctionedAmount: number;
  tenure: number;
  interestRate: number;
  emi: number;
  pdfPath: string;
  status: 'generated' | 'downloaded';
  createdAt: Date;
  updatedAt: Date;
}

const SanctionSchema: Schema = new Schema(
  {
    sanctionId: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    sanctionedAmount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    emi: { type: Number, required: true },
    pdfPath: { type: String, required: true },
    status: { type: String, enum: ['generated', 'downloaded'], default: 'generated' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISanction>('Sanction', SanctionSchema);
