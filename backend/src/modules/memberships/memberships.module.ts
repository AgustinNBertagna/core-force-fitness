import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from 'src/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  controllers: [MembershipsController],
  providers: [MembershipsService],
})
export class MembershipsModule {}
