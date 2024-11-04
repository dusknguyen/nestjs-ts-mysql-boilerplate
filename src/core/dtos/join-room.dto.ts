import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 *
 */
export class JoinRoomDto {
  @ApiPropertyOptional()
  @IsOptional()
  token!: string;

  @ApiProperty()
  @IsNotEmpty()
  room!: string;
}
