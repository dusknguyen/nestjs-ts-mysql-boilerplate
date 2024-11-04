import { Module } from '@nestjs/common';
import { ArticleResolver } from './resolvers/simple.resolver';
import { ArticleService } from './services/article.service';
import * as entities from 'entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'core';
/**
 * https://docs.nestjs.com/graphql/quick-start
 */
@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities)), CommonModule],
  providers: [ArticleResolver, ArticleService],
})
export class GqlModule {}
