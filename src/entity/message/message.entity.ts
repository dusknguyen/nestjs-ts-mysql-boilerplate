import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('message')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id!: number;
  @Column('varchar', {
    nullable: false,
    length: 255,
    name: 'content',
  })
  content!: string;
}
