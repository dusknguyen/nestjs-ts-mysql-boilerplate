/**
 * Represents the context of an incoming request.
 * Captures essential metadata such as request ID, URL, IP, and user.
 */
export class RequestContext {
  /** Unique identifier for the request */
  reqId!: string;

  /** The requested URL */
  url!: string;

  /** IP address of the requester */
  ip!: string;

  /** Optional user identifier extracted from the request */
  user?: string;

  pid!: string;
}
