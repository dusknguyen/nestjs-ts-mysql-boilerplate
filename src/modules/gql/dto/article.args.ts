import { ArgsType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

/**
 *
 */
@ArgsType()
export class ArticleArgs {
  @IsString()
  public title!: string;

  @IsOptional()
  @IsString()
  public content?: string;
}
