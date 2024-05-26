import { Injectable, NotFoundException } from '@nestjs/common';
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

  async cancelSubscription(preapprovalId: string) {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    const client = new MercadoPagoConfig({
      accessToken: accessToken as string,
      options: { timeout: 9000 },
    });

    const preApproval = new PreApproval(client);

    await preApproval.update({
      id: preapprovalId,
      body: {
        status: 'cancelled',
      },
    });
  }
}
