import { FastifyRequest } from 'fastify';
import { RequestContext } from './request-context.dto';
import { USER_ID } from 'shared/constants/common';
import { v4 as uuidv4, validate } from 'uuid';

/**
 * Creates a RequestContext from the FastifyRequest.
 * Ensures that a valid request ID is assigned and captures relevant request details.
 *
 * @param request - The incoming FastifyRequest object.
 * @returns A populated RequestContext instance.
 */
export function createRequestContext(request: FastifyRequest): RequestContext {
  const ctx = new RequestContext();

  // Retrieve the request ID from headers or generate a new one
  const customRequestId = request.id as string;
  ctx.reqId = customRequestId && validate(customRequestId) ? customRequestId : uuidv4();

  // Capture request URL
  ctx.url = request.originalUrl || '';

  // Capture client IP address
  ctx.ip = request.ip || '';

  // Capture user ID from headers, if available
  ctx.user = request.headers[USER_ID.toLowerCase()] as string | undefined;

  ctx.pid = `${process.pid}`;
  return ctx;
}
