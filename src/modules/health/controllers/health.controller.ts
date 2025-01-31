import { Controller, Get } from '@nestjs/common'; // Controller decorator for handling HTTP requests
import { ApiTags } from '@nestjs/swagger'; // Swagger decorator to group the health endpoints in the API documentation
import { HealthCheck, HealthCheckResult, HealthCheckService, HealthIndicatorResult, HttpHealthIndicator } from '@nestjs/terminus';
/**
 * HealthController handles the health check endpoint to monitor the application’s health status.
 *
 * Documentation: https://docs.nestjs.com/recipes/terminus
 */
@ApiTags('health') // Tagging the controller with 'health' for Swagger UI categorization
@Controller('health') // Defines the 'health' route prefix for the controller
export class HealthController {
  /**
   * Constructor initializes the HealthCheckService and HttpHealthIndicator
   * to perform health checks.
   */
  constructor(
    private health: HealthCheckService, // Service to manage health checks
    private http: HttpHealthIndicator, // Indicator for HTTP-based health checks (e.g., DNS ping)
  ) {}

  /**
   * Endpoint to perform a health check on the application.
   * This checks the DNS resolution by pinging the given external URL.
   * @returns HealthCheckResult The result of the health check.
   */
  @Get('health') // HTTP GET request to '/health/health'
  @HealthCheck() // Terminus decorator to automatically check health indicators
  public async check(): Promise<HealthCheckResult> {
    // Runs a health check by pinging a DNS server (1.1.1.1)
    return this.health.check([async (): Promise<HealthIndicatorResult> => this.http.pingCheck('dns', 'https://1.1.1.1')]);
  }
}
