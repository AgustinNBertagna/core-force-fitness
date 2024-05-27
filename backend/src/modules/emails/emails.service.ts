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
    await Promise.all(
      freeUsers.map(async (user) => {
        const email = {
          from: process.env.MAIL_USER,
          to: user.email,
          subject: `Hello dear ${user.name}! See our full pricing list!`,
          html: pricingMail,
        };
        await this.transporter.sendMail(email);
      }),
    );
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async sendWeMissYouEmail() {
    const nonActiveUsers = await this.usersRepository.findBy({
      isActive: false,
    });
    if (!nonActiveUsers.length) return;
    const template = fs.readFileSync(
      'src/helpers/rememberUsEmail.html',
      'utf-8',
    );
    await Promise.all(
      nonActiveUsers.map(async (user) => {
        const rememberUsEmail = template.replace(/nombreDeUsuario/g, user.name);
        const email = {
          from: process.env.MAIL_USER,
          to: user.email,
          subject: `It's been a while, ${user.name}.`,
          html: rememberUsEmail,
        };
        await this.transporter.sendMail(email);
      }),
    );
  }
}
