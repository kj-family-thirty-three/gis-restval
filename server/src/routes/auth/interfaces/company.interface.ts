import { ObjectId } from 'mongodb';

export class Company {
  company_name: string;
  license_capacity: number;
}

export class CompanyResponse extends Company {
  _id?: ObjectId;
  id?: string;
  created_at?: string;
  updated_at?: string;
}
