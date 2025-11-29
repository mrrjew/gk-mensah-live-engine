import {
  Catch,
  ArgumentsHost,
  RpcExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { RpcError } from '@app/lib/core/errors/RPC.errors';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let errorResponse: RpcError;

    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;
      errorResponse = {
        statusCode: exception.getStatus(),
        message: res.message || exception.message,
        error: res.error || 'Bad Request',
      };
    } else if (exception instanceof RpcException) {
      errorResponse = {
        statusCode: 500,
        message: exception.message || 'RPC Error',
        error: 'Internal Server Error',
      };
    } else {
      errorResponse = {
        statusCode: 500,
        message: exception?.message || 'Unknown error occurred',
        error: 'Internal Server Error',
      };
    }

    return throwError(() => new RpcException(errorResponse));
  }
}
