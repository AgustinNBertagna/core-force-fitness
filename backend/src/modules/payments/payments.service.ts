import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from '../users/users.repository';
import { MembershipsService } from '../memberships/memberships.service';
import { MercadoPagoConfig, PreApproval, PreApprovalPlan } from 'mercadopago';
import { Membership } from 'src/entities/membership.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly membershipsService: MembershipsService,
  ) {}

  async getSubscriptionUrl(membershipId: string) {
    const memberships: Membership[] =
      await this.membershipsService.getMemberships();

    const membership: Membership | undefined = memberships.find(
      (membership) => {
        return membership.id === membershipId;
      },
    );

    if (!membership) throw new NotFoundException('Membership not found');

    let preApprovalPlanId;

    if (membership.name === 'Platinum')
      preApprovalPlanId = '2c9380848f813057018f83b2942700f1';
    if (membership.name === 'Gold')
      preApprovalPlanId = '2c9380848f81302d018f83b3d09400f9';
    if (membership.name === 'Silver')
      preApprovalPlanId = '2c9380848f813057018f83b45c3a00f3';

    const accessToken = process.env.MP_ACCESS_TOKEN;

    const client = new MercadoPagoConfig({
      accessToken: accessToken as string,
      options: { timeout: 5000 },
    });

    const preApprovalPlan = new PreApprovalPlan(client);

    const { init_point } = await preApprovalPlan.get({
      preApprovalPlanId,
    });

    return init_point;
  }

  async createSubscription(
    userId: string,
    membershipId: string,
    card_token_id: string,
  ) {
    console.log(card_token_id);
    const user: User | null = await this.usersRepository.getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    const { name } =
      await this.membershipsService.getMembershipById(membershipId);

    const { startDate, endDate } =
      await this.membershipsService.assignMembership(user.id, name);

    const startDateStr = startDate.toString();
    const endDateStr = endDate.toString();

    const accessToken = process.env.MP_PRODUCTION_ACCESS_TOKEN;

    try {
      const client = new MercadoPagoConfig({
        accessToken: accessToken as string,
        options: { timeout: 5000 },
      });

      const preApprovalPlan = new PreApprovalPlan(client);

      const plan = await preApprovalPlan.get({
        preApprovalPlanId: '2c9380848f813057018f83b45c3a00f3',
      });

      console.log('Plan:', plan);

      const { id, reason, auto_recurring, back_url } = plan;

      console.log('Currency:', auto_recurring?.currency_id);

      const preApproval = new PreApproval(client);

      const subscriptionPayload = {
        body: {
          preapproval_plan_id: id,
          reason,
          external_reference: 'SM-1234',
          payer_email: 'test_user@testuser.com',
          card_token_id,
          auto_recurring: {
            frequency: auto_recurring?.frequency as number,
            frequency_type: auto_recurring?.frequency_type as string,
            start_date: startDateStr,
            end_date: endDateStr,
            transaction_amount: auto_recurring?.transaction_amount,
            currency_id: auto_recurring?.currency_id as string,
          },
          back_url,
          status: 'authorized',
        },
      };

      console.log(subscriptionPayload);

      const preApprovalResponse = await preApproval.create(subscriptionPayload);

      console.log('Subscription created successfully:', preApprovalResponse);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
