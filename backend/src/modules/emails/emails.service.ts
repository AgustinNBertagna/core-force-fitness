import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

@Injectable()
export class EmailsService {
  constructor() {}
  private transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendWelcomeMail(username: string, recipient: string) {
    const template = fs.readFileSync('src/helpers/welcomeMail.html', 'utf-8');
    const welcomeEmail = template.replace(/nombreDeUsuario/g, username);
    const email = {
      from: process.env.MAIL_USER,
      to: recipient,
      subject: 'Welcome to CoreForce Fitness',
      html: welcomeEmail,
    };

    await this.transporter.sendMail(email);
  }

  async sendPricingEmail(username: string, recipient: string) {
    const pricingMail = fs.readFileSync(
      'src/helpers/pricingMail.html',
      'utf-8',
    );
    const email = {
      from: process.env.MAIL_USER,
      to: recipient,
      subject: `Hello dear ${username}! See our full pricing list!`,
      html: pricingMail,
    };

    await this.transporter.sendMail(email);
  }
}
