import { NotFoundException } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Article } from '../models/article.model';
import { ArticleService } from '../services/article.service';
import { ArticleInput } from '../dto/article.input';
import { ArticleArgs } from '../dto/article.args';

/**
 *
 */
@Resolver(() => Article)
export class ArticleResolver {
  /**
   *
   */
  constructor(private articleService: ArticleService) {}

  /**
   *
   */
  @Mutation(() => Article)
  public async create(@Args('simpleData') simpleData: ArticleInput): Promise<Article> {
    return this.articleService.create(simpleData);
  }

  /**
   *
   */
  @Query(() => Article)
  public async read(@Args('id', { type: () => ID }) id: number): Promise<Article> {
    const simple = await this.articleService.read(id);
    if (!simple) {
      throw new NotFoundException('NotFoundData');
    }

    return simple;
  }

  /**
   *
   */
  @Query(() => [Article])
  public async find(@Args() simpleArgs: ArticleArgs): Promise<Article[]> {
    return this.articleService.find(simpleArgs);
  }

  /**
   *
   */
  @Mutation(() => Boolean)
  public async remove(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    return this.articleService.remove(id);
  }
}
