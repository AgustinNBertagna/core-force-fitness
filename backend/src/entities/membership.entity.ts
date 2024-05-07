import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserMemberships } from './userMembership.entity';

@Entity({
  name: 'memberships',
})
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  duration: string;

  @OneToMany(
    () => UserMemberships,
    (userMembership) => userMembership.membership,
  )
  user_membership: UserMemberships;
}
