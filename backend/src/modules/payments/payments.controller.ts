import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateSubscriptionDto } from 'src/dtos/create-subscription.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':membershipId')
  async getSubscriptionUrl(@Param('membershipId') membershipId: string) {
    return await this.paymentsService.getSubscriptionUrl(membershipId);
  }

  @Post('subscription')
  async createSubscription(@Body() data: CreateSubscriptionDto) {
    const { userId, membershipId, card_token_id } = data;

    console.log('Data:', data, 'Card:', card_token_id, 'user', userId);

    return await this.paymentsService.createSubscription(
      userId,
      membershipId,
      card_token_id,
    );
  }
}
