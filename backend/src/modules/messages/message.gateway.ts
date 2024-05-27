import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesService } from './messages.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: true })
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;

    // Validar que userId es un número válido
    if (!userId || isNaN(Number(userId))) {
      console.log('Invalid userId');
      return client.disconnect();
    }

    const user = await this.usersService.findUserById(Number(userId));
    if (user) {
      client.data.user = user; // Almacenar el usuario en el socket
      console.log(`${user.name} has connected`);
    } else {
      client.disconnect(); // Desconectar si el usuario no es válido
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`${client.data.user.name} has disconnected`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    this.server
      .to(room)
      .emit(
        'userJoined',
        `${client.data.user.name} has joined the room: ${room}`,
      );
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { msg: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (user) {
      const message = await this.messagesService.createMessage(
        data.msg,
        data.room,
        user,
      );
      console.log(message);

      this.server
        .to(data.room)
        .emit('message', { user: user.name, msg: data.msg });
    }
  }
}
