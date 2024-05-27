import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message..entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async createMessage(msg: string, room: string, user: User): Promise<Message> {
    const message = this.messagesRepository.create({ msg, room, user });
    return this.messagesRepository.save(message);
  }

  async saveMessage(
    userId: string,
    room: string,
    message: { user: string; body: string },
  ) {
    let chat = await this.chatRepository.findOne({ where: { room } });
    if (!chat) {
      chat = new Chat();
      chat.iduser = userId;
      chat.room = room;
      chat.messages = [];
    }

    chat.messages.push(message);
    return await this.chatRepository.save(chat);
  }

  async getMessagesByUser(userId: string) {
    return await this.chatRepository.find({ where: { iduser: userId } });
  }

  async getMessagesByRoom(room: string) {
    return await this.chatRepository.find({ where: { room } });
  }
}
