import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from 'src/entity';

import { CommonModule } from '../common';
import { AuthenticationSerializer, AuthenticationService, LocalStrategy, JwtStrategy, JwtVerifyStrategy } from '../common/authentication';
import { CacheManager } from '../share';
import { AuthController } from './controllers';
import { AuthService } from './providers';

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
  providers: [AuthService, AuthenticationSerializer, AuthenticationService, LocalStrategy, JwtStrategy, JwtVerifyStrategy, CacheManager],
  controllers: [AuthController],
})
export class AuthModule {}
