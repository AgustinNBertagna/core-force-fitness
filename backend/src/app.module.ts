import { Module, OnModuleInit } from '@nestjs/common';
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
import { UsersService } from './modules/users/users.service';
import { MembershipsService } from './modules/memberships/memberships.service';

@Module({
  imports: [
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
    UsersModule,
    MembershipsModule,
    AuthModule,
    MessagesModule,
    ChatsModule,
    FilesModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly membershipsService: MembershipsService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.membershipsService.addMemberships();
    await this.usersService.seedRoles();
  }
}
