import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Param,
  Get,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

@Controller('api/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createMessage(@Body() body, @Res() res: Response) {
    const { msg, room, userId } = body;
    const user = await this.usersService.findUserById(userId);
    if (user) {
      const message = await this.messagesService.createMessage(msg, room, user);
      res.status(HttpStatus.CREATED).json({ message });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'User not found' });
    }
  }

  @Get('/messages/user/:userId')
  async getMessagesByUser(@Param('userId') userId: string) {
    const chats = await this.messagesService.getMessagesByUser(userId);
    return chats;
  }

  @Get('/messages/room/:room')
  async getMessagesByRoom(@Param('room') room: string) {
    const chats = await this.messagesService.getMessagesByRoom(room);
    return chats;
  }
}
