import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

/**
 * Service responsible for managing socket connections and emitting events.
 */
@Injectable()
export class SocketService {
  private io!: Server;

  /**
   * Sets the Socket.IO server instance.
   * @param io The Socket.IO server instance.
   */
  setSocketServer(io: Server): void {
    this.io = io;
  }

  /**
   * Emits an event to a specific client or all clients.
   * @param payload Object containing event details:
   *   - `id`: The client ID to send the event to (optional).
   *   - `data`: The data to send with the event.
   *   - `mEvent`: The name of the event to emit.
   * @param payload.id (optional) The client ID to send the event to.
   * @param payload.data The data to send with the event.
   * @param payload.mEvent The name of the event to emit.
   */
  emitTo(payload: { id?: string; data: any; mEvent: string }): void {
    const { id, data, mEvent } = payload;

    // Ensure the Socket.IO server is initialized
    if (!this.io) {
      throw new Error('Socket.IO server is not initialized.');
    }

    // Emit to a specific client if `id` is provided, otherwise to all clients
    if (id) {
      this.io.to(id).emit(mEvent, data); // Send event to a specific client
    } else if (mEvent) {
      this.io.emit(mEvent, data); // Send event to all clients
    } else {
      this.io.emit('message', data); // Default message event if no event name is provided
    }
  }
}
