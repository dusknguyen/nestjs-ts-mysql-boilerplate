import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { LoggerCustom } from '../services';
/**
 *
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private passUrl: string[] = ['/health', '/graphql'];
  /**
   *
   */
  constructor(private readonly logger: LoggerCustom) {}
  /**
   *
   */
  public use(req: Request, res: Response, next: () => void): void {
    if (this.passUrl.includes(req.originalUrl)) {
      return next();
    }
    req.id = req.header('X-Request-Id') || nanoid();
    res.setHeader('X-Request-Id', req.id);
    // Provide a fallback value if req.ip is undefined
    const ip = req.ip ?? 'unknown-ip';
    const user = req.user?.userId || '';
    this.logger.log(`${req.method} ${req.originalUrl} ${req.id} - ${ip.replace('::fff:', '')} ${user} - ${JSON.stringify(req.cookies)}`);
    return next();
  }
}
