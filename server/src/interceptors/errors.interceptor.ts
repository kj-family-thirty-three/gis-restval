import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoError } from 'mongodb';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private readonly _logger = new Logger(ErrorsInterceptor.name);

  constructor(
    private readonly configService: ConfigService,
  ) { }

  findCollection(err: MongoError): string {
    const dbname = this.configService.get('DATABASE_NAME');
    const regex = new RegExp(`${dbname}.([^ ]*)`);
    return err.errmsg.match(regex)[1].toUpperCase();
  }

  // TODO
  findField(err: MongoError): string {
    const regex = new RegExp('{ ([^ ]*):');
    return err.errmsg.match(regex)[1].toUpperCase();
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<HttpException> {
    return next
      .handle()
      .pipe(
        catchError(err => {
          this._logger.debug(`ERR_INTRCPTR: ${err}`);
          if (err instanceof (MongoError)) {
            // Mongo Errors
            switch (err.code) {
            case 11000:
              // duplicate exception
              const collection = this.findCollection(err);
              return throwError(
                new HttpException(`DUPLICATE_${collection}`, HttpStatus.CONFLICT),
              );
            default:
              return throwError(
                new InternalServerErrorException(),
              );
            }
          } else {
            // Http Errors
            return throwError(err);
          }
        }),
      );
  }
}
