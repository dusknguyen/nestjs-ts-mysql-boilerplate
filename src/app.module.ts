import { BullModule } from '@nestjs/bullmq';
import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule, ExceptionsFilter } from './core';
import { HealthModule } from './modules/health';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlModule } from 'modules/gql';
import configuration from 'config';
import { AuthModule } from 'modules/auth/auth.module';
import { CacheModule } from 'shared/cache';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { FastifyRequest } from 'fastify';
import { GatewayModule } from 'modules/gateway/gateway.module';

const config = configuration();
const isProduction = config.app.environment === 'production';
/**
 * Main application module. Sets up all dependencies, including
 * caching, GraphQL, authentication, and various custom modules.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      load: [configuration], // Loads configuration from the 'config' module
    }),

    // BullModule configuration for Redis connection
    BullModule.forRoot({
      connection: {
        host: config.redis.host, // Redis host
        port: config.redis.port, // Redis port
      },
    }),

    // CacheModule configuration with Redis store using Keyv
    CacheModule.registerAsync({
      useFactory: async () => {
        const keyv = new Keyv(
          new KeyvRedis(`redis://${config.redis.host}:${config.redis.port}`, {
            namespace: 'app-module-cache', // Namespace for cache entries
          }),
        );
        return {
          keyv,
          ttl: 60 * 60000, // Cache TTL in milliseconds (1 hour)
          max: 100, // Maximum number of items in cache
        };
      },
    }),

    // GraphQL configuration using Apollo Driver
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: `/graphql`, // GraphQL endpoint
      driver: ApolloDriver, // Use Apollo as the GraphQL driver
      autoSchemaFile: true, // Automatically generate the schema file
      sortSchema: true, // Sort schema for readability
      playground: !isProduction, // Enable GraphQL Playground in development
      introspection: true, // Enable introspection of the schema
      context: ({ req }: { req: FastifyRequest }) => ({ req }), // Inject request into context
      formatError: (error) => ({
        message: error.message, // Format error message
        code: error.extensions?.['code'] || 'INTERNAL_SERVER_ERROR', // Set error code
        status: (error.extensions?.['exception'] as any)?.status || 500, // Set status code
      }),
    }),

    // Application modules
    CommonModule, // Core shared functionality
    GqlModule, // GraphQL related functionality
    HealthModule, // Health check functionality
    AuthModule, // Authentication functionality
    GatewayModule, // Gateway functionality for WebSocket or microservices
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter, // Handle exceptions across the application
    },
    // Global interceptor for class serialization
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // Automatically serialize objects based on their decorators
    },
  ],
})
export class AppModule {}
