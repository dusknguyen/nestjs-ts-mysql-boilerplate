import { Module } from '@nestjs/common';
import { CommonModule } from 'core/common.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { AuthModule } from 'modules/auth/auth.module';

/**
 * Gateway module responsible for handling WebSocket connections and communication.
 * It includes services and gateway setup for managing rooms, client connections, and message broadcasts.
 */
@Module({
  imports: [CommonModule, AuthModule],
  controllers: [], // No controllers needed for WebSocket-based communication
  providers: [SocketGateway, SocketService], // Gateway and service responsible for managing WebSocket events
  exports: [SocketService], // Export SocketService if other modules require WebSocket-related functionalities
})
export class GatewayModule {}
