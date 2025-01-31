import { HttpModule } from '@nestjs/axios'; // Module to handle HTTP requests (used in health checks)
import { Module } from '@nestjs/common'; // Core module decorator from NestJS
import { TerminusModule } from '@nestjs/terminus'; // Module for health check functionality
import { HealthController } from './controllers'; // Importing the HealthController which contains health check routes

/**
 * HealthModule is responsible for setting up the health check functionality.
 * It integrates Terminus and HTTP capabilities to ensure the service's health status can be monitored.
 */
@Module({
  imports: [TerminusModule, HttpModule], // Import TerminusModule for health checks and HttpModule for HTTP health checks
  controllers: [HealthController], // Registering the HealthController which exposes the health check routes
})
export class HealthModule {}
