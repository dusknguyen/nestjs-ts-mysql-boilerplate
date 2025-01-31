import { CreateCacheOptions } from 'cache-manager'; // Import CacheManager's CreateCacheOptions for caching configuration
import { Keyv, KeyvStoreAdapter } from 'keyv'; // Import Keyv and KeyvStoreAdapter for cache stores

/**
 * Interface defining Cache Manager configuration options.
 * Extends `CreateCacheOptions` to customize cache behavior.
 */
export interface CacheManagerOptions extends Omit<CreateCacheOptions, 'stores'> {
  /**
   * Cache storage manager. Default is `'memory'` (in-memory store).
   * You can provide different stores such as `Keyv` or `KeyvStoreAdapter` or an array of multiple stores.
   * See [Different stores](https://docs.nestjs.com/techniques/caching#different-stores) for more information.
   */
  stores?: Keyv | KeyvStoreAdapter | (Keyv | KeyvStoreAdapter)[];

  /**
   * Cache storage namespace, default is `keyv`.
   * This is a global configuration that applies to all `KeyvStoreAdapter` instances.
   * You can change the namespace to organize cached items.
   */
  namespace?: string;

  /**
   * Default time to live (TTL) in milliseconds.
   * This defines the maximum duration an item can remain in the cache before it is removed.
   * It is a global setting, but can be overridden per item.
   */
  ttl?: number;

  /**
   * Optional. If `refreshThreshold` is set, the TTL will be checked after retrieving a value from the cache.
   * If the remaining TTL is less than the `refreshThreshold`, the system will update the value asynchronously.
   * This helps keep frequently accessed cache items up-to-date.
   */
  refreshThreshold?: number;

  /**
   * Default is false.
   * If set to true, the system will not block when using multiple stores.
   * For more information on how this affects function types, visit [documentation](https://www.npmjs.com/package/cache-manager#options).
   */
  nonBlocking?: boolean;
}
