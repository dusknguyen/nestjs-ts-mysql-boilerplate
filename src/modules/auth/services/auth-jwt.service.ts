import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestContext } from 'core/request-context/request-context.dto';
import { AppLogger, PrismaService } from 'core/services';
import { hash512 } from 'shared/crypto/hash';
import { JwtAlgorithm } from 'shared/type/algorithm';
import { UserAccessTokenClaims, UserRefreshTokenClaims } from '../dtos/auth-token-output.dto';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { AuthToken } from '@prisma/client';
/**
 * Service for handling JWT-related operations including token validation and generation.
 */
@Injectable()
export class AuthJWTService {
  /**
   * Constructor to initialize necessary dependencies for JWT operations.
   * @param logger The logging service.
   * @param jwtService The service used to sign and verify JWT tokens.
   * @param prisma Prisma ORM service for interacting with the database.
   */
  constructor(
    private readonly logger: AppLogger,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(AuthJWTService.name);
  }

  /**
   * Validates the access token using the provided public key and algorithm.
   * It checks the UUID in the token and verifies its presence in the database.
   * @param token The JWT access token to validate.
   * @param publicKey The public key used for verification.
   * @param algorithm The algorithm used for token verification.
   * @returns The authenticated token from the database if valid.
   */
  async validateAccessToken(token: string, publicKey: string, algorithm: JwtAlgorithm): Promise<AuthToken> {
    const jwt = await this.jwtService.verify<UserAccessTokenClaims>(token, {
      publicKey,
      algorithms: [algorithm],
    });

    // Validate UUID in token
    if (!(uuidValidate(jwt.jti) && uuidVersion(jwt.jti) === 1)) {
      throw new ForbiddenException('Invalid UUID in token');
    }

    // Validate essential claims
    if (!jwt.iss) {
      throw new ForbiddenException('Invalid token claims');
    }

    // Check if the token exists in the database
    const authToken = await this.prisma.authToken.findFirst({
      where: { userId: +jwt.sub, accessToken: hash512(`${token}`) },
    });
    if (!authToken) {
      throw new ForbiddenException('Token not found');
    }
    return authToken;
  }

  /**
   * Validates and verifies a refresh token.
   * @param request RequestContext containing request-specific metadata.
   * @param token The refresh token to validate.
   * @param publicKey Public key for verifying the token.
   * @param algorithm JWT algorithm used for verification.
   * @returns AuthToken object if the token is valid.
   */
  async validateRefreshToken(request: RequestContext, token: string, publicKey: string, algorithm: JwtAlgorithm): Promise<AuthToken> {
    this.logger.log(request, this.validateRefreshToken.name);
    const jwt = await this.jwtService.verify<UserRefreshTokenClaims>(token, {
      publicKey,
      algorithms: [algorithm],
    });

    // Validate UUID in token
    if (!(uuidValidate(jwt.jti) && uuidVersion(jwt.jti) === 4)) {
      throw new ForbiddenException('Invalid UUID in token');
    }

    // Validate essential claims
    if (!jwt.iss) {
      throw new ForbiddenException('Invalid token claims');
    }

    // Check if the token exists in the database
    const authToken = await this.prisma.authToken.findFirst({
      where: { userId: +jwt.sub, refreshToken: hash512(`${token}`) },
    });
    if (!authToken) {
      throw new ForbiddenException('Token not found');
    }
    return authToken;
  }

  /**
   * Generates a new JWT token for the specified subject.
   * @param request The request context.
   * @param subject The subject to include in the token (e.g., user info).
   * @param privateKey The private key used for signing the token.
   * @param expiresIn The expiration time of the token.
   * @param algorithm The algorithm to use for signing the token.
   * @returns The signed JWT token.
   */
  async generateToken(
    request: RequestContext,
    subject: any,
    privateKey: string,
    expiresIn: string | number | undefined,
    algorithm: JwtAlgorithm,
  ): Promise<string> {
    this.logger.log(request, this.generateToken.name);
    const token = await this.jwtService.sign(subject, {
      privateKey,
      expiresIn,
      algorithm,
    });
    return token;
  }
}
