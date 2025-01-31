import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { AUTH_STRATEGY } from '../constants/strategy.constant';
import { AuthJWTService } from '../services/auth-jwt.service';
import configuration from 'config';
import { USER_ID } from 'shared/constants/common';
import { GqlExecutionContext } from '@nestjs/graphql';

const config = configuration();

/**
 * JwtEmployeeGuard authenticates JWT tokens for employee users, supporting both REST API and GraphQL requests.
 * It validates the access token and assigns the userId to the request headers if valid.
 */
@Injectable()
export class JwtEmployeeGuard extends AuthGuard(AUTH_STRATEGY.JWT_EMPLOYEE) implements CanActivate {
  /**
   * Constructor initializes the AuthJWTService for validating the employee JWT token.
   * @param authJWTService The service used for JWT validation.
   */
  constructor(private authJWTService: AuthJWTService) {
    super();
  }

  /**
   * This method checks if the access token is valid for both REST API (FastifyRequest) and GraphQL.
   * It extracts the token, validates it, and assigns the userId to request headers.
   * @param context The execution context of the request (either REST or GraphQL).
   * @returns A boolean indicating if the request is authorized.
   */
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: FastifyRequest;

    // Determine if the request is REST API or GraphQL
    if (context.getType() === 'http') {
      // REST API (FastifyRequest)
      request = context.switchToHttp().getRequest<FastifyRequest>();
    } else {
      // GraphQL Request
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }

    // Extract the token from the request headers
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      // Validate the access token
      const payload = await this.authJWTService.validateAccessToken(
        token,
        config.jwt.employee.accessToken.publicKey,
        config.jwt.employee.accessToken.algorithms,
      );

      // Assign the userId from the payload to the request headers for route handlers
      request.headers[USER_ID.toLowerCase()] = `${payload.userId}`;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true; // The request is authorized
  }

  /**
   * Extracts the access token from the Authorization header (Bearer token).
   * @param request The incoming request object.
   * @returns The access token if present, or undefined.
   */
  private extractToken(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
