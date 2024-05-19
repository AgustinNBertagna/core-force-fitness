import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async subscribeToMembership(@Body() paymentData) {
    const { id, amount } = paymentData.stripe;
    const { userId, membershipName } = paymentData.userData;
    return await this.stripeService.subscribeToMembership(
      id,
      amount,
      userId,
      membershipName,
    );
  }
}
