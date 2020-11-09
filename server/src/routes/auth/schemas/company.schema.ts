import { Schema, Document } from 'mongoose';
import { Company } from '../interfaces/company.interface';

export const companySchema = new Schema(
  {
    company_name: { type: String, required: true, index: { unique: true } },
    license_capacity: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export interface CompanyDocument extends Company, Document {}
