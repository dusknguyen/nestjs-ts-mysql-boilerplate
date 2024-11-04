import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/join-room.dto';
import redisClient from './redis/redis.server';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplication } from '@nestjs/common';
import { AuthService } from 'modules/auth/services';

// Socket.IO server instance
let io: Server;

// Initialize Socket.IO server
export const useSocketIo = (app: INestApplication): Server => {
  io = new Server(app.getHttpServer(), {
    transports: ['polling', 'websocket'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  // Set up Redis adapter for Socket.IO
  const pubClient = redisClient;
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
  const ctx = { requestId: 'request-context-id' };
  app.get(AuthService);
  // Event: Socket connection initialization
  io.on('connection', (client: Socket) => {
    console.log(ctx, `Client connected: ${client.id}`);

    // Handle disconnect event
    client.on('disconnect', () => {
      console.log(ctx, `Client disconnected: ${client.id}`);
    });

    // Event: Join Room
    client.on('join-room', async (payload: JoinRoomDto) => {
      console.log('Client join room: ', client.id, payload);

      if (payload && payload.room.includes('USER') && payload.token) {
        //   const is_auth = await userAuthService.validateToken(payload.token);
        //   if (is_auth) {
        //     await client.join(payload.room);
        //     client.emit('join-room', payload.room); // Confirmation event
        //   } else {
        //     client.disconnect();
        //   }
      } else {
        await client.join(payload.room);
        client.emit('join-room', payload.room); // Confirmation event
      }
    });

    // Event: Leave Room
    client.on('leave-room', async (payload: { room: string }) => {
      await client.leave(payload.room);
      client.emit('leave-room', payload.room); // Confirmation event
    });
  });

  return io;
};

// Emit message to a specific room or client
/**
 *
 */
export function emitTo(payload: { id?: string; data: any; mEvent: string }) {
  const { id, data, mEvent } = payload;

  if (!io) {
    throw new Error('Socket.IO server is not initialized. Please call useSocketIo with an HTTP server first.');
  }

  if (id) {
    io.to(id).emit(mEvent, data); // Emit to a specific client by ID
  } else if (mEvent) {
    io.emit(mEvent, data); // Emit to all clients with an event name
  } else {
    io.emit('message', data); // Default event if mEvent is not specified
  }
}
