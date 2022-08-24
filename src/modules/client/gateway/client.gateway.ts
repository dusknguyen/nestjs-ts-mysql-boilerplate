/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ClientGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  afterInit() {}

  handleDisconnect(socket: Socket) {
    console.log(`Disconnected: ${socket.id}`);
  }

  handleConnection(socket: Socket) {
    console.log(`Connected ${socket.id}`);
  }
}
