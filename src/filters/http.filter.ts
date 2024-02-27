import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const error: any = exception.getResponse();

    return response.status(statusCode).json({
      isSuccess: 'false',
      name: exception.name,
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      createdBy: 'HttpExceptionFilter',
      error,
    });
  }
}
