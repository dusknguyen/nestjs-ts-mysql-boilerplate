import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
/**
 *
 */
export class AuthTokenDto {
  @Expose()
  @ApiProperty()
  accessToken!: string;

  @Expose()
  @ApiProperty()
  refreshToken!: string;
}
