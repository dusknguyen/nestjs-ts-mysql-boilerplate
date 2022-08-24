/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/typedef */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class FromToDto {
  @ApiPropertyOptional({ example: new Date().getTime() - 30 * 24 * 60 * 60 * 1000 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  from?: number = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;

  @ApiPropertyOptional({ example: new Date().getTime() })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  to?: number = new Date().getTime();
}
