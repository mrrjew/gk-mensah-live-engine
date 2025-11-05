import { HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ResponseService {
  async sendRequest<T>(pattern: any, payload: any, client: any):Promise<T> {
    try {
      return await lastValueFrom(client.send(pattern, payload));
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
}
