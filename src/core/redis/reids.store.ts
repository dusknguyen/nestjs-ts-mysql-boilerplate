import type * as Fastify from 'fastify';
import { SessionStore } from '../../../typings/session';
import { redisClients } from './redis.client';
type Callback = (err?: Error) => void;
type CallbackSession = (err: Error | null, session?: Fastify.Session) => void;

/**
 *
 */
export class RedisSessionStore implements SessionStore {
  /**
   *
   */
  set(sessionId: string, session: Fastify.Session, callback: Callback): void {
    const maxAge = session.cookie?.maxAge ?? 86400 * 1000; // Mặc định 1 ngày nếu undefined
    redisClients.session
      .set(sessionId, JSON.stringify(session), 'EX', Math.floor(maxAge / 1000))
      .then(() => callback())
      .catch(callback);
  }

  /**
   *
   */
  get(sessionId: string, callback: CallbackSession): void {
    redisClients.session
      .get(sessionId)
      .then((data) => callback(null, data ? JSON.parse(data) : undefined))
      .catch(callback);
  }

  /**
   *
   */
  destroy(sessionId: string, callback: Callback): void {
    redisClients.session
      .del(sessionId)
      .then(() => callback())
      .catch(callback);
  }
}
