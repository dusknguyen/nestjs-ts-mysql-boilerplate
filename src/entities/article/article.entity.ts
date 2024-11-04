import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 *
 */
@Entity('article')
export class Article {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'id' })
  id!: number;

  @Column('varchar', { nullable: false, length: 255, name: 'title' })
  title!: string;

  @Column('text', { nullable: true, name: 'content' })
  content?: string;

  @Column('simple-array')
  tags?: string[];

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at!: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at!: Date;
}
