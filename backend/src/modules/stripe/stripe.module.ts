import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Membership } from 'src/entities/membership.entity';
import { UserMemberships } from 'src/entities/userMembership.entity';
import { MembershipsModule } from '../memberships/memberships.module';

@Module({
  imports: [
    MembershipsModule,
    TypeOrmModule.forFeature([User, Membership, UserMemberships]),
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
