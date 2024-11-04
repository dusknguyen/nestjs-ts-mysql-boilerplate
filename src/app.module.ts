import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, NestModule, MiddlewareConsumer, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from 'database/dataSource';
import { AuthModule } from './modules/auth';
import { CommonModule, ExceptionsFilter, LoggerMiddleware } from './core';
import { HealthModule } from './modules/health';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlModule } from 'modules/gql';
import configuration from 'config';
import { RedisClientOptions } from 'redis';

/**
 *
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Use ConfigService to set up BullModule for Redis
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host', 'localhost'),
          port: configService.get<number>('redis.port', 6379),
        },
      }),
      inject: [ConfigService],
    }),

    // CacheModule using Redis configuration from ConfigService
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        url: `redis://${configService.get<string>('redis.host', 'localhost')}:${configService.get<number>('redis.port', 6379)}`,
        ttl: 10, // seconds
        max: 100, // max number of items in cache
      }),
      inject: [ConfigService],
    }),

    // TypeOrmModule configured using async factory with external ORM configuration
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...(await ormConfig).options,
      }),
    }),

    // Static files serving configuration
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),

    // GraphQL configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: '/graphql',
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
    }),

    // Application modules
    CommonModule,
    GqlModule,
    HealthModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   *
   */
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
