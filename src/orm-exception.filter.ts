import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class OrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // TODO: 상태값 수정

    const status = this.getStatus(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getStatus(exception: TypeORMError) {
    const isNotFound = exception instanceof EntityNotFoundError;
    return isNotFound ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
