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

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    private readonly usersRepository: UserRepository,
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

    const userMembership: Membership | undefined = memberships.find(
      (membership) => membershipName === membership.name,
    );

    if (!userMembership) throw new NotFoundException('Membership not found');

    const user: User | null = await this.usersRepository.getUserById(userId);

    await this.userMembershipRepository.update(
      { user: { id: userId }, is_active: true },
      { is_active: false },
    );

    if (!user) throw new NotFoundException('User not found');

    const durationNumber = Number(userMembership.duration.split(' ')[0]);

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + durationNumber);

    const newUserMembership = new UserMemberships();
    newUserMembership.membership = userMembership;
    newUserMembership.user = user;
    if (preapprovalId) newUserMembership.preapproval_id = preapprovalId;
    newUserMembership.start_date = startDate;
    newUserMembership.end_date = endDate;

    await this.userMembershipRepository.save(newUserMembership);

    return { startDate, endDate };
  }
}
