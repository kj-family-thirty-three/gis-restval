import {
  // ExecutionContext,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // canActivate(context: ExecutionContext) {
  //   // super.(context);
  //   const request = context.switchToHttp().getRequest();
  //   console.log(request.headers.authorization);
  //   JwtStrategy.
  //   // return this.handleRequest(request);
  //   return true;
  // }

  // handleRequest(err, user, info) {
  //   // You can throw an exception based on either "info" or "err" arguments
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
