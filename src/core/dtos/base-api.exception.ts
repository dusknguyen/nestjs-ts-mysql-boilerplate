import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Base exception class for API errors.
 */
export class BaseApiException extends HttpException {
  /** Additional error details */
  public details?: string | Record<string, any>;

  /**
   * Constructs a new BaseApiException.
   * @param message - Error message.
   * @param status - HTTP status code.
   * @param details - Additional error details (optional).
   */
  constructor(message: string, status: number, details?: string | Record<string, any>) {
    super(message, status);
    this.name = BaseApiException.name;
    this.details = details;
  }
}

/**
 * Standardized API error object.
 */
export class BaseApiErrorObject {
  @ApiProperty({ type: Number, description: 'HTTP status code of the error' })
  public statusCode!: number;

  @ApiProperty({ type: String, description: 'Error message' })
  public message!: string;

  @ApiProperty({ type: String, description: 'Error name or type' })
  public errorName!: string;

  @ApiProperty({ type: Object, description: 'Additional error details' })
  public details: unknown;

  @ApiProperty({ type: String, description: 'Request path where the error occurred' })
  public path!: string;

  @ApiProperty({ type: String, description: 'Unique request identifier' })
  public requestId!: string;

  @ApiProperty({ type: String, description: 'Timestamp of when the error occurred' })
  public timestamp!: string;
}

/**
 * Wrapper for API error responses.
 */
export class BaseApiErrorResponse {
  @ApiProperty({ type: BaseApiErrorObject, description: 'Error response details' })
  public error!: BaseApiErrorObject;
}
