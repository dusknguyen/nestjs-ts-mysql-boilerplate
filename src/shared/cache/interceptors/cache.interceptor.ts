import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor, Optional, StreamableFile } from '@nestjs/common';
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils'; // Helper functions to check function types and nullish values
import { HttpAdapterHost, Reflector } from '@nestjs/core'; // Core utilities for adapter and reflection
import { Observable, of } from 'rxjs'; // RxJS observables for stream handling
import { tap } from 'rxjs/operators'; // RxJS operator to handle side-effects
import { CACHE_KEY_METADATA, CACHE_MANAGER, CACHE_TTL_METADATA } from '../cache.constants'; // Constants for cache keys and TTL

/**
 * CacheInterceptor for caching HTTP responses in NestJS.
 * Intercepts HTTP requests and responses to manage caching behavior.
 * Caches results for specified methods (e.g., GET) and uses cache manager to retrieve/store cached responses.
 *
 * @see [Caching](https://docs.nestjs.com/techniques/caching) - Official NestJS caching documentation
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  @Optional()
  @Inject()
  protected readonly httpAdapterHost: HttpAdapterHost | undefined; // Optional injection of HttpAdapterHost for HTTP-based apps

  protected allowedMethods = ['GET']; // Only allows GET requests to be cached

  /**
   * Constructor to inject dependencies.
   * @param cacheManager Cache manager instance for storing/retrieving cached data.
   * @param reflector Reflector instance to read metadata for cache keys and TTL.
   */
  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: any,
    protected readonly reflector: Reflector,
  ) {}

  /**
   * Intercepts the request and handles caching.
   * - Checks cache for existing response.
   * - If cache miss, processes the request and stores the response in cache.
   * @param context ExecutionContext for the current request/response cycle.
   * @param next CallHandler to pass control to the next interceptor or handler.
   * @returns An observable of the cached or new response.
   */
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const key = this.trackBy(context); // Retrieves the cache key
    const ttlValueOrFactory =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? this.reflector.get(CACHE_TTL_METADATA, context.getClass()) ?? null;
    if (!key) {
      return next.handle(); // If no cache key, pass request to next handler
    }

    try {
      const value = await this.cacheManager.get(key); // Check if data is already cached
      this.setHeadersWhenHttp(context, value); // Set appropriate cache hit/miss header for HTTP responses
      if (!isNil(value)) {
        return of(value); // Return cached value if found
      }

      const ttl = isFunction(ttlValueOrFactory) ? await ttlValueOrFactory(context) : ttlValueOrFactory;
      return next.handle().pipe(
        tap(async (response) => {
          if (response instanceof StreamableFile) {
            return; // Skip caching for streamable files (e.g., file downloads)
          }

          // Cache the response if it's not a streamable file
          const args = [key, response];
          if (!isNil(ttl)) {
            args.push(ttl); // Include TTL if provided
          }
          try {
            await this.cacheManager.set(...args); // Store the response in cache
          } catch (err) {
            // Log errors during cache insertion
            if (err instanceof Error) {
              Logger.error(`Error caching "key: ${key}", "value: ${response}"`, err.stack, 'CacheInterceptor');
            } else {
              Logger.error(`Unknown error caching "key: ${key}", "value: ${response}"`, undefined, 'CacheInterceptor');
            }
          }
        }),
      );
    } catch {
      return next.handle(); // In case of error, continue processing the request without cache
    }
  }

  /**
   * Determines the cache key for the request.
   * @param context ExecutionContext for the current request.
   * @returns The cache key if available, undefined otherwise.
   */
  protected trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost?.httpAdapter; // Check if using HTTP adapter
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
    const cacheMetadata = this.reflector.get(CACHE_KEY_METADATA, context.getHandler()); // Get cache key from metadata
    if (!isHttpApp || cacheMetadata) {
      return cacheMetadata; // Return cache key from metadata if available
    }

    const request = context.getArgByIndex(0); // Get the request object
    if (!this.isRequestCacheable(context)) {
      return undefined; // Skip caching for non-cacheable requests
    }
    return httpAdapter.getRequestUrl(request); // Use request URL as cache key for HTTP requests
  }

  /**
   * Determines if the request method is allowed to be cached.
   * @param context ExecutionContext for the current request.
   * @returns true if the request method is cacheable (e.g., GET), false otherwise.
   */
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest(); // Get the request object
    return this.allowedMethods.includes(req.method); // Only allow GET requests to be cached
  }

  /**
   * Sets the appropriate headers for HTTP responses to indicate cache hit/miss.
   * @param context ExecutionContext for the current request.
   * @param value Cached response value.
   */
  protected setHeadersWhenHttp(context: ExecutionContext, value: any): void {
    if (!this.httpAdapterHost) {
      return;
    }
    const { httpAdapter } = this.httpAdapterHost;
    if (!httpAdapter) {
      return;
    }
    const response = context.switchToHttp().getResponse(); // Get the response object
    httpAdapter.setHeader(response, 'X-Cache', isNil(value) ? 'MISS' : 'HIT'); // Set X-Cache header to indicate cache status
  }
}
