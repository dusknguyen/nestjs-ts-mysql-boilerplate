import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { ValidationPipe, BadGatewayException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import configuration from './config';
import { gateway } from 'app.gateway';

/**
 *
 */
async function bootstrap(): Promise<void> {
  const config = configuration(); // Fetch the parsed configuration
  const isProduction = config.app.environment === 'production';

  // Initialize NestJS application with buffer logs and conditionally configure logger
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: isProduction
      ? WinstonModule.createLogger({
          level: 'info',
          format: winston.format.json(),
          transports: [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
            }),
            new winston.transports.File({
              filename: 'logs/query.log',
              level: 'query',
            }),
            new winston.transports.File({
              filename: 'logs/info.log',
              level: 'info',
            }),
            new winston.transports.Console({
              format: winston.format.combine(winston.format.colorize(), winston.format.json()),
            }),
          ],
        })
      : undefined,
  });

  // Global validation pipe with custom exception handling
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => new BadGatewayException(validationErrors),
    }),
  );

  // Configure Redis microservice with options from config
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: config.redis.host,
      port: config.redis.port,
      wildcards: true,
    },
  });

  // Set API versioning from config, fallback to '1' if not provided
  app.setGlobalPrefix(`api/v${config.app.version || '1'}`);
  // Apply gateway
  gateway(app);
  // Apply middleware
  middleware(app);
  // Swagger configuration
  const swaggerOptions = new DocumentBuilder()
    .setTitle('OpenAPI Documentation')
    .setDescription('The sample API description')
    .setVersion(`${config.app.version || '1'}`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      withCredentials: true,
    },
  });

  // Configure trust proxy if in production
  if (isProduction) {
    app.enable('trust proxy');
  }

  // Start application with configured port or default
  await app.listen(config.app.port || 3001);
}

bootstrap()
  .then(() => console.log(`Bootstrap on port ${configuration().app.port || 3000}`, new Date().toLocaleString()))
  .catch(console.error);
