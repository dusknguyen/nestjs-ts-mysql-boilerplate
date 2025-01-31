import { Global, Module } from '@nestjs/common';
import * as providers from './services';

/**
 * CommonModule provides global services.
 * Services in this module are available globally across the application,
 * so other modules don't need to import CommonModule.
 */
@Global()
@Module({
  providers: Object.values(providers), // Registers all services in 'providers'
  exports: Object.values(providers), // Exports services for use in other modules
})
export class CommonModule {}
