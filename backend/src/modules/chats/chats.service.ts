import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async saveMessage(
    userId: string,
    room: string,
    message: { user: string; body: string },
  ) {
    let chat = await this.chatRepository.findOne({ where: { room } });
    if (!chat) {
      chat = new Chat();
      chat.userId = userId;
      chat.room = room;
      chat.messages = [];
    }

    chat.messages.push(message);
    return this.chatRepository.save(chat);
  }

  async getMessagesByUser(userId: string) {
    return this.chatRepository.find({ where: { userId } });
  }

  async getMessagesByRoom(room: string) {
    return this.chatRepository.find({ where: { room } });
  }
}
