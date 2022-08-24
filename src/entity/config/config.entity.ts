import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('config')
export class ConfigEntity extends BaseEntity {
  @PrimaryColumn({
    type: 'int',
    name: 'id',
  })
  id!: number;
  @Column('timestamp', {
    nullable: true,
    default: null,
    name: 'minting_phrase',
  })
  mintingPhrase!: Date;
  @Column('timestamp', {
    nullable: true,
    default: null,
    name: 'reveal_phrase',
  })
  revealPhrase!: Date;
}
