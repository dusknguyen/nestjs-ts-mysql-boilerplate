import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Represents the authentication token response.
 * Contains the access token required for authenticated API requests.
 */
export class AuthTokenOutput {
  /**
   * The access token issued to the user.
   * Required for making authenticated API requests.
   */
  @Expose()
  @ApiProperty({ description: 'JWT access token for authentication' })
  accessToken!: string;
}

/**
 * Represents the claims included in the access token.
 * These claims contain user-related details used for authorization.
 */
export class UserAccessTokenClaims {
  /**
   * Issuer of the token, typically the authentication server.
   */
  @Expose()
  @ApiProperty({ description: 'Token issuer' })
  iss!: string;

  /**
   * The user ID linked to the refresh token.
   */
  @Expose()
  @ApiProperty({ description: 'User ID associated with the token' })
  sub!: string;

  /**
   * The unique identifier of the refresh token (UUID), used for tracking.
   */
  @Expose()
  @ApiProperty({ description: 'Unique JWT identifier (UUID)' })
  jti!: string;
}

/**
 * Represents the claims included in the refresh token.
 * Used for refreshing expired access tokens.
 */
export class UserRefreshTokenClaims {
  /**
   * Issuer of the token, typically the authentication server.
   */
  @Expose()
  @ApiProperty({ description: 'Token issuer' })
  iss!: string;

  /**
   * The user ID linked to the refresh token.
   */
  @Expose()
  @ApiProperty({ description: 'User ID associated with the token' })
  sub!: string;

  /**
   * The unique identifier of the refresh token (UUID), used for tracking.
   */
  @Expose()
  @ApiProperty({ description: 'Unique JWT identifier (UUID)' })
  jti!: string;
}
