// Nuevo archivo: role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../helpers/roles.enum';

@Entity({
  name: 'users_roles',
})
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  name: Role;
}
