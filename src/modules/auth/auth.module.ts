import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../core';
import { AuthController } from './controllers';
import { AuthService } from './services';
import * as entities from 'entities';
/**
 *
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwtSecret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(Object.values(entities)),
    CommonModule,
    PassportModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
