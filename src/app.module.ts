/* eslint-disable @typescript-eslint/no-misused-promises */

import { BullModule } from '@nestjs/bull';
import { Module, CacheModule, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

import { configuration } from './config';
import { AuthModule } from './modules/auth';
import { ClientModule } from './modules/client/client.module';
import { CommonModule, ExceptionsFilter, LoggerMiddleware } from './modules/common';
import { CountryModule } from './modules/country';
import { HealthModule } from './modules/health';
import { InitDbModule } from './modules/init/init.module';
import { MessageModule } from './modules/message';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env['REDIS_HOST'] || 'localhost',
        port: Number(process.env['REDIS_PORT'] || '6379'),
      },
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url: `redis://${process.env['REDIS_HOST'] || 'localhost'}:${Number(process.env['REDIS_PORT'] || '6379')}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get('db'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    // Service Modules
    CommonModule, // Global
    ClientModule, // Control Clients
    HealthModule,
    InitDbModule,
    AuthModule,
    CountryModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
