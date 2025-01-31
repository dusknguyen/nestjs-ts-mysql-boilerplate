import { createRequestContext } from 'core/request-context';

/**
 * Generates a unique request ID.
 * @param req - The incoming request object.
 * @returns The generated request ID.
 */
const genReqId = (req: any): string => {
  const requestContext = createRequestContext(req);
  return requestContext.reqId;
};

export default genReqId;
