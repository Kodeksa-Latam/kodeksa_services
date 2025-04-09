import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
  
      let errorMessage: string;
      let errorCode: string;
      let errorDetails: any = null;
  
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        errorMessage = (exceptionResponse as any).message || 'Internal server error';
        errorCode = (exceptionResponse as any).errorCode || `HTTP_${status}`;
        errorDetails = (exceptionResponse as any).details || null;
      } else {
        errorMessage = exceptionResponse;
        errorCode = `HTTP_${status}`;
      }
  
      const responseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        errorCode,
        message: errorMessage,
        ...(errorDetails && { details: errorDetails }),
      };
  
      // Loguear el error
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${JSON.stringify(responseBody)}`,
      );
  
      response.status(status).json(responseBody);
    }
  }