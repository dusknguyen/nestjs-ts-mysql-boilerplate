import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import express from 'express';
import redisStore from 'core/redis/session.store';

/**
 *
 */
export async function middleware(app: INestApplication): Promise<INestApplication> {
  // Inject ConfigService for accessing environment variables
  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>('app.environment') === 'production';
  const sessionSecret = configService.get<string>('app.sessionSecret', 'defaultSecret'); // Default if missing

  // Enable CORS with specified options
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  });

  // Register essential middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Configure session with Redis store and session secret from ConfigService
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: isProduction,
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
      },
      store: redisStore,
    }),
  );

  app.use(cookieParser());
  app.use(compression());

  // Configure Helmet with CSP disabled in development mode
  app.use(helmet({ contentSecurityPolicy: isProduction ? undefined : false }));

  // Initialize Passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  return app;
}
