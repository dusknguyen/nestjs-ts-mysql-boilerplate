import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql'; // For GraphQL support
import { FastifyRequest } from 'fastify'; // For REST API (Fastify)
import { AUTH_STRATEGY } from '../constants/strategy.constant';
import configuration from 'config';
import { HEADER_KEY } from 'shared/constants/strategy.constant';

const { apiKey } = configuration().app;

/**
 * ApiKeyGuard validates the presence and correctness of the `x-api-key` header.
 * It is used for both REST API and GraphQL requests, ensuring proper authorization.
 */
@Injectable()
export class ApiKeyGuard extends AuthGuard(AUTH_STRATEGY.API_KEY) implements CanActivate {
  /**
   * This method checks if the request contains a valid API key.
   * It handles both REST API and GraphQL requests.
   * @param context The execution context of the request.
   * @returns A boolean indicating whether the request is authorized.
   */
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: FastifyRequest;

    // Check the type of the request (REST API or GraphQL)
    if (context.getType() === 'http') {
      // For REST API requests (FastifyRequest)
      request = context.switchToHttp().getRequest<FastifyRequest>();
    } else {
      // For GraphQL requests (using GqlExecutionContext)
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }

    // Extract the API Key from the request header
    const apiKeyHeader = request.headers[HEADER_KEY.API_KEY.toLowerCase()] as string;

    // Compare the provided API key with the expected one from configuration
    if (apiKeyHeader !== apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true; // API key is valid
  }
}
