import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CountryModel {
  @Field(() => ID)
  public id!: number;

  @Field()
  public countryName!: string;
}
