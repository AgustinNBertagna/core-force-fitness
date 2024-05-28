import { Body, Controller, Post, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async subscriptionWebhook(@Body() paymentData: any, @Res() res: Response) {
    console.log(
      'Acá está la info que tiene que llegar al webhook:',
      paymentData,
    );

    const paymentId = paymentData.data.id;

    await this.webhookService.subscriptionWebhook(paymentId);

    return res
      .status(200)
      .json({ message: 'Subscription received successfully' });
  }
}
