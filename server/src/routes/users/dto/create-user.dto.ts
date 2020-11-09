import {
  IsEmail,
  IsBoolean,
  IsString,
  IsOptional,
  IsArray,
  ArrayUnique,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { GisPermission } from '../interfaces/permission.enum';

export class CreateUserDto {
  @IsBoolean()
  company_admin: boolean;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsArray()
  @ArrayUnique()
  @IsEnum(GisPermission, { each: true })
  permissions: GisPermission[];
}
