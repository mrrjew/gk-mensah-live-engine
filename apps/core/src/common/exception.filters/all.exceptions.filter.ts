import {
  Catch,
  ArgumentsHost,
  RpcExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { RpcError } from '@app/lib/core/errors/RPC.errors';

/**
 * This filter catches all exceptions thrown in the microservice context
 * and transforms them into a standardized RPC error response.
 */

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter {
  // Handles all exceptions and transforms them into RpcError format
  // Catch method is an inherited method from RpcExceptionFilter that processes exceptions
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    //The error response to be sent back to the client of type RpcError
    let errorResponse: RpcError;

    /**
     * Handle BadRequestException specifically to extract validation errors
     * and provide detailed feedback to the client.
     * Checks if the exception is an instance of BadRequestException
     */
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;
      console.error('BadRequestException caught:', res);
      errorResponse = {
        statusCode: exception.getStatus(),
        message: res.message || exception.message,
        error: res.error || 'Bad Request',
      };
      console.log(
        'Constructed error response for BadRequestException:',
        errorResponse,
      );
      // Handle RpcException to extract its message and provide a standardized error response
    } else if (exception instanceof RpcException) {
      errorResponse = {
        statusCode: 500,
        message: exception.message || 'RPC Error',
        error: 'Internal Server Error',
      };
      console.log(
        'Constructed error response for RpcException:',
        errorResponse,
      );
    } else {
      errorResponse = {
        statusCode: 500,
        message: exception?.message || 'Unknown error occurred',
        error: 'Internal Server Error',
      };
      console.log(
        'Constructed error response for unknown exception:',
        errorResponse,
      );
    }

    /**
     * Return an observable that throws the RpcException with the standardized error response
     * This allows the microservice framework to handle the error appropriately
     * and send the response back to the client.
     * The throwError function creates an observable that emits an error notification
     * with the provided RpcException.
     */
    return throwError(() => new RpcException(JSON.stringify(errorResponse)));
  }
}
