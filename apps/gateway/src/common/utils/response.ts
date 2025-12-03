import { HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';

/**
 * Service to handle sending requests to microservices and processing their responses.
 * It normalizes errors and converts gRPC errors to HTTP exceptions.
 */

@Injectable()
export class ResponseService {
  /** Sends a request to a microservice and returns the response.
   * It can handle both Observables and legacy Client.send() patterns.
   * @param patternOrObservable - The request pattern or Observable to send.
   * @param payload - The payload to send with the request (for legacy patterns).
   * @param client - The microservice client instance (for legacy patterns).
   * @returns A promise that resolves with the response of type T.
   * @throws HttpException if the microservice returns an error.
   */

  async sendRequest<T>(
    patternOrObservable: any,
    payload?: any,
    client?: any,
  ): Promise<T> {
    try {
      // If the input is an Observable, convert it to a Promise and return the result
      if (this.isObservable(patternOrObservable)) {
        return await lastValueFrom(patternOrObservable as Observable<T>);
      }

      // For legacy Client.send() patterns
      if (!client) {
        throw new Error('Client instance is required for legacy requests');
      }

      // Send the request using the legacy Client.send() pattern
      console.log('Sending request with payload:', payload);
      const res = await lastValueFrom(
        client.send(patternOrObservable, payload),
      );
      console.log('Received response:', res);
      return res as T;

    } catch (error) {
      console.error('Microservice RPC Error:', error.message);
      console.error('Raw RPC Error:', error);
      const rpcError = error?.response || error;

      const normalized = this.normalizeRpcError(rpcError);
      throw new HttpException(normalized, normalized.statusCode);
    }
  }

  /**
   * Type guard to check if a candidate is an Observable.
   * It checks for the presence of the subscribe method.
   * @param candidate 
   * @returns boolean indicating if the candidate is an Observable.
   */
  private isObservable(candidate: any): candidate is Observable<unknown> {
    return candidate && typeof candidate.subscribe === 'function';
  }

  /** Normalizes gRPC error responses into a consistent structure.
   * It extracts status code, message, and error label from the gRPC error.
   * @param error - The gRPC error object.
   * @returns An object containing statusCode, message, and error label.
   */

  private normalizeRpcError(error: any) {
    const payload = this.extractPayload(error);
    const statusCode = this.resolveStatusCode(payload, error);
    const message = this.resolveMessage(payload, error);
    const errorLabel = this.resolveErrorLabel(payload, error);

    return {
      statusCode,
      message,
      error: errorLabel,
    };
  }

  // Extracts the payload from the gRPC error object.
  private extractPayload(error: any): any {
    if (error?.response && typeof error.response === 'object') {
      return error.response;
    }

    const parsedDetails = this.tryParseJson(error?.details);
    if (parsedDetails) {
      return parsedDetails;
    }

    if (error?.details && typeof error.details === 'object') {
      return error.details;
    }

    return error;
  }

  // Resolves the HTTP status code from the gRPC error object.
  private resolveStatusCode(payload: any, error: any): number {
    if (typeof payload?.statusCode === 'number') {
      return payload.statusCode;
    }

    if (typeof error?.statusCode === 'number') {
      return error.statusCode;
    }

    if (typeof error?.response?.statusCode === 'number') {
      return error.response.statusCode;
    }

    if (typeof error?.code === 'number') {
      return this.grpcToHttpStatus(error.code);
    }

    return 500;
  }

  // Resolves the error message from the gRPC error object.
  private resolveMessage(payload: any, error: any): string {
    const candidate =
      payload?.message ??
      error?.response?.message ??
      this.tryParseJson(error?.details)?.message ??
      error?.details ??
      error?.message ??
      'Internal Server Error';

    return Array.isArray(candidate) ? candidate.join(', ') : candidate;
  }

  // Resolves the error label from the gRPC error object.
  private resolveErrorLabel(payload: any, error: any): string {
    return (
      payload?.error ||
      error?.response?.error ||
      error?.error ||
      error?.name ||
      'Error'
    );
  }

  /** Maps gRPC status codes to HTTP status codes.
   * @param code - The gRPC status code.
   * @returns The corresponding HTTP status code.
   */
  private grpcToHttpStatus(code?: number): number {
    const mapping: Record<number, number> = {
      0: 200,
      1: 499,
      2: 500,
      3: 400,
      4: 504,
      5: 404,
      6: 409,
      7: 403,
      8: 429,
      9: 412,
      10: 409,
      11: 400,
      12: 501,
      13: 502,
      14: 503,
      15: 500,
      16: 401,
    };

    return mapping[code ?? 13] ?? 500;
  }

  // Attempts to parse a value as JSON. Returns undefined if parsing fails.
  private tryParseJson(value: any) {
    if (typeof value !== 'string') {
      return undefined;
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      return undefined;
    }
  }
}
