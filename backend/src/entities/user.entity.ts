import { Trainer } from 'src/entities/trainer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserMemberships } from './userMembership.entity';

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
  phone: number;

  @Column({ nullable: false })
  birthday: string;

  @Column({ type: 'date', nullable: false })
  signup_date: Date;

  @Column({ type: 'varchar', nullable: false })
  gender: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @ManyToOne(() => Trainer, (trainer) => trainer.users)
  @JoinColumn({ name: 'trainer_id' })
  trainer: Trainer;

  @OneToMany(() => UserMemberships, (userMembership) => userMembership.user)
  user_membership: UserMemberships;
}
