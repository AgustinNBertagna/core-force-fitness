import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from 'src/entities/membership.entity';
import { UsersModule } from '../users/users.module';
import { UserMemberships } from 'src/entities/userMembership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership, UserMemberships]),
    UsersModule,
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
