import { Injectable } from '@nestjs/common';
import MercadoPagoConfig, { PreApproval } from 'mercadopago';

@Injectable()
export class PaymentsRepository {
  constructor() {}

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
