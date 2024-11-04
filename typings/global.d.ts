export declare global {
  namespace Express {
    interface Request {
      id: string;
    }
    interface User extends Payload {
      userId: string;
    }
    export interface Payload {
      userId: string;
      timestamp: string;
    }
  }
}
