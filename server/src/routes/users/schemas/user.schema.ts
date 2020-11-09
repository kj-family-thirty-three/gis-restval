import { Schema, Document } from 'mongoose';
import { User } from '../interfaces/user.interface';

export const userSchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: 'Company' },
    company_admin: { type: Boolean, default: false },
    sys_admin: { type: Boolean, default: false },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    phone: { type: String, default: null },
    password: { type: String, required: true },
    // TODO related to payment method
    active: { type: Boolean, default: true },
    permissions: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export interface UserDocument extends User, Document { }
