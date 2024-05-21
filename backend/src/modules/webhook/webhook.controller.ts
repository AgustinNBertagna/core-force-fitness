import { Body, Controller, Post, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async subscriptionWebhook(@Body() data: any, @Res() res: Response) {
    console.log(data);

    const action = data.action;
    if (action === 'created') {
      // Handle initial subscription creation
      console.log('Subscription created:', data);
      // Save or update subscription status as "pending" in the database
    } else if (action === 'updated') {
      // Handle subscription update (activation)
      console.log('Subscription updated:', data);
      // Update subscription status to "active" in the database
    } else {
      console.log('Unhandled action:', action);
    }

    return res
      .status(200)
      .json({ message: 'Subscription received successfully' });
  }
}
