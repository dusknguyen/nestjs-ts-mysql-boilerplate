import dotenv from 'dotenv';
import { JwtAlgorithm } from 'shared/type/algorithm';
import { z } from 'zod';

dotenv.config();

// Define and validate environment variables schema
const configSchema = z.object({
  // General settings
  PORT: z.string().regex(/^\d+$/).transform(Number).default('8349'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VERSION: z.string().regex(/^\d+$/).transform(Number).default('1'),

  // JWT Configuration
  JWT_CUSTOMER_ACCESS_PUBLIC_KEY: z.string().optional().default(''),
  JWT_CUSTOMER_ACCESS_PRIVATE_KEY: z.string().optional().default(''),
  JWT_CUSTOMER_ACCESS_ALGORITHMS: z.string().optional().default('RS256'),
  JWT_CUSTOMER_REFRESH_PUBLIC_KEY: z.string().optional().default(''),
  JWT_CUSTOMER_REFRESH_PRIVATE_KEY: z.string().optional().default(''),
  JWT_CUSTOMER_REFRESH_ALGORITHMS: z.string().optional().default('RS256'),
  JWT_EMPLOYEE_ACCESS_PUBLIC_KEY: z.string().optional().default(''),
  JWT_EMPLOYEE_ACCESS_PRIVATE_KEY: z.string().optional().default(''),
  JWT_EMPLOYEE_ACCESS_ALGORITHMS: z.string().optional().default('RS256'),
  JWT_EMPLOYEE_REFRESH_PUBLIC_KEY: z.string().optional().default(''),
  JWT_EMPLOYEE_REFRESH_PRIVATE_KEY: z.string().optional().default(''),
  JWT_EMPLOYEE_REFRESH_ALGORITHMS: z.string().optional().default('RS256'),

  // Crypto Keys
  PUBLIC_KEY_PEM: z.string().default(''),
  PRIVATE_KEY_PEM: z.string().default(''),

  // MySQL settings
  DB_TYPE: z.string().default('mysql'),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number).default('3306'),
  DB_USER: z.string().default('username'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('dbname'),
  DB_CONNECTION_LIMIT: z.string().regex(/^\d+$/).transform(Number).default('10'),

  // Redis settings
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.string().regex(/^\d+$/).transform(Number).default('6379'),
});

// Parse and validate environment variables
const config = configSchema.parse(process.env);

// Configuration object
const configuration = () => ({
  app: {
    port: config.PORT,
    environment: config.NODE_ENV,
    version: config.VERSION,
    apiKey: 'key',
  },
  jwt: {
    customer: {
      accessToken: {
        publicKey: config.JWT_CUSTOMER_ACCESS_PUBLIC_KEY,
        privateKey: config.JWT_CUSTOMER_ACCESS_PRIVATE_KEY,
        algorithms: config.JWT_CUSTOMER_ACCESS_ALGORITHMS as JwtAlgorithm,
      },
      refreshToken: {
        publicKey: config.JWT_CUSTOMER_REFRESH_PUBLIC_KEY,
        privateKey: config.JWT_CUSTOMER_REFRESH_PRIVATE_KEY,
        algorithms: config.JWT_CUSTOMER_REFRESH_ALGORITHMS as JwtAlgorithm,
      },
    },
    employee: {
      accessToken: {
        publicKey: config.JWT_EMPLOYEE_ACCESS_PUBLIC_KEY,
        privateKey: config.JWT_EMPLOYEE_ACCESS_PRIVATE_KEY,
        algorithms: config.JWT_EMPLOYEE_ACCESS_ALGORITHMS as JwtAlgorithm,
      },
      refreshToken: {
        publicKey: config.JWT_EMPLOYEE_REFRESH_PUBLIC_KEY,
        privateKey: config.JWT_EMPLOYEE_REFRESH_PRIVATE_KEY,
        algorithms: config.JWT_EMPLOYEE_REFRESH_ALGORITHMS as JwtAlgorithm,
      },
    },
  },
  crypto: {
    publicKeyPem: config.PUBLIC_KEY_PEM,
    privateKeyPem: config.PRIVATE_KEY_PEM,
  },
  db: {
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    extra: {
      connectionLimit: config.DB_CONNECTION_LIMIT,
    },
    autoLoadEntities: config.NODE_ENV === 'development',
  },
  redis: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

export type Config = ReturnType<typeof configuration>;
export default configuration;
