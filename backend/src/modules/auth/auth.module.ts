import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EmailsModule } from '../emails/emails.module';
import { MembershipsModule } from '../memberships/memberships.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, EmailsModule, MembershipsModule],
})
export class AuthModule {}
