import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto } from '../dto/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    let errorMessage = message;
    let errors = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const response = exceptionResponse as any;
      errorMessage = response.message || message;
      errors = response.errors || null;
    }

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${errorMessage}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse = ResponseDto.error(
      errorMessage,
      errors || undefined,
    );

    response.status(status).json(errorResponse);
  }
}

