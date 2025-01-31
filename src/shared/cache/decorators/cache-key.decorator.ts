import { SetMetadata } from '@nestjs/common'; // Importing SetMetadata to create custom decorators
import { CACHE_KEY_METADATA } from '../cache.constants'; // Importing constant to define metadata key for cache

/**
 * CacheKey decorator is used to set a custom cache key for WebSocket or Microservice-based applications.
 * This cache key will be used for storing and retrieving cached items in the cache system.
 * The decorator is applied to methods or classes where caching is required.
 *
 * This sets 'events' as the cache key for the method or class it's applied to.
 *
 * @param key - A string that represents the name of the cache key.
 *
 * @see [Caching in NestJS](https://docs.nestjs.com/techniques/caching) - Official NestJS documentation on caching techniques.
 */
export const CacheKey = (key: string) => SetMetadata(CACHE_KEY_METADATA, key);
