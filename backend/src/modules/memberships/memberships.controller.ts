import { Controller, Get, Param } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { Membership } from 'src/entities/membership.entity';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  getMemberships(): Promise<Membership[]> {
    return this.membershipsService.getMemberships();
  }

  @Get('seeder')
  addMemberships(): Promise<string> {
    return this.membershipsService.addMemberships();
  }

  @Get(':id')
  getMembershipById(@Param('id') id: string) {
    return this.membershipsService.getMembershipById(id);
  }
}
