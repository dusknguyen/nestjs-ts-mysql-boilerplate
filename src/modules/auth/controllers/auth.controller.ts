import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services';
import { LoginDto } from '../dtos';
import { AuthTokenDto } from '../dtos/auth-token.dto';
/**
 * https://docs.nestjs.com/techniques/authentication
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   *
   */
  constructor(private auth: AuthService) {}
  /**
   *
   */
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
    type: AuthTokenDto, // Response type
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Forbidden.' })
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.auth.login(loginDto);
  }

  /**
   *
   */
  @Post('refresh-token')
  @ApiResponse({
    status: 200,
    description: 'Refresh Token successfully',
    type: AuthTokenDto, // Response type
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Forbidden.' })
  public async refreshToken(@Body() loginDto: LoginDto): Promise<any> {
    return this.auth.login(loginDto);
  }
}
