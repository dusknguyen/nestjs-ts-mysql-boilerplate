import { Body, ClassSerializerInterceptor, Controller, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { AuthTokenOutput } from '../dtos/auth-token-output.dto';
import { AuthService } from '../services/auth.service';
import { AppLogger } from 'core/services';
import { ReqContext } from 'core/request-context/req-context.decorator';
import { RequestContext } from 'core/request-context/request-context.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseApiResponse, createSwaggerApiResponse } from 'core/dtos/base-api-response.dto';
import { BaseApiErrorObject } from 'core/dtos/base-api.exception';
import { RegisterInput } from '../dtos/auth-register.dto';
import { JwtCustomerRefreshGuard } from '../guards/jwt-customer-refresh.guard';
import { USER_ID } from 'shared/constants/common';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { HEADER_KEY } from 'shared/constants/strategy.constant';

/**
 * Handles authentication actions like login, registration, and token refresh for customers and employees.
 */
@UseGuards(ApiKeyGuard) // Guard for API key validation
@ApiSecurity(HEADER_KEY.API_KEY) // API key security configuration for Swagger
@ApiTags('auth') // Swagger tag for API categorization
@Controller('auth') // Base route for all authentication-related endpoints
export class AuthController {
  /**
   * Constructs the AuthController with AuthService and AppLogger.
   * Initializes logger context for AuthController.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name); // Set the context for logging
  }

  /**
   * Logs in a customer and returns an access token.
   * Sets a refresh token cookie for maintaining sessions.
   * @param ctx - Request context, includes user information and metadata.
   * @param credential - Login credentials provided by the customer.
   * @param reply - Fastify reply object for setting cookies in the response.
   * @returns The access token for the authenticated customer.
   */
  @Post('login')
  @ApiOperation({ summary: 'Customer Login' })
  @ApiResponse({ status: HttpStatus.CREATED, type: createSwaggerApiResponse(AuthTokenOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorObject })
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @ReqContext() ctx: RequestContext,
    @Body() credential: LoginInput,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.login.name} was called`);
    const data = await this.authService.loginCustomer(ctx, credential);

    reply.setCookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken: data.accessToken };
  }

  /**
   * Logs in an employee and returns an access token.
   * Sets a refresh token cookie for maintaining sessions.
   * @param ctx - Request context, includes user information and metadata.
   * @param credential - Login credentials for the employee.
   * @param reply - Fastify reply object for setting cookies in the response.
   * @returns The access token for the authenticated employee.
   */
  @Post('login/employee')
  @ApiOperation({ summary: 'Employee Login' })
  @ApiResponse({ status: HttpStatus.CREATED, type: createSwaggerApiResponse(AuthTokenOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorObject })
  @UseInterceptors(ClassSerializerInterceptor)
  async loginEmployee(
    @ReqContext() ctx: RequestContext,
    @Body() credential: LoginInput,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    this.logger.log(ctx, `${this.login.name} was called`);
    const data = await this.authService.loginEmployee(ctx, credential);

    reply.setCookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { data: { accessToken: data.accessToken }, meta: {} };
  }

  /**
   * Registers a new customer.
   * @param ctx - Request context for logging.
   * @param credential - Registration details for the new customer.
   * @returns A success response indicating the registration was successful.
   */
  @Post('register')
  @ApiOperation({ summary: 'Customer Register' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorObject })
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@ReqContext() ctx: RequestContext, @Body() credential: RegisterInput): Promise<BaseApiResponse<any>> {
    this.logger.log(ctx, `${this.register.name} was called`);
    await this.authService.registerCustomer(ctx, credential);

    return { data: {}, meta: {} };
  }

  /**
   * Refreshes the customer's access token using the refresh token.
   * Sets a new refresh token cookie for continued session validity.
   * @param ctx - Request context for logging and user identification.
   * @param request - The HTTP request containing the refresh token.
   * @param reply - Fastify reply object to set new cookies in the response.
   * @returns The newly refreshed access token.
   */
  @UseGuards(JwtCustomerRefreshGuard) // Guard to verify the refresh token
  @Post('refresh-token')
  @ApiOperation({ summary: 'Customer Refresh Token' })
  @ApiResponse({ status: HttpStatus.CREATED, type: createSwaggerApiResponse(AuthTokenOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorObject })
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @ReqContext() ctx: RequestContext,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`);
    const data = await this.authService.refreshCustomer(ctx, +(request.headers[USER_ID.toLowerCase()] as string));

    reply.setCookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken: data.accessToken }; // Return refreshed access token
  }

  /**
   * Refreshes the employee's access token using the refresh token.
   * Sets a new refresh token and access token cookie for the employee.
   * @param ctx - Request context for logging and user identification.
   * @param credential - Login credentials for employee.
   * @param reply - Fastify reply object to set cookies.
   * @returns The newly refreshed access token for the employee.
   */
  @Post('refresh-token/employee')
  @ApiOperation({ summary: 'Employee Refresh Token' })
  @ApiResponse({ status: HttpStatus.CREATED, type: createSwaggerApiResponse(AuthTokenOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorObject })
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshTokenEmployee(
    @ReqContext() ctx: RequestContext,
    @Body() credential: LoginInput,
    @Res() reply: FastifyReply,
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`);
    const data = await this.authService.loginCustomer(ctx, credential);

    reply.setCookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    reply.setCookie('accessToken', data.accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken: data.accessToken }; // Return refreshed access token for employee
  }
}
