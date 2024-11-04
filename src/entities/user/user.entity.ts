import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './role.entity';
/**
 *
 */
@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    nullable: false,
    length: 256,
    name: 'name',
  })
  name!: string;

  @Column('varchar', {
    nullable: false,
    length: 256,
    name: 'password',
  })
  password!: string;

  @Column('varchar', {
    nullable: true,
    length: 256,
    name: 'email',
  })
  email!: string;

  @ManyToMany(() => Roles, (roles) => roles.id)
  roles!: Roles[];
}
