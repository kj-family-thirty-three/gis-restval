import { ClientSession, Model } from 'mongoose';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { DbUtilsService } from 'src/utils/db-utils.service';

import { UserDocument } from 'src/routes/users/schemas/user.schema';
import { comparePasswords, encodePermissions, hashPassword } from 'src/utils/helpers';
import { RegisterUserDto } from './dto/register-user.dto';
import { CompanyDocument } from './schemas/company.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './interfaces/auth.interface';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  private readonly _logger = new Logger(AuthService.name);

  constructor(
    @InjectModel('User') private readonly _userModel: Model<UserDocument>,
    @InjectModel('Company') private readonly _companyModel: Model<CompanyDocument>,
    private readonly _dbUtilsService: DbUtilsService,
    private readonly _jwtService: JwtService,
  ) { }

  async login(credentials: LoginUserDto): Promise<LoginResponse> {
    this._logger.log('LOGIN:EE');
    const user = await this._dbUtilsService.findOne({ email: credentials.email }, this._userModel);
    if (!user) {
      throw new BadRequestException();
    }
    if (await comparePasswords(credentials.password, user.password)) {
      const token = await this.generateJWT({
        email: user.email,
        company_admin: user.company_admin,
        company_id: user.company_id,
      });
      this._logger.log('LOGIN:LL');
      return { access_token: token };
    } else {
      throw new BadRequestException();
    }
  }

  async register(data: RegisterUserDto): Promise<void> {
    this._logger.log('RGSTR:EE');

    // Define actions to run inside a transaction
    const actions = async (session: ClientSession) => {
      // Company
      const newCompany = {
        company_name: data.company_name,
        license_capacity: data.license_capacity,
      };
      const company = await this._dbUtilsService.createDocument<CompanyDocument>(newCompany, this._companyModel, session);
      // Company owner
      const newUser = {
        company_id: company.id,
        company_admin: true,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        // TODO save null or empty string in db?
        phone: data.phone ? data.phone : '',
        password: await hashPassword(data.password),
        permissions: encodePermissions(),
        active: true,
      };
      await this._dbUtilsService.createDocument<UserDocument>(newUser, this._userModel, session);
    };

    await this._dbUtilsService.runInTransaction(actions);
    this._logger.log('RGSTR:LL');
  }

  async logout(): Promise<void> {
    this._logger.log('LOGOUT:EE');
    // TODO Invalidate token
    this._logger.log('LOGOUT:LL');
  }

  async generateJWT(payload: TokenPayload): Promise<string> {
    this._logger.debug('GNRT_JWT:EE');
    const jwt = await this._jwtService.signAsync(payload);
    this._logger.debug('GNRT_JWT:LL');
    return jwt;
  }
}
