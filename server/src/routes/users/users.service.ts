import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DbUtilsService } from 'src/utils/db-utils.service';
import { decodePermissions, encodePermissions, hashPassword } from 'src/utils/helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './interfaces/user.interface';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly _logger = new Logger(UsersService.name);

  constructor(
    @InjectModel('User') private readonly _userModel: Model<UserDocument>,
    private readonly _dbUtilsService: DbUtilsService,
  ) { }

  async findAll(company_id: string): Promise<UserResponse[]> {
    this._logger.log('FINDALL:EE');
    const users = this._dbUtilsService.findAll<UserDocument>(this._userModel, { company_id });
    this._logger.log('FINDALL:LL');
    return users;
  }

  async findById(id: string): Promise<UserResponse> {
    this._logger.log('FINDBYID:EE');
    const user = await this._dbUtilsService.findById(id, this._userModel);
    (user as UserResponse).permissionNames = decodePermissions(user.permissions);
    this._logger.log('FINDBYID:LL');
    return user;
  }

  async create(user: CreateUserDto, company_id: string): Promise<UserResponse> {
    this._logger.log('CREATE:EE');
    const newUser = {
      company_id,
      company_admin: user.company_admin,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      password: await hashPassword(user.password),
      active: true,
      permissions: encodePermissions(user.permissions),
    };
    const res = await this._dbUtilsService.createDocument<UserDocument>(newUser, this._userModel);
    this._logger.log('CREATE:LL');
    return res;
  }

  async delete(id: string): Promise<UserResponse> {
    this._logger.log('DELETE:EE');
    const res = await this._dbUtilsService.deleteDocument<UserDocument>(id, this._userModel);
    this._logger.log('DELETE:LL');
    return res;
  }
}
