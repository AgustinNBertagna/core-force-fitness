import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoConfig, PreApprovalPlan } from 'mercadopago';
import { Membership } from '../../entities/membership.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMemberships } from 'src/entities/userMembership.entity';
import { Repository } from 'typeorm';
import { PaymentsRepository } from './payments.repository';
/* import { MembershipsService } from '../memberships/memberships.service'; */

@Injectable()
export class PaymentsService {
  constructor(
    /* private readonly membershipsService: MembershipsService, */
    private readonly paymentsRepository: PaymentsRepository,
    @InjectRepository(UserMemberships)
    private userMemberships: Repository<UserMemberships>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  async getSubscriptionUrl(membershipId: string) {
    /*  const memberships: Membership[] =
      await this.membershipsService.getMemberships(); */

    const memberships: Membership[] = await this.membershipRepository.find();

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

    await this.paymentsRepository.cancelSubscription(preapproval_id);

    await this.userMemberships.update(
      { id: userMembership.id },
      { is_active: false },
    );

    await this.userMemberships.update(
      {
        user: { id: userId },
        membership: { id: '40674db0-55f0-4621-8e65-3d6dbafc9776' },
      },
      { is_active: true },
    );

    return { membership_Name: 'Free' };
  }
}
