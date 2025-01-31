import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfig, Path, PathValue } from '@nestjs/config';
import type { Config } from '../../config';

/**
 * Custom ConfigService extends the NestJS ConfigService.
 * Provides type-safe configuration access with error handling for missing values.
 */
@Injectable()
export class ConfigService<K = Config> extends NestConfig<K> {
  /**
   * Retrieves the configuration value for the specified path.
   * Throws an error if the value is undefined or not found.
   *
   * @param path - The path to the configuration key.
   * @returns The configuration value.
   * @throws {Error} If the configuration value is undefined.
   */
  public override get<P extends Path<K>>(path: P): PathValue<K, P> {
    // Attempt to fetch the configuration value
    const value = super.get(path, { infer: true });

    // If value is not found, throw an error with the path as context
    if (value === undefined) {
      throw new Error(`NotFoundConfig: ${path.toString()}`);
    }

    // Return the configuration value if found
    return value;
  }
}
