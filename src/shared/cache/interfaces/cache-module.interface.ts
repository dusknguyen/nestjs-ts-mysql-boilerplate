import { ConfigurableModuleAsyncOptions, Provider, Type } from '@nestjs/common';
import { CacheManagerOptions } from './cache-manager.interface'; // Import CacheManagerOptions interface for configuration

/**
 * CacheOptions type combines CacheManagerOptions and specific store configuration.
 * Store configuration overrides the CacheManagerOptions due to how `createCacheManager` is implemented.
 */
export type CacheOptions<StoreConfig extends Record<any, any> = Record<string, any>> = CacheManagerOptions & StoreConfig;

/**
 * CacheModuleOptions type extends CacheOptions and allows additional module-level configuration.
 */
export type CacheModuleOptions<StoreConfig extends Record<any, any> = Record<string, any>> = CacheOptions<StoreConfig> & {
  /**
   * If `true`, registers `CacheModule` as a global module. This makes it available globally without explicit imports.
   */
  isGlobal?: boolean;
};

/**
 * Interface describing a `CacheOptionsFactory`.
 * Providers supplying configuration options for the Cache module must implement this interface.
 * This is used in async configuration scenarios.
 *
 * @see [Async configuration](https://docs.nestjs.com/techniques/caching#async-configuration)
 */
export interface CacheOptionsFactory<StoreConfig extends Record<any, any> = Record<string, any>> {
  /**
   * Method to create cache options, either synchronously or asynchronously.
   * Returns the configuration options for the Cache module.
   */
  createCacheOptions(): Promise<CacheOptions<StoreConfig>> | CacheOptions<StoreConfig>;
}

/**
 * Options for dynamically configuring the Cache module asynchronously.
 *
 * @see [Async configuration](https://docs.nestjs.com/techniques/caching#async-configuration)
 */
export interface CacheModuleAsyncOptions<StoreConfig extends Record<any, any> = Record<string, any>>
  extends ConfigurableModuleAsyncOptions<CacheOptions<StoreConfig>, keyof CacheOptionsFactory> {
  /**
   * Provider token resolving to an existing provider implementing the `CacheOptionsFactory` interface.
   */
  useExisting?: Type<CacheOptionsFactory<StoreConfig>>;

  /**
   * Class to be instantiated as a provider. The class must implement the `CacheOptionsFactory` interface.
   */
  useClass?: Type<CacheOptionsFactory<StoreConfig>>;

  /**
   * Factory function that returns options or a Promise resolving to options to configure the Cache module.
   */
  useFactory?: (...args: any[]) => Promise<CacheOptions<StoreConfig>> | CacheOptions<StoreConfig>;

  /**
   * Dependencies that a Factory may inject into its `useFactory` method.
   */
  inject?: any[];

  /**
   * Extra providers to register within the scope of this module. These can be used for custom configuration.
   */
  extraProviders?: Provider[];

  /**
   * If `true`, register `CacheModule` as a global module.
   * This makes the CacheModule available to all other modules without needing explicit imports.
   */
  isGlobal?: boolean;
}
