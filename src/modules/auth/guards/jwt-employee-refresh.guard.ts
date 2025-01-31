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
 * JwtEmployeeRefreshGuard authenticates the refresh JWT token for employee users.
 * It validates the refresh token in the request cookies and assigns the userId to request headers.
 */
@Injectable()
export class JwtEmployeeRefreshGuard extends AuthGuard(AUTH_STRATEGY.JWT_EMPLOYEE_REFRESH) implements CanActivate {
  /**
   * Constructor initializes the AuthJWTService to validate the refresh token.
   * @param authJWTService The service used to validate refresh JWT tokens.
   */
  constructor(private authJWTService: AuthJWTService) {
    super();
  }

  /**
   * This method checks if the refresh token is valid.
   * It extracts the token from cookies, validates it, and assigns the userId to the request headers.
   * @param context The execution context of the request.
   * @returns A boolean indicating whether the request is authorized.
   */
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest<FastifyRequest>();
    const requestContext = createRequestContext(request);
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      // Validate the refresh token
      const payload = await this.authJWTService.validateRefreshToken(
        requestContext,
        token,
        config.jwt.customer.refreshToken.publicKey,
        config.jwt.customer.refreshToken.algorithms,
      );
      // Assign userId from the token payload to request headers
      request.headers[USER_ID.toLowerCase()] = `${payload.userId}`;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return true; // The request is authorized
  }

  /**
   * Extracts the refresh token from cookies.
   * @param request The incoming request object.
   * @returns The refresh token if present, or undefined.
   */
  private extractToken(request: FastifyRequest): string | undefined {
    const { refreshToken } = request.cookies;
    return refreshToken;
  }
}
