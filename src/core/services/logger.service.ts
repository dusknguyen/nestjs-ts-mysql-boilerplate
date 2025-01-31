import { Injectable, Scope } from '@nestjs/common';
import pino from 'pino';
import { RequestContext } from 'core/request-context/request-context.dto';
import configuration from 'config';

// Load configuration and determine if the environment is production
const config = configuration();
const isProduction = config.app.environment === 'production';

// Initialize transport streams for pino logger based on environment
const transports = [];
if (!isProduction) {
  transports.push(
    pino.transport({
      target: 'pino-pretty', // Pretty print logs for development
      options: {
        colorize: true, // Enable colorization for easier reading
        translateTime: 'SYS:standard', // Standardize time format
        ignore: 'pid,hostname', // Ignore unnecessary fields
      },
    }),
  );
}
if (isProduction) {
  transports.push(
    pino.transport({
      target: 'pino/file', // Log errors to file in production
      options: { destination: 'logs/error.log', level: 'error' },
    }),
    pino.transport({
      target: 'pino/file', // Log queries to file in production
      options: { destination: 'logs/query.log', level: 'query' },
    }),
    pino.transport({
      target: 'pino/file', // Log info messages to file in production
      options: { destination: 'logs/info.log', level: 'info' },
    }),
  );
}

// Create a logger instance with the defined transport streams
export const loggerInstance = pino(
  pino.multistream(transports), // Enable multiple transport streams
);

/**
 * Custom logging service with dynamic context support.
 * Uses pino for structured logging, supporting different log levels.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private context?: string; // Context for the logger to tag logs

  /**
   * Constructor to initialize the logger service.
   */
  constructor() {}

  /**
   * Sets the context for the logger to identify where the log is coming from.
   *
   * @param context - Context to be set for the logger.
   */
  public setContext(context: string): void {
    this.context = context;
  }

  /**
   * Logs an error message.
   *
   * @param ctx - RequestContext to capture additional request-specific information.
   * @param message - The error message to log.
   * @param meta - Optional metadata for additional context.
   */
  error(ctx: RequestContext, message: string, meta?: Record<string, any>) {
    loggerInstance.error({
      message,
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  /**
   * Logs a warning message.
   *
   * @param ctx - RequestContext for additional context.
   * @param message - The warning message to log.
   * @param meta - Optional metadata for further context.
   */
  warn(ctx: RequestContext, message: string, meta?: Record<string, any>) {
    loggerInstance.warn({
      message,
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  /**
   * Logs a debug message.
   *
   * @param ctx - RequestContext to capture context.
   * @param message - The debug message to log.
   * @param meta - Optional metadata for additional context.
   */
  debug(ctx: RequestContext, message: string, meta?: Record<string, any>) {
    loggerInstance.debug({
      message,
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  /**
   * Logs a trace message.
   *
   * @param ctx - RequestContext for request-specific context.
   * @param message - The trace message to log.
   * @param meta - Optional metadata for additional context.
   */
  trace(ctx: RequestContext, message: string, meta?: Record<string, any>) {
    loggerInstance.trace({
      message,
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  /**
   * Logs a general info message.
   *
   * @param ctx - RequestContext to capture additional context.
   * @param message - The info message to log.
   * @param meta - Optional metadata for further context.
   */
  log(ctx: RequestContext, message: string, meta?: Record<string, any>) {
    loggerInstance.info({
      message,
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }
}
