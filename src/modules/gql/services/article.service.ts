import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'core';
import { ArticleDTO, CreateArticleInput, UpdateArticleInput } from '../dto/article.dto';

/**
 * Service for handling article-related operations such as retrieving, creating, updating, and deleting articles.
 */
@Injectable()
export class ArticleService {
  /**
   * Constructor to inject the PrismaService for interacting with the database.
   * @param prisma The Prisma service to handle database operations.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all articles from the database.
   * @returns A list of articles in ArticleDTO format.
   */
  async getArticles(): Promise<ArticleDTO[]> {
    const articles = await this.prisma.article.findMany();
    return plainToInstance(ArticleDTO, articles);
  }

  /**
   * Retrieves a specific article by its ID from the database.
   * @param id The ID of the article to retrieve.
   * @returns The article in ArticleDTO format, or null if not found.
   */
  async getArticle(id: number): Promise<ArticleDTO | null> {
    const article = await this.prisma.article.findUnique({ where: { id } });
    return article ? plainToInstance(ArticleDTO, article) : null;
  }

  /**
   * Creates a new article in the database.
   * @param data The data required to create the article, provided as CreateArticleInput.
   * @returns The created article in ArticleDTO format.
   */
  async createArticle(data: CreateArticleInput): Promise<ArticleDTO> {
    const article = await this.prisma.article.create({ data });
    return plainToInstance(ArticleDTO, article);
  }

  /**
   * Updates an existing article in the database.
   * @param id The ID of the article to update.
   * @param data The updated article data, provided as UpdateArticleInput.
   * @returns The updated article in ArticleDTO format.
   */
  async updateArticle(id: number, data: UpdateArticleInput): Promise<ArticleDTO> {
    const article = await this.prisma.article.update({ where: { id }, data });
    return plainToInstance(ArticleDTO, article);
  }

  /**
   * Removes an article from the database by its ID.
   * @param id The ID of the article to delete.
   * @returns A boolean indicating whether the removal was successful.
   */
  async removeArticle(id: number): Promise<boolean> {
    await this.prisma.article.delete({ where: { id } });
    return true;
  }
}
