import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Represents the output of an authentication token response.
 * Contains the access token required for authenticated API requests.
 */
export class AuthTokenOutput {
  /**
   * The access token for the user, used for authenticating requests.
   */
  @Expose()
  @ApiProperty()
  accessToken!: string;
}

/**
 * Represents the claims for a user associated with an access token.
 * This contains the user's essential information encoded in the token.
 */
export class UserAccessTokenClaims {
  /**
   * The username of the user encoded in the access token.
   */
  @Expose()
  username!: string;

  /**
   * The unique identifier (UUID) of the user encoded in the access token.
   */
  @Expose()
  uuid!: string;
}

/**
 * Represents the claims for a user associated with a refresh token.
 * This contains the user's essential information encoded in the token for token refresh operations.
 */
export class UserRefreshTokenClaims {
  /**
   * The username of the user encoded in the refresh token.
   */
  @Expose()
  username!: string;

  /**
   * The unique identifier (UUID) of the user encoded in the refresh token.
   */
  @Expose()
  uuid!: string;
}
