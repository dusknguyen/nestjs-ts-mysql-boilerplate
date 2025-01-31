import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the input data for user registration.
 * Contains the necessary fields for creating a new account.
 */
export class RegisterInput {
  /**
   * The username chosen by the user for their account.
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
   * The password chosen by the user for their account.
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
