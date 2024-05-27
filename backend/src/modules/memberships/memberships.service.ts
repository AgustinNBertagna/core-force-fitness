import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from '../../entities/membership.entity';
import { Repository } from 'typeorm';
import * as data from '../../helpers/memberships.json';
import { UserRepository } from '../users/users.repository';
import { User } from 'src/entities/user.entity';
import { UserMemberships } from 'src/entities/userMembership.entity';
import { PaymentsRepository } from '../payments/payments.repository';

@Injectable()
export class MembershipsService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly paymentsRepository: PaymentsRepository,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(UserMemberships)
    private userMembershipRepository: Repository<UserMemberships>,
  ) {}

  async getMemberships() {
    try {
      const memberships = await this.membershipRepository.find();
      return memberships;
    } catch (err) {
      throw new NotFoundException('Memberships not found');
    }
  }

  async addMemberships() {
    const memberships = data.map((membershipData) => {
      const membership = this.membershipRepository.create(membershipData);
      return membership;
    });
    try {
      await this.membershipRepository.save(memberships);
      return 'Memberships preloaded';
    } catch (err) {
      throw new BadRequestException('Failed to seed memberships');
    }
  }

  async getMembershipById(id: string): Promise<Membership> {
    const membership = await this.membershipRepository.findOneBy({ id });

    if (!membership) throw new NotFoundException('Membership not found');

    return membership;
  }

  async assignMembership(
    userId: string,
    membershipName: string,
    preapprovalId?: string,
  ) {
    const memberships: Membership[] = await this.getMemberships();

    const membership: Membership | undefined = memberships.find(
      (membership) => membershipName === membership.name,
    );

    if (!membership) throw new NotFoundException('Membership not found');

    const user: User | null = await this.usersRepository.getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    const activeUserMembership: UserMemberships | null =
      await this.userMembershipRepository.findOne({
        where: { user: { id: user.id }, is_active: true },
      });

    if (!activeUserMembership && membership.name !== 'Free')
      throw new NotFoundException('User membership not found');

    console.log(activeUserMembership);

    console.log(
      'Preapproval Id to be cancelled',
      activeUserMembership?.preapproval_id,
    );

    // Puede que acá haya un error cuando se trate de cancelar membresía Free

    if (activeUserMembership && activeUserMembership.preapproval_id !== null) {
      await this.paymentsRepository.cancelSubscription(
        activeUserMembership?.preapproval_id,
      );
    }

    if (activeUserMembership) {
      await this.userMembershipRepository.update(
        { id: activeUserMembership.id },
        { is_active: false },
      );
    }

    const durationNumber = Number(membership.duration.split(' ')[0]);

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + durationNumber);

    const newUserMembership = new UserMemberships();
    newUserMembership.membership = membership;
    newUserMembership.user = user;
    if (preapprovalId) newUserMembership.preapproval_id = preapprovalId;
    newUserMembership.start_date = startDate;
    newUserMembership.end_date = endDate;

    await this.userMembershipRepository.save(newUserMembership);

    return { startDate, endDate };
  }
}
