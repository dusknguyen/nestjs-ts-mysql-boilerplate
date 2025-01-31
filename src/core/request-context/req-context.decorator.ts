import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestContext } from './request-context.dto';
import { createRequestContext } from '.';

/**
 * Custom decorator to inject RequestContext into route handlers.
 * Extracts request information and populates a RequestContext instance.
 */
export const ReqContext = createParamDecorator((_data: unknown, ctx: ExecutionContext): RequestContext => {
  const request = ctx.switchToHttp().getRequest();
  return createRequestContext(request);
});
