import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMemberships } from 'src/entities/userMembership.entity';
import { PaymentsRepository } from './payments.repository';
import { Membership } from 'src/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserMemberships, Membership])],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
