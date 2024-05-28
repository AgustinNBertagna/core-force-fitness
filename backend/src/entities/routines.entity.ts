import { TypeRoutine } from 'src/helpers/routines.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsersRoutines } from './userRoutine.entity';

@Entity({
  name: 'routines',
})
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'enum', enum: TypeRoutine, nullable: false })
  type: TypeRoutine;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  pdf_url: string;

  @OneToMany(() => UsersRoutines, (usersRoutines) => usersRoutines.routine)
  users_routines: UsersRoutines[];
}
