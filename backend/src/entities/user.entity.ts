import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserMemberships } from './userMembership.entity';
import { Roles } from './role.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Index({ unique: true, where: `"isActive" = true` })
  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  emailAuth0: string;

  @Index({ nullFiltered: true, where: `"emailAuth0" IS NOT NULL` })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: 'https://cdn-icons-png.freepik.com/512/8742/8742495.png',
  })
  profile_image: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'timestamp', nullable: false })
  birthdate: string;

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

  // @Column({ type: 'enum', default: Role.USER, enum: Role })
  // role: Role;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Roles, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @ManyToOne(() => User, (user) => user.students)
  @JoinColumn({ name: 'trainer_id' })
  trainer: User;

  @OneToMany(() => User, (user) => user.trainer)
  students: User[];

  @OneToMany(() => UserMemberships, (userMembership) => userMembership.user, {
    nullable: true,
  })
  user_membership: UserMemberships;
}
