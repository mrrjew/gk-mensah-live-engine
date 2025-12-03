import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError, responsePathAsArray } from 'graphql';

/**
 * This filter catches all exceptions thrown in the GraphQL context
 * and transforms them into a standardized GraphQL error response.
 * It implements the GqlExceptionFilter interface from NestJS.
 */

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    /** Get the GraphQL arguments host to extract info about the request
     * ArgumentsHost provides contexts that exclude GraphQL specifics,
     * so we use GqlArgumentsHost to create a GraphQL-specific context
     */
    const gqlHost = GqlArgumentsHost.create(host);

    // Extract info about the GraphQL request
    const info = gqlHost.getInfo();

    // Determine the HTTP status code based on the exception type
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    // Extract the response payload from the exception
    const responsePayload =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    // Normalize the response payload to ensure consistent structure
    const normalized = this.normalizeResponse(responsePayload, exception);

    this.logger.error(
      `GraphQL Error [${info?.fieldName || 'unknown'}]: ${JSON.stringify(
        normalized,
      )}`,
    );

    return new GraphQLError(normalized.message, {
      nodes: info?.fieldNodes,
      path: info ? responsePathAsArray(info.path) : undefined,
      extensions: {
        code: status,
        details: normalized,
      },
    });
  }

  // Normalize the response to ensure it has a consistent structure
  private normalizeResponse(response: any, exception: any) {
    // If the response is a string, wrap it in an object with a message property
    if (typeof response === 'string') {
      return { message: response };
    }

    // If the response is an object, ensure it has a message property
    if (response && typeof response === 'object') {
      // console.log('Normalizing response object:', response);
      console.log('Original exception:', exception);
      return {
        ...response,
        message:
          response.message || exception?.message || 'Internal server error',
      };
    }

    // For all other types, return a generic message
    return { message: exception?.message || 'Internal server error' };
  }
}
