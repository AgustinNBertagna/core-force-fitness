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
}
