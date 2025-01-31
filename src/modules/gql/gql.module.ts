import { Module } from '@nestjs/common';
import { ArticleResolver } from './resolvers/article.resolver'; // Resolver for handling article-related GraphQL queries and mutations
import { CommonModule } from 'core'; // Common module that includes shared functionality (e.g., services, utilities)
import { ArticleService } from './services/article.service'; // Service for handling business logic related to articles

/**
 * GqlModule is responsible for setting up GraphQL-related functionality.
 * It integrates the article-related resolver and service with the application.
 *
 * - ArticleResolver: Handles GraphQL queries and mutations related to articles.
 * - ArticleService: Contains the business logic to fetch, create, update, and delete articles.
 *
 * Documentation: https://docs.nestjs.com/graphql/quick-start
 */
@Module({
  imports: [CommonModule], // Imports the common module for shared resources
  providers: [ArticleResolver, ArticleService], // Registers the resolver and service as providers
})
export class GqlModule {} // Defines the GraphQL module in the NestJS application
