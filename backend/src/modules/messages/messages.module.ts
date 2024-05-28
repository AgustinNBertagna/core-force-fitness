import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { UsersModule } from '../users/users.module';

import { Message } from 'src/entities/message..entity';
import { Chat } from 'src/entities/chat.entity';
import { User } from 'src/entities/user.entity';
import { MessagesController } from './messages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User]), UsersModule],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
