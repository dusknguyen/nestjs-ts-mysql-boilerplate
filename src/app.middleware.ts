import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import configuration from 'config';
import path from 'path';
import { hash256 } from 'shared/crypto/hash';
import fastifyIO from 'fastify-socket.io';

const config = configuration();

/**
 * Setup middleware and essential plugins for the Fastify server.
 *
 * @param fastify The Fastify instance.
 * @returns The Fastify instance with middleware and plugins registered.
 */
export async function middleware(fastify: ReturnType<typeof Fastify>): Promise<ReturnType<typeof Fastify>> {
  const isProduction = config.app.environment === 'production';

  // Enable Cross-Origin Resource Sharing (CORS)
  await fastify.register(fastifyCors, {
    origin: true, // Allow all origins
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow credentials such as cookies
  });

  // Register essential plugins for compression and cookie handling
  await fastify.register(require('@fastify/compress'));
  await fastify.register(require('@fastify/cookie'));

  // Configure session management
  await fastify.register(require('@fastify/session'), {
    secret: hash256('session'), // Secret used to sign the session ID cookie
    cookie: {
      secure: isProduction, // Secure cookie in production environment
      maxAge: 1 * 60 * 60 * 1000, // 1 hour session expiration
    },
    saveUninitialized: false, // Do not save uninitialized sessions
    resave: false, // Do not force saving the session to the store on every request
  });

  // Register Helmet for securing HTTP headers
  await fastify.register(require('@fastify/helmet'), {
    contentSecurityPolicy: isProduction ? undefined : false, // Disable CSP in non-production for easier dev setup
  });

  // Initialize Passport for authentication
  await fastify.register(require('@fastify/passport').initialize());
  await fastify.register(require('@fastify/passport').secureSession());

  // Serve static files from the 'public' folder
  await fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '..', 'public'),
    head: false, // Disable 'head' property for static files
  });

  // Register Socket.IO for WebSocket functionality
  await fastify.register(fastifyIO);

  return fastify;
}
