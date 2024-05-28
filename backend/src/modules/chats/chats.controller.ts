import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chats.service';

@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async saveMessage(
    @Body('userId') userId: string,
    @Body('room') room: string,
    @Body('message') message: { user: string; body: string },
  ) {
    const chat = await this.chatService.saveMessage(userId, room, message);
    return chat;
  }

  @Get('user/:userId')
  async getMessagesByUser(@Param('userId') userId: string) {
    const chats = await this.chatService.getMessagesByUser(userId);
    return chats;
  }

  @Get('room/:room')
  async getMessagesByRoom(@Param('room') room: string) {
    const chats = await this.chatService.getMessagesByRoom(room);
    return chats;
  }
}
