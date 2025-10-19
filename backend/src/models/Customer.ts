import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  customerId: string;
  name: string;
  age: number;
  city: string;
  phone: string;
  gst?: string;
  currentLoan: number;
  creditScore: number;
  preApprovedLimit: number;
  salary?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    gst: { type: String },
    currentLoan: { type: Number, default: 0 },
    creditScore: { type: Number, required: true, min: 0, max: 900 },
    preApprovedLimit: { type: Number, required: true },
    salary: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
