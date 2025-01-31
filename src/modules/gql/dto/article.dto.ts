import { Field, Int, ObjectType, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';

/**
 * Data Transfer Object (DTO) for Article.
 * Used to represent an article in the GraphQL response.
 */
@ObjectType()
export class ArticleDTO {
  /**
   * Unique identifier of the article.
   */
  @Field(() => Int)
  id!: number;

  /**
   * Title of the article.
   */
  @Field()
  title!: string;

  /**
   * Content of the article.
   * Nullable in case there's no content provided.
   */
  @Field({ nullable: true })
  content?: string;

  /**
   * Timestamp of when the article was created.
   * Transforms the value to a Date object.
   */
  @Field()
  @Transform(({ value }) => new Date(value)) // Transform to Date object
  createdAt!: Date;

  /**
   * Timestamp of when the article was last updated.
   * Transforms the value to a Date object.
   */
  @Field()
  @Transform(({ value }) => new Date(value)) // Transform to Date object
  updated_at!: Date;
}

/**
 * Input type for creating a new article.
 * Used for the mutation when creating a new article.
 */
@InputType()
export class CreateArticleInput {
  /**
   * Title of the article.
   */
  @Field()
  title!: string;

  /**
   * Content of the article.
   * Optional field when creating an article.
   */
  @Field({ nullable: true })
  content?: string;
}

/**
 * Input type for updating an existing article.
 * Used for the mutation when updating an article.
 */
@InputType()
export class UpdateArticleInput {
  /**
   * Title of the article to update.
   */
  @Field()
  title!: string;

  /**
   * Updated content of the article.
   * Optional field when updating an article.
   */
  @Field({ nullable: true })
  content?: string;
}
