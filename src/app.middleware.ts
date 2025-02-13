import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import configuration from 'config';
import path from 'path';
import { hash256 } from 'shared/crypto/hash';
import { RedisSessionStore } from 'core/redis/reids.store';

const config = configuration();

/**
 * Maximum performance Fastify middleware optimized for NestJS.
 *
 * @param fastify The Fastify instance.
 * @returns The Fastify instance with all middleware registered.
 */
export async function middleware(fastify: ReturnType<typeof Fastify>): Promise<ReturnType<typeof Fastify>> {
  const isProduction = config.app.environment === 'production';

  try {
    // 🔥 Register all performance plugins in parallel
    await Promise.all([
      // ✅ CORS Optimization
      fastify.register(fastifyCors, {
        origin: isProduction ? [/\.mydomain\.com$/] : true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
      }),

      // ✅ Brotli Compression (Faster & Better than Gzip)
      fastify.register(require('@fastify/compress'), {
        global: true,
        brotli: { enabled: true },
        threshold: 512,
        fast: true,
      }),

      // ✅ Cookie & Session Management
      fastify.register(require('@fastify/cookie')),
      fastify.register(require('@fastify/session'), {
        secret: hash256('session'),
        cookie: {
          secure: isProduction,
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'lax',
        },
        saveUninitialized: false,
        rolling: true,
        store: RedisSessionStore,
      }),

      // ✅ Security Headers Optimization
      fastify.register(require('@fastify/helmet'), {
        global: true,
        contentSecurityPolicy: isProduction ? undefined : false,
        frameguard: { action: 'deny' },
        dnsPrefetchControl: { allow: false },
        referrerPolicy: { policy: 'no-referrer' },
        xssFilter: true,
      }),

      // ✅ Static File Optimization with Long Cache
      fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '..', 'public'),
        cacheControl: true,
        maxAge: isProduction ? '1y' : '0',
        immutable: isProduction,
      }),

      // ✅ Rate Limiting (Prevent DoS Attacks)
      fastify.register(require('@fastify/rate-limit'), {
        max: 1000, // Allow 1000 requests per minute
        timeWindow: '1 minute',
      }),

      // ✅ Multipart Handling (Efficient File Uploads)
      fastify.register(require('@fastify/multipart'), {
        limits: {
          fileSize: 50 * 1024 * 1024, // 50MB max file size
        },
      }),
    ]);

    // 🏆 Secure Authentication Middleware
    await fastify.register(require('@fastify/passport').initialize());
    await fastify.register(require('@fastify/passport').secureSession());
  } catch (error) {
    console.error('❌ Error registering plugins:', error);
    throw error;
  }

  return fastify;
}
