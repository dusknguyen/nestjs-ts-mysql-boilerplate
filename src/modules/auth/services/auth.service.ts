import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppLogger, PrismaService } from 'core/services';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { UserAccessTokenClaims, UserRefreshTokenClaims } from '../dtos/auth-token-output.dto';
import { RequestContext } from 'core/request-context/request-context.dto';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';
import { AuthJWTService } from './auth-jwt.service';
import configuration from 'config';
import { ROLE, User } from '@prisma/client';
import { hash512 } from 'shared/crypto/hash';
import { RegisterInput } from '../dtos/auth-register.dto';
import { hashPassword, verifyPassword } from 'shared/crypto/password';

const config = configuration();

/**
 * Service responsible for authentication logic, including login, registration, and token management.
 */
@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    private readonly logger: AppLogger,
    private readonly prisma: PrismaService,
    private readonly authJWTService: AuthJWTService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  /**
   * Refreshes authentication tokens for a given user.
   * @param ctx RequestContext containing request-specific metadata.
   * @param userId ID of the user to refresh tokens for.
   * @returns Object containing new access and refresh tokens.
   */
  async refreshCustomer(ctx: RequestContext, userId: number): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(ctx, `${this.refreshCustomer.name} was called`);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.generateAuthTokens(ctx, user);
  }

  /**
   * Registers a new customer in the system.
   * @param ctx RequestContext containing request-specific metadata.
   * @param credential User registration details.
   * @returns Newly created user entity.
   */
  async registerCustomer(ctx: RequestContext, credential: RegisterInput): Promise<User> {
    this.logger.log(ctx, `${this.registerCustomer.name} was called`);
    const existingUser = await this.prisma.user.findFirst({ where: { username: credential.username } });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(credential.password);
    if (!hashedPassword) {
      throw new HttpException('Password hashing failed', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.user.create({
      data: { username: credential.username, password: hashedPassword, role: ROLE.CUSTOMER },
    });
  }

  /**
   * Handles user login for both customers and employees.
   * @param ctx RequestContext containing request-specific metadata.
   * @param credentials Login credentials including username and password.
   * @param role User role (either CUSTOMER or EMPLOYEE).
   * @returns Object containing access and refresh tokens.
   */
  private async login(ctx: RequestContext, credentials: LoginInput, role: ROLE): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(ctx, `${this.login.name} was called`);

    const user = await this.prisma.user.findFirst({ where: { username: credentials.username, role } });

    if (user && (await verifyPassword(user.password, credentials.password))) {
      return this.generateAuthTokens(ctx, user);
    }

    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  /**
   * Handles customer login.
   * @param ctx RequestContext containing request-specific metadata.
   * @param credentials Customer login credentials.
   * @returns Object containing access and refresh tokens.
   */
  async loginCustomer(ctx: RequestContext, credentials: LoginInput): Promise<{ accessToken: string; refreshToken: string }> {
    return this.login(ctx, credentials, ROLE.CUSTOMER);
  }

  /**
   * Handles employee login.
   * @param ctx RequestContext containing request-specific metadata.
   * @param credentials Employee login credentials.
   * @returns Object containing access and refresh tokens.
   */
  async loginEmployee(ctx: RequestContext, credentials: LoginInput): Promise<{ accessToken: string; refreshToken: string }> {
    return this.login(ctx, credentials, ROLE.EMPLOYEE);
  }

  /**
   * Generates authentication tokens (access and refresh) for a given user.
   * @param ctx RequestContext containing request-specific metadata.
   * @param user User entity for whom tokens are generated.
   * @returns Object containing generated access and refresh tokens.
   */
  private async generateAuthTokens(ctx: RequestContext, user: User): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(ctx, `${this.generateAuthTokens.name} was called`);

    const tokenConfig = user.role === ROLE.CUSTOMER ? config.jwt.customer : config.jwt.employee;

    if (!tokenConfig) {
      throw new HttpException('Invalid user role', HttpStatus.BAD_REQUEST);
    }

    const accessTokenClaims: UserAccessTokenClaims = {
      iss: 'auth-service', // Issuer of the token
      sub: user.id.toString(), // Subject (User ID)
      jti: uuidv1(), // Unique token identifier
    };
    const refreshTokenClaims: UserRefreshTokenClaims = {
      iss: 'auth-service', // Issuer of the token
      sub: user.id.toString(), // Subject (User ID)
      jti: uuidv4(), // Unique token identifier
    };

    const accessToken = await this.authJWTService.generateToken(
      ctx,
      accessTokenClaims,
      tokenConfig.accessToken.privateKey,
      60 * 60,
      tokenConfig.accessToken.algorithms,
    );
    const refreshToken = await this.authJWTService.generateToken(
      ctx,
      refreshTokenClaims,
      tokenConfig.refreshToken.privateKey,
      60 * 60 * 24,
      tokenConfig.refreshToken.algorithms,
    );

    await this.prisma.authToken.create({
      data: { userId: user.id, accessToken: hash512(accessToken), refreshToken: hash512(refreshToken) },
    });

    return { accessToken, refreshToken };
  }
}
