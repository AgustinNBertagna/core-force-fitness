import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, EmailsModule],
})
export class AuthModule {}
