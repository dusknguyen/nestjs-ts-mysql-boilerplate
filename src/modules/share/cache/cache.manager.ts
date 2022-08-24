/* eslint-disable @typescript-eslint/no-explicit-any */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheManager {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async addToCache(key: string, item: any): Promise<void> {
    await this.cacheManager.set(key, item);
  }

  public async getFromCache(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }
}
