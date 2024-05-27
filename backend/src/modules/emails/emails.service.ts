import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
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

  @Cron(CronExpression.EVERY_WEEK)
  async sendPricingEmail() {
    const freeUsers = await this.usersRepository.find({
      where: { user_membership: { membership: { name: 'Free' } } },
      select: { name: true, email: true },
    });
    if (!freeUsers.length) return;
    const pricingMail = fs.readFileSync(
      'src/helpers/pricingMail.html',
      'utf-8',
    );
    const email = {
      from: process.env.MAIL_USER,
      to: '',
      subject: '',
      html: pricingMail,
    };
    await Promise.all(
      freeUsers.map(async (user) => {
        email.to = user.email;
        email.subject = `Hello dear ${user.name}! See our full pricing list!`;
        await this.transporter.sendMail(email);
      }),
    );
  }
}
