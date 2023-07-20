import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    response.status(exception?.response?.data?.status?.status_code || 400).json({
      statusCode: exception?.response?.data?.status?.status_code || 400,
      message: exception?.response?.data?.status?.message || exception.response.message[0] || "Bad Request",
    });
  }
}
