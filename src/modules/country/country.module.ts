import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entity';

import { CountryService } from './providers';
import { CountryResolver } from './resolver';

/**
 * https://docs.nestjs.com/graphql/quick-start
 */
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: async (config: ConfigService) => ({
        ...(await config.get('graphql')),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Country]),
  ],
  providers: [CountryResolver, CountryService],
})
export class CountryModule {}
