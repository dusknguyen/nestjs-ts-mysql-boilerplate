import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'entities/article/article.entity';
import { ArticleInput } from '../dto/article.input';
import { Repository } from 'typeorm';
import { ArticleArgs } from '../dto/article.args';

/**
 *
 */
@Injectable()
export class ArticleService {
  /**
   *
   */
  constructor(@InjectRepository(Article) private sampletable: Repository<Article>) {}

  /**
   *
   */
  public async create(data: ArticleInput): Promise<Article> {
    return this.sampletable.save(data);
  }

  /**
   *
   */
  public async read(id: number): Promise<Article | null> {
    const row = await this.sampletable.findOneBy({ id });
    if (!row) {
      return null;
    }

    return Object.assign(new Article(), row, { createdAt: row.created_at });
  }

  /**
   *
   */
  public removeUndefined<T extends object>(argv: T): Record<string, unknown> {
    // https://stackoverflow.com/questions/25421233
    // JSON.parse(JSON.stringify(args));
    return Object.fromEntries(Object.entries(argv).filter(([, value]: [string, unknown]) => value !== undefined));
  }

  /**
   *
   */
  public async find(args: ArticleArgs): Promise<Article[]> {
    const result = await this.sampletable.find(
      this.removeUndefined({
        title: args.title,
        content: args.content,
      }),
    );

    return result.map((row: Article) => Object.assign(new Article(), row, { createdAt: row.created_at }));
  }

  /**
   *
   */
  public async remove(id: number): Promise<boolean> {
    const result = await this.sampletable.delete(id);

    return !!result.affected;
  }
}
