import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':membershipId')
  async getSubscriptionUrl(@Param('membershipId') membershipId: string) {
    return await this.paymentsService.getSubscriptionUrl(membershipId);
  }
}
