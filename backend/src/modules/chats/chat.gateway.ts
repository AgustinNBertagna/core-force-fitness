import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chats.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('Init');
  }

  handleConnection(client: Socket) {
    console.log('a user has connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    console.log(`User Joined  room: ${room}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { body: string; room: string },
  ): Promise<void> {
    const user = client.handshake.auth.name ?? 'anonymous';
    const { body, room } = payload;
    console.log({ user, body, room });

    try {
      const newMessage = { user, body };
      await this.chatService.saveMessage(user, room, newMessage);
      this.server.to(room).emit('message', newMessage);
    } catch (error) {
      console.log(error);
    }
  }
}
