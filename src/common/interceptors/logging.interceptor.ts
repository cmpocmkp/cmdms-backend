import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const now = Date.now();

    this.logger.log(
      `[${method}] ${url} - User: ${user?.id || 'Anonymous'} - Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          this.logger.log(
            `[${method}] ${url} - Status: ${response.statusCode} - Time: ${Date.now() - now}ms`,
          );
        },
        error: (err) => {
          this.logger.error(
            `[${method}] ${url} - Error: ${err.message} - Time: ${Date.now() - now}ms`,
          );
        },
      }),
    );
  }
}

