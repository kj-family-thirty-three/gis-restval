import { Injectable, CanActivate, ExecutionContext, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _httpService: HttpService,
  ) { }

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctxArgs = ctx.getArgs();
    const token = '';
    return this.validateRequest(token);
  }

  async validateRequest(token: string) {
    return true;
  }
}
