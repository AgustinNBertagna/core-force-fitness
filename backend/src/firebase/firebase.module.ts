import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from 'src/modules/emails/emails.service';
import { UserRepository } from 'src/modules/users/users.repository';
import { MembershipsModule } from 'src/modules/memberships/memberships.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MembershipsModule],
  controllers: [FirebaseController],
  providers: [FirebaseService, EmailsService, UserRepository],
})
export class FirebaseModule {}
