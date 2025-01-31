import { ExecutionContext, SetMetadata } from '@nestjs/common'; // Importing required decorators and types
import { CACHE_TTL_METADATA } from '../cache.constants'; // Importing constant that defines the metadata key for cache TTL

/**
 * CacheTTL decorator sets the time-to-live (TTL) for cache expiration.
 * This determines how long the cached data should remain in the cache before it expires.
 * The TTL can be either a fixed number (e.g., 5 seconds) or a function that resolves the TTL dynamically based on the request context.
 *
 * @param ttl - The TTL value, either as a number (in seconds) or a function returning a number.
 *               - If a number is provided, it directly sets the TTL.
 *               - If a function is provided, it dynamically calculates the TTL based on the request context.
 *
 * @see [Caching in NestJS](https://docs.nestjs.com/techniques/caching) - Official NestJS documentation on caching techniques.
 */
type CacheTTLFactory = (ctx: ExecutionContext) => Promise<number> | number;

export const CacheTTL = (ttl: number | CacheTTLFactory) => SetMetadata(CACHE_TTL_METADATA, ttl);
