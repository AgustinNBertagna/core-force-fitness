import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../users/users.repository';
import { MembershipsService } from '../memberships/memberships.service';
import { MercadoPagoConfig, PreApproval, PreApprovalPlan } from 'mercadopago';
import { Membership } from 'src/entities/membership.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMemberships } from 'src/entities/userMembership.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly membershipsService: MembershipsService,
    @InjectRepository(UserMemberships)
    private userMemberships: Repository<UserMemberships>,
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

  async cancelSubscription(userId: string) {
    const userMembership: UserMemberships | null =
      await this.userMemberships.findOne({
        where: { user: { id: userId }, is_active: true },
      });

    if (!userMembership)
      throw new NotFoundException('User membership not found');

    const { preapproval_id } = userMembership;

    const accessToken = process.env.MP_ACCESS_TOKEN;

    const client = new MercadoPagoConfig({
      accessToken: accessToken as string,
      options: { timeout: 9000 },
    });

    const preApproval = new PreApproval(client);

    await preApproval.update({
      id: preapproval_id,
      body: {
        status: 'cancelled',
      },
    });

    return { message: 'Subscription successfully cancelled' };
  }
}
