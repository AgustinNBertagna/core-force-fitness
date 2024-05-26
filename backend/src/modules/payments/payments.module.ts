import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { UsersModule } from '../users/users.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMemberships } from 'src/entities/userMembership.entity';

@Module({
  imports: [
    UsersModule,
    MembershipsModule,
    TypeOrmModule.forFeature([UserMemberships]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
