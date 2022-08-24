import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('roles')
export class Roles extends BaseEntity {
  @PrimaryColumn({
    type: 'int',
    name: 'id',
  })
  id!: number;
}
