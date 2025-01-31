import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthJWTService } from './services/auth-jwt.service';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from 'core/common.module';

/**
 * Authentication module for handling user login, registration, and token management.
 */
@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [AuthService, AuthJWTService, JwtService],
  exports: [AuthService, AuthJWTService], // Export if other modules require these services
})
export class AuthModule {}
