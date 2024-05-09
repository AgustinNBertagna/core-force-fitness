import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from '../../entities/membership.entity';
import { Repository } from 'typeorm';
import * as data from '../../helpers/memberships.json';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
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
}
