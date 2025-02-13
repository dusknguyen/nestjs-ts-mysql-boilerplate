import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createAdapter } from '@socket.io/redis-adapter';
import { JoinRoomDto } from 'modules/gateway/dtos/join-room.dto';
import { SocketService } from './socket.service';
import { AuthJWTService } from 'modules/auth/services/auth-jwt.service';
import configuration from 'config';
import { loggerInstance } from 'core/services/logger.service';
import { redisClients } from 'core/redis/redis.client';

const config = configuration();

/**
 * WebSocket Gateway for handling socket connections and rooms.
 */
@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins to connect
    methods: ['GET', 'POST'], // Supported HTTP methods
  },
})
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer() io!: Server;

  /**
   * Constructor for SocketGateway.
   * @param socketService Service for socket-related operations.
   * @param authJWTService Service for handling JWT authentication.
   */
  constructor(
    private readonly socketService: SocketService,
    private readonly authJWTService: AuthJWTService,
  ) {}

  /**
   * Initializes the module and sets up Redis adapter for distributed socket server.
   * This allows socket events to be broadcasted across multiple instances.
   */
  async onModuleInit() {
    const pubClient = redisClients.socket.pub;
    const subClient = redisClients.socket.sub;
    this.io.adapter(createAdapter(pubClient, subClient));

    // Pass the io instance to SocketService for cross-service emitting
    this.socketService.setSocketServer(this.io);

    loggerInstance.info('WebSocket gateway initialized with Redis adapter.');
  }

  /**
   * Handles new client connections.
   * @param client Socket instance of the client.
   */
  handleConnection(client: Socket) {
    loggerInstance.info(`Client connected: ${client.id}`);
  }

  /**
   * Handles client disconnections.
   * @param client Socket instance of the client.
   */
  handleDisconnect(client: Socket) {
    loggerInstance.info(`Client disconnected: ${client.id}`);
  }

  /**
   * Handles a client joining a room.
   * @param payload The data object containing room information and token.
   * @param payload.room The name of the room the client is joining.
   * @param client Socket instance of the client.
   */
  @SubscribeMessage('join-room')
  async handleJoinRoom(@MessageBody() payload: JoinRoomDto, @ConnectedSocket() client: Socket) {
    loggerInstance.info(`Client attempting to join room: ${client.id}, Room: ${payload.room}`);

    if (payload && payload.token) {
      // Token validation for authentication
      try {
        const isAuth = await this.authJWTService.validateAccessToken(
          payload.token,
          config.jwt.customer.accessToken.publicKey,
          config.jwt.customer.accessToken.algorithms,
        );

        if (!isAuth) {
          loggerInstance.warn(`Unauthorized client: ${client.id}, Room: ${payload.room}`);
          client.emit('error', 'Unauthorized');
          client.disconnect();
          return;
        }

        loggerInstance.info(`Client authenticated successfully: ${client.id}`);
      } catch (error: any) {
        loggerInstance.error(`Token validation failed for client: ${client.id}, Error: ${error.message}`);
        client.emit('error', 'Token validation failed');
        client.disconnect();
        return;
      }
    }

    // Successfully join the room
    await client.join(payload.room);
    loggerInstance.info(`Client joined room successfully: ${client.id}, Room: ${payload.room}`);
    client.emit('join-room', { room: payload.room, status: 'success' });
  }

  /**
   * Handles a client leaving a room.
   * @param payload Object containing the room name.
   * @param payload.room The name of the room the client is leaving.
   * @param client Socket instance of the client.
   */
  @SubscribeMessage('leave-room')
  async handleLeaveRoom(@MessageBody() payload: { room: string }, @ConnectedSocket() client: Socket) {
    loggerInstance.info(`Client leaving room: ${client.id}, Room: ${payload.room}`);

    await client.leave(payload.room);
    loggerInstance.info(`Client left room successfully: ${client.id}, Room: ${payload.room}`);
    client.emit('leave-room', { room: payload.room, status: 'success' });
  }
}
