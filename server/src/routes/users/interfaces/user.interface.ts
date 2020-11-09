import { ObjectId } from 'mongodb';
import { GisPermission } from './permission.enum';

export class User {
  company_admin: boolean;
  company_id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  password: string;
  active: boolean;
  permissions: number;
}

export class UserResponse extends User {
  _id?: ObjectId;
  id?: string;
  sys_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  permissionNames?: GisPermission[];
}
