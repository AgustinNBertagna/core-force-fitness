import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Routine } from './routines.entity';
import { User } from './user.entity';

@Entity({
  name: 'users_memberships',
})
export class UsersRoutines {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Routine, (routine) => routine.users_routines)
  routine: Routine;

  @ManyToOne(() => User, (user) => user.user_routines)
  user: User;

  // @Column({ type: 'boolean', default: true })
  // is_active: boolean;
}
