import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from '../../entities/membership.entity';
import { Repository } from 'typeorm';
// import * as membershipsData from '../../helpers/memberships.json';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../../helpers/memberships.json');

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
      const membership = new Membership();
      membership.name = membershipData.name;
      membership.price = membershipData.price;
      membership.description = membershipData.description;
      membership.duration = membershipData.duration;
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
    const membership = await this.membershipRepository.findOne({
      where: { id },
    });
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    return membership;
  }
}
