import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ChatsModule } from './modules/chats/chats.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RateModule } from './modules/rate/rate.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { TrainersModule } from './modules/trainers/trainers.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm') as TypeOrmModule,
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    StripeModule,
    UsersModule,
    MembershipsModule,
    AuthModule,
    MessagesModule,
    ChatsModule,
    FilesModule,
    FirebaseModule,
    PaymentsModule,
    RateModule,
    WebhookModule,
    TrainersModule,
    ChatbotModule,
  ],
  providers: [],
})
export class AppModule {}
