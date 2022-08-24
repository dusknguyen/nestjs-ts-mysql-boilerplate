/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class PagerMiddleware implements NestMiddleware {
  public use(req: any, _res: any, next: () => void): void {
    const page = +req.query.page || 1;
    const size = +req.query.size || 10;
    const offset = (page - 1) * size;
    req.query.offset = offset;
    req.query.limit = size;
    next();
  }
}
