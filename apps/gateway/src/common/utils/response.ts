import { HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class ResponseService {
  async sendRequest<T>(
    patternOrObservable: any,
    payload?: any,
    client?: any,
  ): Promise<T> {
    try {
      if (this.isObservable(patternOrObservable)) {
        return await lastValueFrom(patternOrObservable as Observable<T>);
      }

      if (!client) {
        throw new Error('Client instance is required for legacy requests');
      }

      return await lastValueFrom(client.send(patternOrObservable, payload));
    } catch (error) {
      console.error('Microservice RPC Error:', error.message);
      const rpcError = error?.response || error;

      throw new HttpException(
        {
          statusCode: rpcError.statusCode || 500,
          message: rpcError.message || 'Internal Server Error',
          error: rpcError.error || 'Unknown',
        },
        rpcError.statusCode || 500,
      );
    }
  }

  private isObservable(candidate: any): candidate is Observable<unknown> {
    return candidate && typeof candidate.subscribe === 'function';
  }
}
