import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { ValidationPipe, BadGatewayException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import configuration from './config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { HEADER_KEY } from 'shared/constants/strategy.constant';
import { loggerInstance } from 'core/services/logger.service';
import { IncomingMessage } from 'http';
import genReqId from 'core/request-context/genReqId';

/**
 * Main application bootstrap function that configures and starts the NestJS app.
 */
async function bootstrap(): Promise<void> {
  const config = configuration(); // Fetch configuration from the 'config' module
  const isProduction = config.app.environment === 'production';
  // Initialize NestJS application with Fastify as the HTTP adapter and custom logger
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      loggerInstance: loggerInstance, // Custom logger configuration
      genReqId: (req: IncomingMessage) => genReqId(req), // Request ID generator for tracking
    }),
  );

  // Apply global validation pipe with custom exception handling for validation errors
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true, // Hide detailed error messages from the client
      transform: true, // Automatically transform incoming payloads to DTO objects
      exceptionFactory: (validationErrors: ValidationError[] = []) => new BadGatewayException(validationErrors),
    }),
  );

  // Set up a microservice (Kafka transport in this case)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:8354'], // Kafka broker configuration
      },
    },
  });

  // Set the global API prefix using versioning from the config
  app.setGlobalPrefix(`api/v${config.app.version || '1'}`);

  // Apply custom middleware for the application
  middleware(app);

  if (!isProduction) {
    // Configure Swagger (OpenAPI) documentation for the API
    const swaggerOptions = new DocumentBuilder()
      .setTitle('OpenAPI Documentation') // Set title of the API documentation
      .setDescription('The sample API description') // Set description
      .setVersion(`${config.app.version || '1'}`) // Set API version from config
      .addBearerAuth() // Enable bearer authentication
      .addApiKey(
        {
          name: HEADER_KEY.API_KEY, // API key for authentication
          in: 'header',
          type: 'apiKey',
        },
        HEADER_KEY.API_KEY,
      )
      .build();
    const document = SwaggerModule.createDocument(app, swaggerOptions); // Generate the Swagger document
    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: {
        withCredentials: true, // Enable cross-origin credentials in Swagger UI
      },
    });
  }

  // Start the application and listen on the configured port
  await app.listen(config.app.port || 3001); // Default to port 3001 if not set in config
}

// Bootstrap the application and log success message
bootstrap()
  .then(() =>
    console.log(
      `Bootstrap on port ${configuration().app.port || 3000}`,
      new Date().toLocaleString(),
      `\n OpenAPI Documentation: http://localhost:${configuration().app.port || 3000}/swagger`,
      `\n Graphql Documentation: http://localhost:${configuration().app.port || 3000}/graphql`,
    ),
  )
  .catch(console.error);
