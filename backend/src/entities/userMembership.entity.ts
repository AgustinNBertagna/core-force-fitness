import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Membership } from './membership.entity';
import { User } from './user.entity';

@Entity({
  name: 'users_memberships',
})
export class UserMemberships {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Membership, (membership) => membership.user_membership)
  membership: Membership;

  @ManyToOne(() => User, (user) => user.user_membership)
  user: User;

  @Column({ type: 'timestamp', nullable: false })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_date: Date;
}
