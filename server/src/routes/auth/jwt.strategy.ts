import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly _logger = new Logger(JwtStrategy.name);

  constructor(
    readonly _configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get('JWT_SECRET'),
    });
    this._logger.debug('JWT_STRATEGY');
  }

  // TODO check if this works
  async validate(payload: TokenPayload) {
    this._logger.debug(`JWT_STRATEGY:VALIDATE: ${payload}`);
    return { ...payload };
  }
}
