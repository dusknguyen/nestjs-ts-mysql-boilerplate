import { Injectable, Logger, Scope } from '@nestjs/common';
import { RequestContext } from './request-context.service';

/**
 *
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerCustom extends Logger {
  /**
   *
   */
  constructor(
    private req: RequestContext,
    context: string,
  ) {
    super(context);
  }

  /**
   * Get the request context ID if available
   */
  private get reqContext(): string {
    return this.req.context?.id.toString() || '';
  }

  /**
   * Custom log method override
   */
  public override log(message: unknown, context?: string): void {
    super.log(message, this.devContext(context));
  }

  /**
   * Custom error method override
   */
  public override error(message: unknown, trace?: string, context?: string): void {
    console.error(this.prodContext(context), message, '\n', trace);
  }

  /**
   * Get the current context or fallback to default
   */
  private getContext(context?: string): string {
    return context || this.context || '';
  }

  /**
   * Production logging context with timestamp and optional request context ID
   */
  private prodContext(context?: string): string {
    let prefix = new Date().toLocaleString();
    if (this.reqContext) {
      prefix += ` [${this.reqContext}]`;
    }
    const ctx = this.getContext(context);
    if (ctx) {
      prefix += ` [${ctx}]`;
    }
    return prefix;
  }

  /**
   * Development logging context with request context ID if available
   */
  private devContext(context?: string): string {
    const prefix = [];
    if (this.reqContext) {
      prefix.push(this.reqContext);
    }
    const ctx = this.getContext(context);
    if (ctx) {
      prefix.push(ctx);
    }
    return `[dev][${context || 'info'}]`;
  }
}
