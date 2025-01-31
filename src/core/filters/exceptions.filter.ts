import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlArgumentsHost, GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';
import { FastifyReply, FastifyRequest } from 'fastify';
import configuration from 'config';
import { BaseApiErrorObject, BaseApiException } from 'core/dtos/base-api.exception';
import { createRequestContext } from 'core/request-context';
import { AppLogger } from 'core/services';

const config = configuration();

/**
 * Global exception filter for handling both REST and GraphQL errors.
 */
@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements GqlExceptionFilter {
  /**
   * Constructor to initialize the logger.
   */
  constructor(private readonly logger: AppLogger) {
    super();
    this.logger.setContext(ExceptionsFilter.name);
  }

  /**
   * Handles exceptions based on the request type (GraphQL or REST).
   */
  override catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType<GqlContextType>() === 'graphql') {
      this.handleGraphQLException(exception, host);
    } else {
      this.handleRestException(exception, host);
    }
  }

  /**
   * Handles exceptions occurring in GraphQL requests.
   */
  private handleGraphQLException(exception: unknown, host: ArgumentsHost): void {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext<{ req: FastifyRequest }>();
    const req = ctx.req;
    const requestContext = createRequestContext(req as unknown as FastifyRequest);

    const { operationName, variables } = req.body as {
      operationName: string;
      variables: Record<string, unknown>;
    };
    const args = `${operationName} ${JSON.stringify(variables)}`;
    const status = this.getHttpStatus(exception);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logError(exception, requestContext, args);
    }

    throw exception;
  }

  /**
   * Handles exceptions occurring in REST API requests.
   */
  private handleRestException(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<FastifyRequest>();
    const res = ctx.getResponse<FastifyReply>();
    const requestContext = createRequestContext(req);

    const errorResponse = this.buildErrorResponse(exception, req.url, requestContext);

    this.logger.warn(requestContext, errorResponse.message, {
      error: errorResponse,
      stack: (exception as Error)?.stack,
    });

    if (config.app.environment === 'production' && errorResponse.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.message = 'Internal server error';
    }

    res.status(errorResponse.statusCode).send({ error: errorResponse });
  }

  /**
   * Constructs a structured error response.
   */
  private buildErrorResponse(exception: unknown, path: string, requestContext: any): BaseApiErrorObject {
    let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorName = 'InternalException';
    let message = 'Internal server error';
    let details: string | Record<string, any> = '';

    if (exception instanceof BaseApiException) {
      statusCode = exception.getStatus();
      errorName = exception.constructor.name;
      message = exception.message;
      details = exception.details || exception.getResponse();
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorName = exception.constructor.name;
      message = exception.message;
      details = exception.getResponse();
    } else if (exception instanceof Error) {
      errorName = exception.constructor.name;
      message = exception.message;
    }

    return {
      statusCode,
      message,
      errorName,
      details,
      path,
      requestId: requestContext.requestID,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Logs errors for internal server issues.
   */
  private logError(exception: unknown, requestContext: any, args: string): void {
    if (exception instanceof Error) {
      this.logger.error(requestContext, `Name: ${exception.name} - Message: ${exception.message} - Stack: ${exception.stack} - ${args}`);
    } else {
      this.logger.error(requestContext, `UnhandledException: ${exception}`);
    }
  }

  /**
   * Determines the appropriate HTTP status code for an exception.
   */
  private getHttpStatus(exception: unknown): HttpStatus {
    return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
