import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';
import { ChatController } from './chats.controller';
import { ChatService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message..entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User]), UsersModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatsModule {}
