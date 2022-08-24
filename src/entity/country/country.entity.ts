import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('country')
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id!: number;
  @Column('varchar', {
    nullable: false,
    name: 'country_name',
  })
  countryName!: string;
}
