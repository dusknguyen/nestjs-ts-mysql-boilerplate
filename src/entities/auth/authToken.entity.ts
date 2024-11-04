import { hash256 } from 'shared/crypto/hash';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
/**
 *
 */
@Entity('user_token')
export class AuthToken {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id!: number;

  @Column({
    name: 'refresh_token',
    type: 'longtext',
  })
  refreshToken!: string;

  @Column({
    name: 'access_token',
    type: 'longtext',
  })
  accessToken!: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;

  /**
   *
   */
  @BeforeInsert()
  async beforeInsert(): Promise<void> {
    this.accessToken = hash256(this.accessToken);
    this.refreshToken = hash256(this.refreshToken);
  }

  /**
   *
   */
  @BeforeUpdate()
  async beforeUpdate(): Promise<void> {
    this.accessToken = hash256(this.accessToken);
    this.refreshToken = hash256(this.refreshToken);
  }
}
