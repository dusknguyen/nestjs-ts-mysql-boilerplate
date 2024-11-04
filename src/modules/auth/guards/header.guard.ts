import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { AUTH_STRATEGY } from 'shared/constants/strategy.constant';
/**
 *
 */
@Injectable()
export class HeaderAuthGuard extends AuthGuard(AUTH_STRATEGY.API_KEY) {
  /**
   *
   */
  public override getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext<{ req: Request }>();
      return ctx.req;
    }
    return context.switchToHttp().getRequest<Request>();
  }
}
