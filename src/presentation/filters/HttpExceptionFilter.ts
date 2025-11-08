import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';
import { DuplicateEmailException } from '@domain/exceptions/DuplicateEmailException';
import { InvalidCustomerAccountException } from '@domain/exceptions/InvalidCustomerAccountException';

/**
 * Global exception filter that maps domain exceptions to HTTP status codes.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Catches and handles exceptions, mapping them to appropriate HTTP responses.
   *
   * @param exception - The exception that was thrown
   * @param host - The arguments host containing request/response objects
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof CustomerAccountNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof DuplicateEmailException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof InvalidCustomerAccountException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const responseMessage =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string | string[] }).message ||
            exception.message;
      message = Array.isArray(responseMessage)
        ? responseMessage.join(', ')
        : responseMessage;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}

