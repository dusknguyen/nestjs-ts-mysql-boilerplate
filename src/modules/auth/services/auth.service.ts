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
 * Service for handling authentication logic such as login, registration, and token refresh.
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
   * Refreshes the user's authentication tokens.
   * @param ctx RequestContext
   * @param userId User ID to refresh tokens for.
   * @returns Access and refresh tokens.
   */
  async refreshCustomer(ctx: RequestContext, userId: any): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(ctx, `${this.refreshCustomer.name} was called`);
    const user = await this.prisma.user.findUnique({ where: { id: +userId } });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.generateAuthTokens(ctx, user);
  }

  /**
   * Registers a new customer.
   * @param ctx RequestContext
   * @param credential RegisterInput
   * @returns Newly created user object
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
   * Logs in a user (customer or employee).
   * @param ctx RequestContext
   * @param credentials LoginInput
   * @param role User role (either 'CUSTOMER' or 'EMPLOYEE')
   * @returns Access and refresh tokens.
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
   * Login for customer.
   * @param ctx RequestContext
   * @param credentials LoginInput
   * @returns Access and refresh tokens.
   */
  async loginCustomer(ctx: RequestContext, credentials: LoginInput): Promise<{ accessToken: string; refreshToken: string }> {
    return this.login(ctx, credentials, ROLE.CUSTOMER);
  }

  /**
   * Login for employee.
   * @param ctx RequestContext
   * @param credentials LoginInput
   * @returns Access and refresh tokens.
   */
  async loginEmployee(ctx: RequestContext, credentials: LoginInput): Promise<{ accessToken: string; refreshToken: string }> {
    return this.login(ctx, credentials, ROLE.EMPLOYEE);
  }

  /**
   * Generates authentication tokens for a user.
   * @param ctx RequestContext
   * @param user User object
   * @returns Auth tokens (access and refresh)
   */
  private async generateAuthTokens(ctx: RequestContext, user: User): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(ctx, `${this.generateAuthTokens.name} was called`);

    const tokenConfig = user.role === ROLE.CUSTOMER ? config.jwt.customer : config.jwt.employee;

    if (!tokenConfig) {
      throw new HttpException('Invalid user role', HttpStatus.BAD_REQUEST);
    }

    const accessTokenClaims: UserAccessTokenClaims = { username: user.username, uuid: uuidv1() };
    const refreshTokenClaims: UserRefreshTokenClaims = { username: user.username, uuid: uuidv4() };

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
