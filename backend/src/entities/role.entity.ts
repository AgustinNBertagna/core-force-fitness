// Nuevo archivo: role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../helpers/roles.enum';
import { User } from './user.entity';

@Entity({
  name: 'users_roles',
})
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  name: Role;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
