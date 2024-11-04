import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Define the schema for environment variables
const configSchema = z.object({
  // General settings
  PORT: z.string().regex(/^\d+$/).transform(Number).default('8349'),
  JWT_SECRET: z.string().default('secretKey'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VERSION: z.string().regex(/^\d+$/).transform(Number).default('1'),
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

// Define the config object based on parsed environment variables
const configuration = () => ({
  // General configuration
  app: {
    port: config.PORT,
    jwtSecret: config.JWT_SECRET,
    environment: config.NODE_ENV,
    version: config.VERSION,
  },

  // Database configuration
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
    synchronize: true,
    autoLoadEntities: true,
    migrationsRun: true,
    migrationsTableName: 'migrations_typeorm',
    cli: {
      migrationsDir: 'migrations',
    },
  },

  // Redis configuration
  redis: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

export type Config = ReturnType<typeof configuration>;

export default configuration;
