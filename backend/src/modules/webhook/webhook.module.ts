import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { MembershipsModule } from '../memberships/memberships.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MembershipsModule, UsersModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
