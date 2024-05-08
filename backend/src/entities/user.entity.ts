// import { Trainer } from 'src/entities/trainer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserMemberships } from './userMembership.entity';
import { Role } from 'src/helpers/roles.enum';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  profile_image: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'timestamp', nullable: false })
  birthdate: Date;

  @Column({ type: 'varchar', nullable: false })
  signup_date: string;

  @Column({ type: 'varchar', nullable: false })
  gender: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  height: string;

  @Column({ type: 'varchar', nullable: true })
  weight: string;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @ManyToOne(() => User, (user) => user.students)
  @JoinColumn({ name: 'trainer_id' })
  trainer: User;

  @OneToMany(() => User, (user) => user.trainer)
  students: User[];

  @OneToMany(() => UserMemberships, (userMembership) => userMembership.user)
  user_membership: UserMemberships;
}
