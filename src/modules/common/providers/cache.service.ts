/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import bluebird from 'bluebird';
import * as redis from 'redis';

export class CacheService {
  private client: any;

  constructor() {
    const url = process.env['REDIS_URL'] || '';
    bluebird.promisifyAll(redis);
    this.client = redis.createClient({
      url,
    });
    this.client.on('error', () => {
      if (this.client) this.client.quit();
    });
  }

  public async setAsync(...params: any[]): Promise<void> {
    return this.client.setAsync(params);
  }

  public async getAsync(...params: any[]): Promise<string | null> {
    return this.client.getAsync(params);
  }

  public async delAsync(...params: any[]): Promise<void> {
    return this.client.delAsync(params);
  }

  public async ttlAsync(...params: any[]): Promise<void> {
    return this.client.ttlAsync(params);
  }
}
