import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { AUTH_STRATEGY } from '../constants/strategy.constant';
import { AuthJWTService } from '../services/auth-jwt.service';
import { createRequestContext } from 'core/request-context';
import configuration from 'config';
import { USER_ID } from 'shared/constants/common';

const config = configuration();

/**
 * JwtCustomerRefreshGuard validates the refresh token for customer login.
 * It checks the presence of a valid refresh token in the request cookies
 * and ensures that the token is valid using the JWT service.
 */
@Injectable()
export class JwtCustomerRefreshGuard extends AuthGuard(AUTH_STRATEGY.JWT_EMPLOYEE_REFRESH) implements CanActivate {
  /**
   * Constructor initializes the JwtCustomerRefreshGuard with the JWT service.
   * @param authJWTService The service used to validate JWT tokens.
   */
  constructor(private authJWTService: AuthJWTService) {
    super();
  }

  /**
   * This method checks whether the incoming request contains a valid refresh token.
   * It validates the token, extracts the payload, and adds the user ID to the request headers.
   * @param context The execution context of the request.
   * @returns A boolean indicating whether the request is authorized.
   */
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the request object from the execution context
    const request: FastifyRequest = context.switchToHttp().getRequest<FastifyRequest>();

    // Create request context for additional metadata
    const requestContext = createRequestContext(request);

    // Extract the refresh token from cookies
    const token = this.extractToken(request);

    // If no token is found, throw UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Validate the refresh token and get the payload
      const payload = await this.authJWTService.validateRefreshToken(
        requestContext,
        token,
        config.jwt.customer.refreshToken.publicKey,
        config.jwt.customer.refreshToken.algorithms,
      );

      // Assign the user ID from the payload to the request headers
      request.headers[USER_ID.toLowerCase()] = `${payload.userId}`;
    } catch {
      // If validation fails, throw UnauthorizedException
      throw new UnauthorizedException();
    }

    return true; // The request is authorized
  }

  /**
   * This method extracts the refresh token from the request cookies.
   * @param request The incoming request object.
   * @returns The refresh token if present, or undefined.
   */
  private extractToken(request: FastifyRequest): string | undefined {
    const { refreshToken } = request.cookies;
    return refreshToken;
  }
}
