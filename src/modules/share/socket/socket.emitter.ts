/* eslint-disable @typescript-eslint/no-explicit-any */
import { Emitter } from '@socket.io/redis-emitter';
import { createClient } from 'redis';

export class SocketEmitter {
  private static instance: SocketEmitter;
  public io: any;

  private constructor() {
    const redisClient = createClient({ url: `${process.env['REDIS_HOST'] || 'localhost'}${Number(process.env['REDIS_PORT'] || '6379')}` });
    this.io = new Emitter(redisClient);
  }

  public static getInstance(): SocketEmitter {
    if (!SocketEmitter.instance) {
      SocketEmitter.instance = new SocketEmitter();
    }
    return SocketEmitter.instance;
  }

  public async sendEvent(socketId: any): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.io.to(socketId).emit('', '');
  }
}
