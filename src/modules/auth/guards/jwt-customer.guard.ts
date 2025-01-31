import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql'; // Supports GraphQL
import { FastifyRequest } from 'fastify'; // Supports REST API
import { AUTH_STRATEGY } from '../constants/strategy.constant';
import { AuthJWTService } from '../services/auth-jwt.service';
import configuration from 'config';
import { USER_ID } from 'shared/constants/common';

const config = configuration();

/**
 * JwtCustomerGuard authenticates the JWT token for both REST API and GraphQL.
 * It checks the presence of a valid JWT token and validates it using the AuthJWTService.
 */
@Injectable()
export class JwtCustomerGuard extends AuthGuard(AUTH_STRATEGY.JWT_EMPLOYEE) implements CanActivate {
  /**
   * Constructor injects the AuthJWTService for token validation.
   * @param authJWTService The service used to validate JWT tokens.
   */
  constructor(private authJWTService: AuthJWTService) {
    super();
  }

  /**
   * This method determines if the incoming request is valid by checking the presence of a valid JWT token.
   * It processes both REST API (via Fastify) and GraphQL requests.
   * @param context The execution context of the request.
   * @returns A boolean indicating whether the request is authorized.
   */
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: FastifyRequest;

    // Check if the request is a REST API (Fastify)
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest<FastifyRequest>();
    } else {
      // Handle GraphQL requests
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }

    // Extract the JWT token from the request
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      // Validate the extracted JWT token
      const payload = await this.authJWTService.validateAccessToken(
        token,
        config.jwt.customer.accessToken.publicKey,
        config.jwt.customer.accessToken.algorithms,
      );

      // Assign userId from the payload to the request headers
      request.headers[USER_ID.toLowerCase()] = `${payload.userId}`;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true; // The request is authorized
  }

  /**
   * Extracts the JWT token from the Authorization header (Bearer Token).
   * @param request The incoming request object.
   * @returns The JWT token if present, or undefined.
   */
  private extractToken(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
