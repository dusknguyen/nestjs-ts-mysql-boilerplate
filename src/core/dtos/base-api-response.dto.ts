import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

/**
 * Generic base class for API responses.
 *
 * @template T - The type of the response data.
 */
export class BaseApiResponse<T> {
  /** The main response data */
  public data!: T;

  /** Metadata, such as pagination info */
  @ApiProperty({ type: Object })
  public meta: any;
}

/**
 * Generates a Swagger API response class with the specified data type.
 *
 * @template T - The type of the response data.
 * @param dataType - The class representing the response data type.
 * @returns A dynamically generated API response class.
 */
export function createSwaggerApiResponse<T>(dataType: new () => T): any {
  /**
   * API response class extending BaseApiResponse with Swagger metadata.
   */
  @ApiExtraModels(dataType) // Registers the data type model in Swagger
  class ApiResponse extends BaseApiResponse<T> {
    @ApiProperty({
      allOf: [{ $ref: getSchemaPath(dataType) }], // Generates the correct schema reference in Swagger
    })
    declare data: T;
  }

  return ApiResponse;
}
