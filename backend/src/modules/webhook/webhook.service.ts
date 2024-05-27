import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { MembershipsService } from '../memberships/memberships.service';
import { UserRepository } from '../users/users.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class WebhookService {
  constructor(
    private readonly membershipService: MembershipsService,
    private readonly usersRepository: UserRepository,
  ) {}

  async subscriptionWebhook(paymentId: string): Promise<void> {
    const accessToken = process.env.MP_PRODUCTION_ACCESS_TOKEN;

    const client = new MercadoPagoConfig({
      accessToken: accessToken as string,
      options: { timeout: 5000 },
    });

    const payment = new Payment(client);

    const paymentInfo = await payment.get({
      id: paymentId,
    });

    console.log('Payment info:', paymentInfo);

    const preapprovalId = paymentInfo.metadata.preapproval_id;

    const email = paymentInfo.payer?.email;

    if (!email) throw new BadRequestException('Invalid email');

    const membershipName = paymentInfo.description?.split(' ')[0];

    if (!membershipName) throw new BadRequestException('Invalid membership');

    const user: User | null = await this.usersRepository.getUserByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    await this.membershipService.assignMembership(
      user.id,
      membershipName,
      preapprovalId,
    );
  }
}
