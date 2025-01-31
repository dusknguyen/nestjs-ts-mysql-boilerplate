import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArticleDTO, CreateArticleInput, UpdateArticleInput } from '../dto/article.dto';
import { ArticleService } from '../services/article.service';
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'modules/auth/guards/api-key.guard';
import { RequestContext } from 'core/request-context/request-context.dto';
import { ReqContext } from 'core/request-context/req-context.decorator';
import { AppLogger } from 'core/services/logger.service';

/**
 * GraphQL resolver for managing articles.
 * Handles queries and mutations related to articles, such as retrieving, creating, updating, and deleting articles.
 */
@UseGuards(ApiKeyGuard) // Protects the resolver with the ApiKeyGuard
@Resolver(() => ArticleDTO) // Resolves queries for ArticleDTO type
export class ArticleResolver {
  /**
   * Constructor to inject the ArticleService dependency.
   * @param articleService The service responsible for handling article operations.
   */
  constructor(
    private readonly articleService: ArticleService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ArticleResolver.name);
  }

  /**
   * Retrieves a list of all articles.
   * @returns A list of articles in ArticleDTO format.
   */
  @Query(() => [ArticleDTO])
  async getArticles(@ReqContext() ctx: RequestContext): Promise<ArticleDTO[]> {
    // Log RequestContext or use it for custom logic
    this.logger.log(ctx, `${this.getArticles.name} was called`);
    return this.articleService.getArticles();
  }

  /**
   * Retrieves a specific article by its ID.
   * @param id The ID of the article to fetch.
   * @returns The article in ArticleDTO format, or null if not found.
   */
  @Query(() => ArticleDTO, { nullable: true })
  async getArticle(
    @Args('id', { type: () => Int }) id: number,
    @ReqContext() ctx: RequestContext, // Inject RequestContext vào method
  ): Promise<ArticleDTO | null> {
    this.logger.log(ctx, `${this.getArticle.name} was called`);
    return this.articleService.getArticle(id);
  }

  /**
   * Creates a new article with the provided data.
   * @param data The data required to create the article, provided as CreateArticleInput.
   * @returns The created article in ArticleDTO format.
   */
  @Mutation(() => ArticleDTO)
  async createArticle(
    @Args('data') data: CreateArticleInput,
    @ReqContext() ctx: RequestContext, // Inject RequestContext vào method
  ): Promise<ArticleDTO> {
    this.logger.log(ctx, `${this.createArticle.name} was called`);
    return this.articleService.createArticle(data);
  }

  /**
   * Updates an existing article with the provided ID and data.
   * @param id The ID of the article to update.
   * @param data The updated article data, provided as UpdateArticleInput.
   * @returns The updated article in ArticleDTO format.
   */
  @Mutation(() => ArticleDTO)
  async updateArticle(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateArticleInput,
    @ReqContext() ctx: RequestContext, // Inject RequestContext vào method
  ): Promise<ArticleDTO> {
    this.logger.log(ctx, `${this.updateArticle.name} was called`);
    return this.articleService.updateArticle(id, data);
  }

  /**
   * Removes an article by its ID.
   * @param id The ID of the article to delete.
   * @returns A boolean indicating whether the removal was successful.
   */
  @Mutation(() => Boolean)
  async removeArticle(
    @Args('id', { type: () => Int }) id: number,
    @ReqContext() ctx: RequestContext, // Inject RequestContext vào method
  ): Promise<boolean> {
    this.logger.log(ctx, `${this.removeArticle.name} was called`);
    return this.articleService.removeArticle(id);
  }
}
