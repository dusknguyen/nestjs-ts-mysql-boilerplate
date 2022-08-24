/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { Response } from 'express';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements GqlExceptionFilter {
  private readonly logger: Logger = new Logger();

  public override catch(exception: any, host: ArgumentsHost): void {
    let args: unknown;
    const status = this.getHttpStatus(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (status === HttpStatus.BAD_GATEWAY) {
      response.status(400).json({
        code: 1,
        message: 'Data validation fail',
        data: exception?.response.message.map((message: any) => message?.constraints),
      });
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (exception instanceof Error) {
        this.logger.error(`${exception.message}: ${args}`, exception.stack);
        response.status(status).json({
          code: 1,
          message: exception.message,
          data: null,
        });
      } else {
        this.logger.error('UnhandledException', exception);
      }
    } else {
      response.status(status).json({
        code: exception.response.code ? exception.response.code : -1,
        message: exception.message,
        data: null,
      });
    }
  }

  private getHttpStatus(exception: unknown): number {
    return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
