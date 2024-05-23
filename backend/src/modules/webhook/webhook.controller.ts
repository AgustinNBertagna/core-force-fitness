import { Body, Controller, Post, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Response } from 'express';
import MercadoPagoConfig, { Payment } from 'mercadopago';
/* import MercadoPagoConfig, { PreApproval } from 'mercadopago'; */

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async subscriptionWebhook(@Body() paymentData: any, @Res() res: Response) {
    console.log(
      'Acá está la info que tiene que llegar al webhook:',
      paymentData,
    );

    const accessToken = process.env.MP_PRODUCTION_ACCESS_TOKEN;

    const client = new MercadoPagoConfig({
      accessToken: accessToken as string,
      options: { timeout: 5000 },
    });

    const paymentId = paymentData.data.id;

    console.log('PaymentId:', paymentId);

    const payment = new Payment(client);

    const paymentInfo = await payment.get({
      id: paymentId,
    });

    console.log('Payment data:', paymentInfo);

    const email = paymentInfo.payer?.email;

    console.log('User email:', email);

    /* const { data } = paymentData;
    const subscriptionId = data.id;
    console.log(subscriptionId);

    const accessToken = process.env.MP_ACCESS_TOKEN;

    const client = new MercadoPagoConfig({
      accessToken: accessToken as string,
      options: { timeout: 5000 },
    });

    const preApproval = new PreApproval(client);

    const subscription = await preApproval.get({ id: subscriptionId });

    console.log('Subscription:', subscription); */

    /* const { payer_id } = subscription;

    console.log('Este es el payer id:', payer_id); */

    /*  if (!payer_id) throw new NotFoundException('payer id not found');

    const payerIdStr = payer_id.toString();

    const customerClient = new Customer(client);

    const customer = await customerClient.get({
      customerId: payerIdStr as string,
    });

    console.log(customer); */

    const action = paymentData.action;
    if (action === 'created') {
      // Handle initial subscription creation
      /* console.log('Subscription created:', data); */
      // Save or update subscription status as "pending" in the database
    } else if (action === 'updated') {
      // Handle subscription update (activation)
      /* console.log('Subscription updated:', data); */
      // Update subscription status to "active" in the database
    } else {
      /* console.log('Unhandled action:', action); */
    }

    return res
      .status(200)
      .json({ message: 'Subscription received successfully' });
  }
}
