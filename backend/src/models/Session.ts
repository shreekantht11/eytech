import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ISession extends Document {
  sessionId: string;
  customerId?: string;
  messages: IMessage[];
  currentStep: string;
  requestedAmount?: number;
  tenure?: number;
  loanType?: string;
  kycVerified: boolean;
  creditCheckDone: boolean;
  salarySlipUploaded: boolean;
  sanctionGenerated: boolean;
  sanctionId?: string;
  status: 'active' | 'approved' | 'rejected' | 'pending';
  auditLog: Array<{
    action: string;
    timestamp: Date;
    details: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    customerId: { type: String },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    currentStep: { type: String, default: 'initial' },
    requestedAmount: { type: Number },
    tenure: { type: Number },
    loanType: { type: String },
    kycVerified: { type: Boolean, default: false },
    creditCheckDone: { type: Boolean, default: false },
    salarySlipUploaded: { type: Boolean, default: false },
    sanctionGenerated: { type: Boolean, default: false },
    sanctionId: { type: String },
    status: { type: String, enum: ['active', 'approved', 'rejected', 'pending'], default: 'active' },
    auditLog: [
      {
        action: { type: String },
        timestamp: { type: Date, default: Date.now },
        details: { type: Schema.Types.Mixed },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISession>('Session', SessionSchema);
