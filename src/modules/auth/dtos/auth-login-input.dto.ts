import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the input data for logging in, containing the user's credentials.
 * This data is validated and used for authentication requests.
 */
export class LoginInput {
  /**
   * The username associated with the account.
   * It must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Account Username',
    example: 'johndoe',
  })
  username!: string;

  /**
   * The password associated with the account.
   * It must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Account password',
    example: 'password123',
  })
  password!: string;
}
