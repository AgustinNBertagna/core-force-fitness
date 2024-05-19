import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { MembershipsService } from '../memberships/memberships.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private membershipsService: MembershipsService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async subscribeToMembership(
    id: string,
    amount: number,
    userId: string,
    membershipName: string,
  ) {
    await this.stripe.paymentIntents.create({
      amount,
      currency: 'BRL',
      description: 'Membership Subscription',
      payment_method: id,
      confirm: true,
      return_url: 'http://localhost:5173/',
    });
    await this.membershipsService.assignMembership(userId, membershipName);
    return { message: 'Subscription succesfully created' };
  }
}
