import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { DbUtilsService } from 'src/utils/db-utils.service';
import { userSchema } from 'src/routes/users/schemas/user.schema';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { companySchema } from './schemas/company.schema';


@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
      property: 'user',
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Company', schema: companySchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    DbUtilsService,
    JwtStrategy,
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule { }
